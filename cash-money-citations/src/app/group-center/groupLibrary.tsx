'use client'
import { getSpecificUserById } from "@/components/componentActions/actions";
import { getSpecificGroupById, getUserGroups, handleNewGroup } from "@/components/componentActions/groupActions";
import { Group } from "@/models/Group";
import { MdLibraryAdd } from "react-icons/md";
import { Button, Card, CardBody, CardHeader, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue, useDisclosure, Selection, Tooltip } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { Key, useCallback, useEffect, useMemo, useState } from "react";

type Props = {
    groups: any[];
}

const GroupLibrary = (props: Props) => {

    const router = useRouter();
    const { data: session } = useSession();

    const [userOwnedGroups, setUserOwnedGroups] = useState<Group[]>([]);

    useEffect(() => {
        getSpecificUser();    
    }, []);

    async function getSpecificUser(){
        const userId = session?.user?.id;
        const userFromId = await getSpecificUserById(userId);
        if (userFromId._id){
            const userOwnedGroupsData = await getUserGroups(userFromId._id);
            setUserOwnedGroups(userOwnedGroupsData ?? []);
        } else {
            setUserOwnedGroups([]);
        }
    };
    
    const userGroups = props.groups;
    type UserGroup = typeof userGroups[0];   

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
        switch (columnKey){
            case "groupName":
                const groupName = userGroup.groupName;
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small capitalize">{groupName}</p>
                    </div>
                );
            case "userOwnedGroups":
                const isUserOwned = userOwnedGroups.some((group: Group) => group._id == userGroup._id);
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small capitalize">{isUserOwned ? "Yes" : "No"}</p>
                    </div>
                );
            case "actions":
                return (
                    <div className="flex flex-col">
                        <Tooltip content="Add Group to List">
                            <Button
                                color="success"
                                size="sm"
                                className="cursor-pointer active:opacity-50"
                                onClick={async() => handleSubmit(userGroup)}
                                onPress={onOpenChange}
                                >
                                    <MdLibraryAdd />
                            </Button>
                        </Tooltip>
                    </div>
                );
        }
    }, [userOwnedGroups, onOpenChange]);

    const handleSubmit = async (group: Group) => {
        try {
            const groupWithoutId = {...group, 
                _id: undefined };
            console.log(groupWithoutId);
            handleNewGroup(groupWithoutId, session?.user?.id);
            router.push("/group-center");
            router.refresh();
        } catch (error) {
            console.log(JSON.stringify(error));
        }
    };

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
                    size="xl"
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
                                selectedKeys={selectedKeys}
                                onSelectionChange={setSelectedKeys}
                                >
                                <TableHeader>
                                    <TableColumn key="groupName">GROUP NAME</TableColumn>
                                    <TableColumn key="userOwnedGroups">YOUR GROUP?</TableColumn>
                                    <TableColumn key="actions">ACTIONS</TableColumn>
                                </TableHeader>
                                <TableBody items={items}>
                                    {(item: Group) => (
                                        <TableRow key={item._id}>
                                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                            </ModalBody>
                            <ModalFooter>
                            </ModalFooter>
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