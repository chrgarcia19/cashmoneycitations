'use client'
import { useCallback, useEffect, useMemo, useState } from "react";
import { Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue, Selection, Chip, ChipProps, Button } from "@nextui-org/react";
import { CSLBibInterface } from "@/models/CSLBibTex";
import { getSpecificReferenceById } from "@/components/componentActions/actions";
import { useRouter } from "next/navigation";
let { format } = require('@citation-js/date')

type Props = {
    referenceIds: String[];
}

const RemoveReferenceFromGroup = (props: Props) => {

  const router = useRouter();
    const [references, setReferences] = useState<any[]>([]);

    useEffect(() => {
        fetchReference();
      }, []);
    
    const fetchReference = async () => {    
        props.referenceIds.map(async (id: any) => {
            const referenceData = await getSpecificReferenceById(id);  
            setReferences(referenceData);
        })
    }

    const userRefs = references;
    type UserReference = typeof userRefs[0];

    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));

    const [page, setPage] = useState(1);
    const rowsPerPage = 6;

    const pages = Math.ceil(references.length / rowsPerPage);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return references.slice(start, end);
    }, [page, references]);

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

      function handleBack(){
        router.push("/group-center");
        router.refresh();
      }
  
      function handleSubmit(){
        console.log(JSON.stringify(selectedKeys));
      }

    return (
        <>
            <form id="remove-references-to-groups">
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
                        <TableColumn key="type">TYPE</TableColumn>
                    </TableHeader>
                    <TableBody items={items}>
                        {(item: { _id: string }) => (
                            <TableRow key={item._id}>
                                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <div className="flex justify-end gap-4">
                  <Button
                      color="primary"
                      className="font-bold text-white p-5"
                      onClick={() => handleBack()}
                      >
                      Back to Groups
                  </Button>
                  <Button
                      color="danger"
                      type="submit"
                      className="font-bold text-white p-5"
                      onClick={() => handleSubmit()}
                      >
                      Remove References to Group
                  </Button>
                </div>
            </form>
        </>
    )
}

export default RemoveReferenceFromGroup;