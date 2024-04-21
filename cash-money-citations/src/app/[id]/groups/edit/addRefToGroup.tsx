'use client'
import { useCallback, useMemo, useState } from "react";
import { Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue, Selection, Chip, ChipProps, Button } from "@nextui-org/react";
import { CSLBibInterface } from "@/models/CSLBibTex";
let { format } = require('@citation-js/date')

type Props = {
    formId: string;
    references: any[];
}

const AddReferenceToGroup = (props: Props) => {

    const userRefs = props.references;
    type UserReference = typeof userRefs[0];

    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));

    const [page, setPage] = useState(1);
    const rowsPerPage = 6;

    const pages = Math.ceil(props.references.length / rowsPerPage);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return props.references.slice(start, end);
    }, [page, props.references]);

    const statusColorMap: Record<string, ChipProps["color"]> = {
        active: "success",
        paused: "danger",
        vacation: "warning",
      };

    const renderCell = useCallback((userRef: UserReference, columnKey: React.Key) => {
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
                      return <Chip className="capitalize" color={statusColorMap[userRef.status]} size="sm" variant="flat" key={contributor._id}>{contributor.given} {contributor.family}</Chip>
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
          case "type":
            return (
              <>
              <Chip>
                {cellValue}
              </Chip>
              </>
            )
          default:
            return cellValue;
        }
      }, []);

    return (
        <>
            <div className="flex items-center justify-center p-">
                <form className="w-full">
                <Table 
                    aria-label="Example table with custom cells, pagination and sorting"
                    bottomContent={
                        <div className="flex w-full justify-center">
                        <Pagination
                            isCompact
                            showControls
                            showShadow
                            color="secondary"
                            page={page}
                            total={pages}
                            onChange={(page) => setPage(page)}
                        />
                        </div>
                    }
                    classNames={{
                        wrapper: "min-h-[222px]",
                    }}
                    selectionMode="multiple"
                    selectedKeys={selectedKeys}
                    onSelectionChange={setSelectedKeys}
                    >
                    <TableHeader>
                        <TableColumn key="title">TITLE</TableColumn>
                        <TableColumn key="contributors">CONTRIBUTORS</TableColumn>
                        <TableColumn key="type">TYPE</TableColumn>
                    </TableHeader>
                    <TableBody items={items}>
                        {(item: CSLBibInterface) => (
                            <TableRow key={item._id}>
                                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <Button
                  color="success"
                  type="submit"> 
                    Add References To Group
                </Button>
                </form>
            </div>
        </>
    )
}

export default AddReferenceToGroup;