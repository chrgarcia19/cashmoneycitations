'use client'
import { Group } from "@/models/Group";
import { Button, Card, CardBody, CardHeader, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue, useDisclosure } from "@nextui-org/react";
import { useMemo, useState } from "react";

type Props = {
    groups: Group[];
}

const GroupLibrary = (props: Props) => {

    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));

    const [page, setPage] = useState(1);
    const rowsPerPage = 6;

    const pages = Math.ceil(props.groups.length / rowsPerPage);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return props.groups.slice(start, end);
    }, [page, props.groups]);

    console.log(JSON.stringify(selectedKeys));

    return (
        <>
            <div className="flex items-center justify-center">
            <Card>
                <CardHeader>
                    <h4 className="font-bold">Group Library</h4>
                </CardHeader>
                <CardBody>
                    <Button 
                        onPress={onOpen} 
                        color="secondary" 
                        className="font-bold text-white">
                        Add Group
                    </Button>
                <Modal 
                    isOpen={isOpen} 
                    onOpenChange={onOpenChange}
                    placement="top-center"
                >
                    <ModalContent>
                        <>
                        <ModalHeader className="flex flex-col gap-1">
                            Add From the Group Library
                        </ModalHeader>
                        <form>
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
                                    wrapper: "min-h-[222px]",
                                }}
                                selectionMode="multiple"
                                selectedKeys={selectedKeys}
                                onSelectionChange={setSelectedKeys}
                                >
                                <TableHeader>
                                    <TableColumn key="groupName">GROUP NAME</TableColumn>
                                    <TableColumn key="owned">YOUR GROUP?</TableColumn>
                                </TableHeader>
                                <TableBody items={items}>
                                    {(item) => (
                                    <TableRow key={item.groupName}>
                                        {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                                    </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                            </ModalBody>
                            <ModalFooter>
                            <Button
                                type="submit"
                                onClick={onOpenChange}
                                color="success"
                                className="font-bold text-white hover:bg-green-900">
                                Submit
                            </Button>
                            </ModalFooter>
                        </form>
                        </>
                    </ModalContent>
                </Modal>
                </CardBody>
            </Card>
            </div>
        </>
    )
}

export default GroupLibrary;