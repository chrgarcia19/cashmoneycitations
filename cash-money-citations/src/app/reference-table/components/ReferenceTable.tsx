'use client'

import React, { Suspense, useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  User,
  Pagination,
  Selection,
  ChipProps,
  SortDescriptor,
  skeleton,
  Tooltip
} from "@nextui-org/react";
import {PlusIcon} from "./PlusIcon";
import {VerticalDotsIcon} from "./VerticalDotIcon";
import {ChevronDownIcon} from "./ChevronDownloadIcon";
import {SearchIcon} from "./SearchIcon";
import {columns, statusOptions} from "./data";
import {capitalize} from "./utils";
import { getUserReferences } from "@/components/componentActions/actions";
import DisplayTags from "@/components/DisplayTags";
let { parse, format } = require('@citation-js/date')
import {Skeleton} from "@nextui-org/react";
import {EditIcon} from "./EditIcon";
import {DeleteIcon} from "./DeleteIcon";
import {EyeIcon} from "./EyeIcon";
import Link from "next/link";
import { CSLBibInterface } from "@/models/CSLBibTex";
import { useRouter } from "next/navigation";
import { Tag } from "@/models/Tag";

const statusColorMap: Record<string, ChipProps["color"]> = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

const INITIAL_VISIBLE_COLUMNS = ["title", "datePublished", "contributors", "actions", "tags"];



export default function TestRefTable(userRefObject: any) {
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "datePublished",
    direction: "ascending",
  });

  const userRefs = userRefObject.userRefObject;
  type UserReference = typeof userRefs.userRefs[0];

  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredReferences = [...userRefs];

    if (hasSearchFilter) {
      filteredReferences = filteredReferences.filter((user) =>
        user.title[0].toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
      filteredReferences = filteredReferences.filter((user) =>
        Array.from(statusFilter).includes(user.status),
      );
    }

    return filteredReferences;
  }, [userRefs, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: UserReference, b: UserReference) => {
      const first = a[sortDescriptor.column as keyof UserReference] as number;
      const second = b[sortDescriptor.column as keyof UserReference] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const router = useRouter();

    const handleDelete = async (refID: string) => {
        try {
          await fetch(`/api/references/${refID}`, {
            method: "Delete",
          });
          
        } catch (error) {
        }
    };

    async function exportSingleCitation(refId: string) {
        // Call to server action to create citations & save in DB
        router.push(`/displayCitation?citation=${refId}`)
    }

    async function exportMultipleCitation(refIds: string[]) {
        // Call to server action to create citations & save in DB
        router.push(`/displayCitation?citation=${refIds}`)
    }

    const handleDeleteMany = async (refIDs: string[]) => {
        for (let i = 0; i < refIDs.length; i++){
            try {
                await fetch(`/api/references/${refIDs[i]}`, {
                    method: "Delete"
                });
            } catch (error) {
            }
        }
        router.push('/reference-table');
        router.refresh();
    }

  const [reference, setReference] = useState<CSLBibInterface[]>([]);

  useEffect(() => {
    const newSortedItems = [...items].sort((a: UserReference, b: UserReference) => {
      const first = a[sortDescriptor.column as keyof UserReference] as number;
      const second = b[sortDescriptor.column as keyof UserReference] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;
  
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  
    setReference(newSortedItems);
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((userRef: UserReference, columnKey: React.Key) => {
    const cellValue = userRef[columnKey as keyof UserReference];
    switch (columnKey) {
      case "title":
        return (
          <div>
            {cellValue}
          </div>
        );
      case "datePublished":
        const date = format(userRef.cslJson[0].issued);
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{date}</p>
          </div>
        );
      case "contributors":
        return (
          <>
              {userRef.contributors.slice(0, 3).map((contributor: any) => {
                  return <Chip className="capitalize" color={statusColorMap[userRef.status]} size="sm" variant="flat" key={contributor._id}>{contributor.given}</Chip>
              })}
              {userRef.contributors.length > 3 ?
                  <div>And {userRef.contributors.length - 3} more</div> 
                  : ""
              }
          </>
        );
      case "tags":
        return (
          <>
            {userRef.tagID.map((id: string) => (
              <Suspense key={id} fallback={<Skeleton className="h-3 w-2/5 rounded-lg bg-default-300"><span className="sm"/> </Skeleton>}>
                <DisplayTags key={id} tagId={id} />
              </Suspense>
            ))}
          </>
        )
      case "type":
        return (
          <>
          <Chip>
            {cellValue}
          </Chip>
          </>
        )
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="View">
              <Link className="text-lg text-default-400 cursor-pointer active:opacity-50" href={{ pathname: `/${userRef._id}/references/view`, query: { id: userRef._id} } }>
                <EyeIcon />
              </Link>
            </Tooltip>
            <Tooltip content="Edit">
              <Link className="text-lg text-default-400 cursor-pointer active:opacity-50" style={{display: 'grid'}} href={{ pathname: `/${userRef._id}/references/edit`, query: { id: userRef._id} } }>
                  <EditIcon />
              </Link>
            </Tooltip>
            <Tooltip color="danger" content="Delete">
              <button className="text-lg text-danger cursor-pointer active:opacity-50"
                    onClick={() => handleDelete(userRef._id)}>
                      <DeleteIcon />
              </button>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(()=>{
    setFilterValue("")
    setPage(1)
  },[])

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button color="primary" endContent={<PlusIcon />}>
              Add New
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {userRefs.length} users</span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    userRefs.length,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
            Previous
          </Button>
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  return (
    <Table
      aria-label="Example table with custom cells, pagination and sorting"
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: "max-h-[80%]",
      }}
      selectedKeys={selectedKeys}
      selectionMode="multiple"
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"No references found"} items={reference}>
        {(item) => (
          <TableRow key={item._id}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
