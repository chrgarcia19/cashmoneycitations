'use client'
import { useCallback, useMemo, useState } from "react";
import { Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Selection, Chip, ChipProps, Button, Divider } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Tag } from "@/models/Tag";
import { applyReferenceToTag, applyTagToReferences } from "@/app/tag-center/tagActions";
let { format } = require('@citation-js/date')

type Props = {
    references: any[];
    tag: Tag;
}

const AddReferenceToTag = (props: Props) => {

    const router = useRouter();

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
      router.push("/tag-center");
      router.refresh();
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>){
      e.preventDefault();
      const refs = Array.from(selectedKeys as Set<React.Key>).map(String);
    
      /*Adding Reference IDs to a tag*/
      for (let i = 0; i < refs.length; i++){
        await applyReferenceToTag(props.tag, refs[i]);
      }

      /*Add Tag IDs to each references*/
      for (let i = 0; i < props.references.length; i++){
        for (let j = 0; j < refs.length; j++){
          if (props.references[i]._id == refs[j]){
            await applyTagToReferences(props.references[i], props.tag);
          }
        }
        
      }

      router.push("/tag-center");
      router.refresh();
    }

    return (
        <>
              <form id="add-references-to-tags" 
                onSubmit={async (e) => await handleSubmit(e)}>
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
                                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <Divider />
                <div className="flex justify-end gap-4">
                  <Button
                      color="primary"
                      className="font-bold text-white"
                      onClick={() => handleBack()}
                      >
                      Back to Tags
                  </Button>
                  <Button
                      color="success"
                      type="submit"
                      className="font-bold text-white"
                      >
                      Add References to Tag
                  </Button>
                </div> 
              </form>
        </>
    )
}

export default AddReferenceToTag;
