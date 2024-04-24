
'use client'

import {Card, CardHeader, CardBody, Divider, Link, ChipProps, Chip, Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from "@nextui-org/react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Selection } from "@nextui-org/react";
import { Group } from "@/models/Group";
import { CSLBibInterface } from "@/models/CSLBibTex";
import { handleDelete } from "./modifyGroups";
import { useRouter } from "next/navigation";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getSpecificReferenceById } from "@/components/componentActions/actions";
let { format } = require('@citation-js/date');
import { useReferenceContext } from "../reference-table/components/ReferenceTable";

type Props = {
    group: Group;
    references: CSLBibInterface[];
    referenceIds: string[];
}

const GroupCard = (props: Props) => {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const { referenceIds, setReferenceIds, setSelectedReferenceIds } = useReferenceContext();

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

    // Update currently selected referenceIds
    useEffect(() => {
        setReferenceIds(props.referenceIds);
        if (selectedKeys === "all") {
            setSelectedReferenceIds(referenceIds);
        } else if (selectedKeys instanceof Set) {
            setSelectedReferenceIds(Array.from(selectedKeys));
        }

    }, [selectedKeys]);

    return (
        <>  
            <Card className="me-3">
                <CardHeader>
                    <h4 className="font-bold dark:text-white">{props.group.groupName}</h4>
                </CardHeader>
                <CardBody>
                    <Button 
                        onPress={onOpen} 
                        color="primary"
                        className="font-bold text-white">
                        View Group
                    </Button>
                <Modal 
                    isOpen={isOpen} 
                    onOpenChange={onOpenChange}
                    placement="top-center"
                    size="2xl"
                    backdrop="blur"
                    radius="lg"
                    shadow="lg"
                    scrollBehavior="inside"
                >
                    <ModalContent className="w-full">
                        <>
                        <ModalHeader className="flex flex-col gap-1 dark:text-white">
                            Group Contents - {props.group.groupName}:
                        </ModalHeader>
                        <Divider />
                        <ModalBody>
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
                                <TableBody items={references}>
                                    {(item: { _id: string }) => (
                                        <TableRow key={item._id}>
                                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </ModalBody>
                        <Divider />
                        <ModalFooter>
                            <Button
                                color="danger"
                                className="font-bold text-white"
                                onClick={() => handleDelete(props.group._id, props.references, router)}>
                                    Delete Group
                            </Button>
                            <Button
                                color="primary"
                                className="font-bold text-white"
                                href={`/${props.group._id}/groups/edit?id=${encodeURIComponent(props.group._id)}`}
                                as={Link}
                                >
                                    Modify References
                            </Button>
                            <Button
                                color="warning"
                                className="font-bold text-white"
                                href={`/displayCitation`}
                                as={Link}
                                >
                                    Create Bibliography
                            </Button>
                        </ModalFooter>
                        </>
                    </ModalContent>
                </Modal>
                </CardBody>
            </Card>
        </>
    );
}

export default GroupCard;