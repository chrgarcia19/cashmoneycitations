'use client'
import { getUserGroups } from "@/components/componentActions/groupActions";
import { Group } from "@/models/Group";
import { Button, Card, CardBody, CardHeader, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue, useDisclosure, Selection } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import React, { Key, useCallback, useEffect, useMemo, useState } from "react";

type Props = {
    groups: Group[];
}

const GroupLibrary = (props: Props) => {

    type UserGroup = typeof props.groups[0];

    const [userOwnedGroups, setUserOwnedGroups] = useState<Group[]>([]);

    useEffect(() => {
        async function getUserOwnedGroups(){
            const userId = session?.user?.id;
            if (userId){
                const userOwnedGroupsData = await getUserGroups(userId);
                setUserOwnedGroups(userOwnedGroupsData ?? []);
            } else {
                setUserOwnedGroups([]);
            } 
        };
        getUserOwnedGroups();
    }, []);

    const { data: session } = useSession();

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

    const renderCell = useCallback((userGroup: UserGroup, columnKey: Key) => {
        const cellValue = userGroup[columnKey as keyof UserGroup];
        switch (columnKey){
            case "groupName":
                const groupName = userGroup.groupName;
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small capitalize">{groupName}</p>
                    </div>
                );
            case "userOwnedGroups":
                const isUserOwned = userOwnedGroups.some(group => group._id !== userGroup._id);
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small capitalize">{isUserOwned ? "Yes" : "No"}</p>
                    </div>
                );
        }
    }, []);

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
                    backdrop="blur"
                    radius="lg"
                    shadow="lg"
                    scrollBehavior="inside"
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
                                    <TableColumn key="userOwnedGroups">YOUR GROUP?</TableColumn>
                                </TableHeader>
                                <TableBody items={items}>
                                    {(item: Group) => (
                                        <TableRow key={item._id}>
                                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                                        </TableRow>
                                    )}
                                    {/*(item) => (
                                    <TableRow key={item.groupName}>
                                        {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                                    </TableRow>
                                    )*/}
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