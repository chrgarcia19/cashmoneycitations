'use client'

import React, { Suspense, createContext, useContext, useEffect, useMemo, useState } from "react";
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
  Pagination,
  Selection,
  ChipProps,
  SortDescriptor,
  Tooltip,
  ButtonGroup,
  DropdownSection
} from "@nextui-org/react";
import {PlusIcon} from "./PlusIcon";
import {ChevronDownIcon} from "./ChevronDownloadIcon";
import {SearchIcon} from "./SearchIcon";
import {columns} from "./data";
import {capitalize} from "./utils";
import DisplayTags from "@/components/DisplayTags";
let { format } = require('@citation-js/date')
import {Skeleton} from "@nextui-org/react";
import {DeleteIcon} from "./DeleteIcon";
import Link from "next/link";
import { CSLBibInterface } from "@/models/CSLBibTex";
import { useRouter } from "next/navigation";
import { ExportMultipleReferences } from "../actions";
import { BsEye } from "react-icons/bs";
import { TbEdit } from "react-icons/tb";
import { localeLabelSelect } from "./language-selections"
import DisplayGroups from "@/components/DisplayGroups";
import { LogCMCError } from "@/components/componentActions/logActions";

const ReferenceContext = createContext({
  references: [],
  referenceIds: [],
  setReferenceIds: (newReferenceIds: any[]) => {},
  setReferences: (newSortedItems: any[]) => {},
  addReference: (newSortedItems: any[]) => {},
  removeReference: () => {},
  selectedReferenceIds: [],
  setSelectedReferenceIds: (referenceIds: any[]) => {},
});

export function ReferenceProvider({ children }: any) {
    const [references, setReferences] = useState<CSLBibInterface[]>([]);
    const [referenceIds, setReferenceIds] = useState([]);
    const [selectedReferenceIds, setSelectedReferenceIds] = useState(() => {
      if (typeof window !== 'undefined') {
        const storedIds = localStorage.getItem('selectedReferenceIds');
        return storedIds ? JSON.parse(storedIds) : [];
    }
    });


    const addReference = (reference: any) => {
      setReferences((prevReferences) => [...prevReferences, reference]);
    };
    
    const removeReference = (referenceId: any) => {
      setReferences((prevReferences) => prevReferences.filter((ref) => ref.id !== referenceId));
    };

    // Update localStorage whenever selectedReferenceIds changes
    useEffect(() => {
      localStorage.setItem('selectedReferenceIds', JSON.stringify(selectedReferenceIds));
    }, [selectedReferenceIds]);

    return (
      <ReferenceContext.Provider value={{ references, setReferences, addReference, removeReference, referenceIds, setReferenceIds, selectedReferenceIds, setSelectedReferenceIds  }as any}>
        {children}
      </ReferenceContext.Provider>
    );
}

export function useReferenceContext() {
  return useContext(ReferenceContext);
}



const statusColorMap: Record<string, ChipProps["color"]> = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

const INITIAL_VISIBLE_COLUMNS = ["title", "yearPublished", "contributors", "createdAt", "actions", "tags", "groups"];


export default function ReferenceTable(userRefObject: any) {
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const [reference, setReference] = useState<CSLBibInterface[]>([]);
  const { references, setReferences, addReference, removeReference, referenceIds, setReferenceIds, selectedReferenceIds, setSelectedReferenceIds } = useContext(ReferenceContext);
  const [refLength, setRefLength] = useState(userRefObject.userRefObject.length);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "createdAt",
    direction: "ascending",
  });
  const [langSearch, setLangSearch] = useState('');
  const [localeChoice, setLocaleChoice] = useState('');

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

    return filteredReferences;
  }, [userRefs, filterValue, statusFilter]);

  // useMemo to filter cslStyles based on the searchTerm
  // This ensures filtering logic is only re-evaluated when cslStyles or searchTerm changes
  const filteredLocales = useMemo(() => {
    return localeLabelSelect?.filter((label: string) =>
      label.toLowerCase().includes(langSearch.toLowerCase())
    );
  }, [langSearch]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);


  const router = useRouter();

    const handleDelete = async (refID: string) => {
      const deleteConfirm = confirm("Are you sure you want to delete this reference?");
      if (deleteConfirm){
        try {
          await fetch(`/api/references/${refID}`, {
            method: "Delete",
          });
          // Filter out the item with the given refID
          const newReferences = items.filter(item => item._id !== refID);
          // Set state to new reference array
          setReferences(newReferences);
          setRefLength(newReferences.length);
        } catch (error: any) {
          LogCMCError("WARNING", 'REFERENCE', error);
          console.error(error);
        }
      }
    };

    const handleDeleteMany = async (deleteAll: boolean, idsToDelete: string[]) => {
      const deleteConfirm = confirm("Are you sure you want to delete these references?");
      if (deleteConfirm){
        if (deleteAll) {
          idsToDelete = referenceIds;
        }
  
        let newReferences = [...items]; // Copy the current items
  
          // Collect all fetch promises in an array
        const fetchPromises = idsToDelete.map(refID =>
          fetch(`/api/references/${refID}`, {
            method: "Delete"
          })
        );
  
        try {
          // Wait for all fetch requests to complete
          await Promise.all(fetchPromises);
  
          // Filter out the items with the given refIDs
          newReferences = newReferences.filter(item => !idsToDelete.includes(item._id));
  
          // Set state to new reference array
          setReferences(newReferences);
          setRefLength(newReferences.length);
  
          // Filter out the deleted refIDs from selectedKeys
          //const newSelectedKeys = new Set([...selectedKeys].filter(key => !refIDs.includes(key)));
          setSelectedKeys(new Set([]));
        } catch (error: any) {
          LogCMCError("WARNING", 'REFERENCE', error);
          console.error(error);
        }
      }    
    }


  useEffect(() => {
    const newSortedItems = [...items].sort((a: UserReference, b: UserReference) => {
      const first = a[sortDescriptor.column as keyof UserReference];
      const second = b[sortDescriptor.column as keyof UserReference];
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  
    // Calling setReferences since it is replacing the entire array
    setReferences(newSortedItems);
    setReferenceIds(newSortedItems.map((item: any) => item._id));
  }, [sortDescriptor, items]);

  // Update currently selected referenceIds
  useEffect(() => {

    if (selectedKeys === "all") {
      setSelectedReferenceIds(referenceIds);
    } else if(selectedKeys instanceof Set) {
      setSelectedReferenceIds(Array.from(selectedKeys));

    }

  }, [selectedKeys]);

  const renderCell = React.useCallback((userRef: UserReference, columnKey: React.Key) => {
    const cellValue = userRef[columnKey as keyof UserReference];
    switch (columnKey) {
      case "title":
        return (
          <div>
            {cellValue}
          </div>
        );
      case "yearPublished":
        let datePublished = format(userRef.cslJson[0].issued);
        datePublished = new Date(datePublished);
        datePublished = datePublished.getFullYear();
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{datePublished}</p>
          </div>
        );
      case "contributors":
        return (
          <>
              {userRef.contributors.slice(0, 3).map((contributor: any) => {
                  return <Chip className="capitalize" color={statusColorMap[userRef.status]} size="sm" variant="flat" key={contributor._id}>{contributor.family}</Chip>
              })}
              {userRef.contributors.length > 3 ?
                  <div>And {userRef.contributors.length - 3} more</div> 
                  : ""
              }
          </>
        );
      case "createdAt":
          let dateCreated = userRef.createdAt;
          dateCreated = new Date(dateCreated);
          dateCreated = dateCreated.toLocaleString('en-US');
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize">{dateCreated}</p>
            </div>
          );
      case "tags":
        return (
          <>
            {userRef.tagId.map((id: string) => (
              <Suspense key={id} fallback={<Skeleton className="h-3 w-2/5 rounded-lg bg-default-300"><span className="sm"/> </Skeleton>}>
                <DisplayTags tagId={id} />
              </Suspense>
            ))}
          </>
        )
        case "groups":
          return (
            <>
              {userRef.groupId.map((id: string) => (
                <Suspense key={id} fallback={<Skeleton className="h-3 w-2/5 rounded-lg bg-default-300"><span className="sm"/> </Skeleton>}>
                  <DisplayGroups groupId={id} />
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
              <BsEye />
            </Link>
          </Tooltip>
          <Tooltip content="Edit">
            <Link className="text-lg text-default-400 cursor-pointer active:opacity-50" style={{display: 'grid'}} href={{ pathname: `/${userRef._id}/references/edit`, query: { id: userRef._id} } }>
              <TbEdit />
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

  const handleLocaleChoiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLocaleChoice = e.target.value;
    setLocaleChoice(newLocaleChoice);
  };

  async function DownloadReferences(exportType: string, lang: string) {
    let formattedReferences = '';
    // Retrieve selectedReferences from the localstorage
    let localStorageRefIds = localStorage.getItem('selectedReferenceIds')
    if (localStorageRefIds) {
      localStorageRefIds = JSON.parse(localStorageRefIds)
    }
    switch (exportType) {
      case 'biblatex':
          
          formattedReferences = await ExportMultipleReferences(exportType, localStorageRefIds ? localStorageRefIds : [], lang)
          const biblatexBlob = new Blob([formattedReferences], {type: 'application/text'});

          // Create a link element
          const bibLaTexLink = document.createElement('a');

          // Set the download attribute of the link element
          bibLaTexLink.download = `reference.bib`;

          // Create a URL for the blob and set it as the href of the link
          bibLaTexLink.href = URL.createObjectURL(biblatexBlob);

          // Append the link to the body
          document.body.appendChild(bibLaTexLink);

          // Trigger a click on the link to start the download
          bibLaTexLink.click();

          // Remove the link from the body
          document.body.removeChild(bibLaTexLink);

          break;
      case 'bibtex':
          formattedReferences = await ExportMultipleReferences(exportType, localStorageRefIds ? localStorageRefIds : [], lang)
          const bibtexBlob = new Blob([formattedReferences], {type: 'application/text'});

          // Create a link element
          const bibtexLink = document.createElement('a');

          // Set the download attribute of the link element
          bibtexLink.download = `reference.bib`;

          // Create a URL for the blob and set it as the href of the link
          bibtexLink.href = URL.createObjectURL(bibtexBlob);

          // Append the link to the body
          document.body.appendChild(bibtexLink);

          // Trigger a click on the link to start the download
          bibtexLink.click();

          // Remove the link from the body
          document.body.removeChild(bibtexLink);
          break;
      case 'csljson':
          formattedReferences = await ExportMultipleReferences(exportType, localStorageRefIds ? localStorageRefIds : [], lang)
          const jsonBlob = new Blob([formattedReferences], {type: 'application/json'});

          // Create a link element
          const jsonLink = document.createElement('a');

          // Set the download attribute of the link element
          jsonLink.download = `reference.json`;

          // Create a URL for the blob and set it as the href of the link
          jsonLink.href = URL.createObjectURL(jsonBlob);

          // Append the link to the body
          document.body.appendChild(jsonLink);

          // Trigger a click on the link to start the download
          jsonLink.click();

          // Remove the link from the body
          document.body.removeChild(jsonLink);
          break;
      default:
          throw new Error(`Unsupported Export Type: ${exportType}`);
  }
}
  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4 my-[2.5%] max-h-[80%] z-[1]">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by title..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3 p-4">
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
            <Link className="text-lg text-default-400 cursor-pointer active:opacity-50" href={{ pathname: `/new`}}>
              <Button color="primary" endContent={<PlusIcon />}>
                Add Reference
              </Button>
            </Link>
          </div>
        </div>
          <div className="flex justify-end gap-4 items-center p-4">
            <span className="text-default-400 text-small">
              <ButtonGroup variant="flat">
              <Dropdown>
                  <DropdownTrigger >
                    {selectedKeys === "all"
                    ? 
                    <Button variant="bordered">
                      Lang <ChevronDownIcon />
                    </Button>

                    :
                    (selectedKeys instanceof Set && selectedKeys.size > 0)
                      ?
                      <Button variant="bordered">
                        Lang <ChevronDownIcon />
                      </Button>
                      :
                      <Button isDisabled variant="bordered">
                        Lang <ChevronDownIcon />
                      </Button>
                    }

    
                  </DropdownTrigger>
                  <DropdownMenu variant="faded" aria-label="Dropdown menu with description"
                  topContent={
                    <input
                      type="text"
                      placeholder="Search Languages..."
                      className="mb-4 w-full p-2 text-gray-700 leading-tight"
                      value={langSearch}
                      onChange={(e) => setLangSearch(e.target.value)}
                    />}

                  >
                    <DropdownSection
                      style={{ maxHeight: '200px', overflowY: 'auto' }}
                    >
                      {filteredLocales.map((locale: any) => (
                        <DropdownItem key={locale} className="flex items-center justify-between bg-white rounded-lg shadow">
                          <label htmlFor={`locale-${locale}`} className="flex items-center w-full">
                            <input
                              id={`locale-${locale}`}
                              type="radio"
                              name="locales"
                              value={locale}
                              checked={localeChoice === locale}
                              onChange={handleLocaleChoiceChange}
                              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2"
                            />
                            <span className="text-sm text-gray-800 font-sm">{locale}</span>
                          </label>
                        </DropdownItem>
                      ))}
                    </DropdownSection>
  

                  </DropdownMenu>

                </Dropdown>
                <Dropdown>
                  <DropdownTrigger >
                    {selectedKeys === "all"
                    ? 
                    <Button variant="bordered">
                      Export All
                    </Button>

                    :
                    (selectedKeys instanceof Set && selectedKeys.size > 0)
                      ?
                      <Button variant="bordered">
                        Export Selected
                      </Button>
                      :
                      <Button isDisabled variant="bordered">
                        Export
                      </Button>
                    }

    
                  </DropdownTrigger>
                  <DropdownMenu variant="faded" aria-label="Dropdown menu with description">
                    <DropdownItem key="new" value="biblatex" onClick={e => DownloadReferences("biblatex", localeChoice)}>
                      BibLaTeX
                    </DropdownItem>
                    <DropdownItem key="new" value="bibtex" onClick={e => DownloadReferences("bibtex", localeChoice)}>
                      BibTeX
                    </DropdownItem>
                    <DropdownItem key="new" value="csljson" onClick={e => DownloadReferences("csljson", localeChoice)}>
                      CSL-JSON
                    </DropdownItem>
                  </DropdownMenu>
                
                </Dropdown>
              </ButtonGroup>


            </span>
            <span className="text-default-400 text-small">
              {selectedKeys === "all"
                ?
                <Link className="text-lg text-default-400 cursor-pointer active:opacity-50" href={{ pathname: `/displayCitation`}}>
                  <Button color="primary" endContent={<PlusIcon />}>
                    Bibliography with all
                  </Button>
                </Link>
                :
                (selectedKeys instanceof Set && selectedKeys.size > 0)
                  ?
                  <Link className="text-lg text-default-400 cursor-pointer active:opacity-50" href={{ pathname: `/displayCitation`}}>
                    <Button color="primary" endContent={<PlusIcon />}>
                      Bibliography with selected
                    </Button>
                  </Link>
                  :
                  <Link className="text-lg text-default-400 cursor-pointer active:opacity-50" href={{ pathname: `/displayCitation`}}>
                    <Button isDisabled color="primary" endContent={<PlusIcon />}>
                      Bibliography
                    </Button>
                  </Link>
                }

              </span>
              <span className="text-default-400 text-small">
              {selectedKeys === "all"
                ?
                <Button color="danger" onClick={() => handleDeleteMany(true, [])}>
                  <DeleteIcon />
                  Delete All
                </Button>
                :
                (selectedKeys instanceof Set && selectedKeys.size > 0)
                  ?
                  <Button color="danger" onClick={() => handleDeleteMany(false, Array.from(selectedKeys as Set<React.Key>).map(String))}>
                    <DeleteIcon />
                    Delete Selected
                  </Button>
                  :
                  <Button isDisabled color="danger">
                    <DeleteIcon />
                    Delete Selected
                  </Button>
              }

            </span>
          </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">{refLength} Total References</span>
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
    refLength,
    selectedKeys,
    langSearch,
    localeChoice
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${refLength} selected`}
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
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter, refLength]);

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
      <TableBody emptyContent={"No references found"} items={references} >
        {(item: { _id: string }) => (
          <TableRow key={item._id}>
            {(columnKey) => <TableCell className="dark:text-white">{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
