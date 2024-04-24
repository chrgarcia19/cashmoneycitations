'use client'
import { useCallback, useEffect, useMemo, useState } from "react";
import { Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Selection, Chip, ChipProps, Button } from "@nextui-org/react";
import { CSLBibInterface } from "@/models/CSLBibTex";
import { getSpecificReferenceById } from "@/components/componentActions/actions";
import { useRouter } from "next/navigation";
import { deleteGroupIdFromReference, deleteReferenceIdFromGroup } from "@/app/group-center/modifyGroups";
import { Group } from "@/models/Group";
let { format } = require('@citation-js/date')

type Props = {
    referenceIds: string[];
    group: Group;
}

const RemoveReferenceFromGroup = (props: Props) => {
  
  const router = useRouter();
  const [references, setReferences] = useState<any[]>([]);

  useEffect(() => {
      fetchReference();
    }, []);
  
  const fetchReference = async () => {  
    const referenceArr = new Array<CSLBibInterface>();  
    props.referenceIds.map(async (id: any) => {
        const referenceData = await getSpecificReferenceById(id);  
        referenceArr.push(referenceData);
    });
    setReferences(referenceArr);
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
  
      async function handleSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        const refs = Array.from(selectedKeys as Set<React.Key>).map(String);

        /*Remove the Reference IDs from the group */
        for (let i = 0; i < refs.length; i++){
          await deleteReferenceIdFromGroup(refs[i], props.group);
        }
        
        /*Remove GroupIDs from each reference*/
        for (let i = 0; i < references.length; i++){
          await deleteGroupIdFromReference(props.group._id, references[i]);
        }

        router.push("/group-center");
        router.refresh();
      }

    return (
        <>
            <form id="remove-references-to-groups" 
              className="w-full"
              onSubmit={async (e) => await handleSubmit(e)}
              >
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
                        wrapper: "min-h-[80%] min-w-[80%]",
                    }}
                    selectionMode="multiple"
                    selectedKeys={selectedKeys}
                    onSelectionChange={setSelectedKeys}
                    >
                    <TableHeader>
                        <TableColumn key="title">TITLE</TableColumn>
                        <TableColumn key="contributors">CONTRIBUTORS</TableColumn>
                        <TableColumn key="datePublished">DATE PUBLISHED</TableColumn>
                        <TableColumn key="type">TYPE</TableColumn>
                    </TableHeader>
                    <TableBody items={items}>
                        {(item: { _id: string }) => (
                            <TableRow key={item._id}>
                                {(columnKey) => <TableCell className="dark:text-white">{renderCell(item, columnKey)}</TableCell>}
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
                      >
                      Remove References to Group
                  </Button>
                </div>
            </form>
        </>
    )
}

export default RemoveReferenceFromGroup;