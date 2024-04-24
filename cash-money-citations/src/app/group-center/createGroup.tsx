'use client'

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { editGroup, handleNewGroup } from "../../components/componentActions/groupActions";
import { Button, Card, CardBody, CardHeader, Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import React from "react";

interface GroupData {
    groupName: string;
}

type Props = {
    formId: string;
    groupForm: GroupData;
    forNewGroup?: boolean;
}

const CreateCard = ({formId, groupForm, forNewGroup = true} : Props) => {
    const searchParams = useSearchParams();
    const { data: session } = useSession();
    const router = useRouter();

    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const [form, setForm] = useState({
        groupName: groupForm.groupName,
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => {
        const target = e.target;
        const value = target.value;
        const name = target.name;

        setForm({
        ...form,
        [name]: value,
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const id = searchParams.get('id');
        const userId = session?.user?.id;
    
        if (forNewGroup) {
          handleNewGroup(form, userId);
          router.push("/group-center");
          router.refresh();
        } else {
          editGroup(form, id);
          router.push("/group-center");
          router.refresh();
        }
    };

    function handleBack(){
        router.push("/group-center");
        router.refresh();
      }

    return (
        <>
            <Card className="me-3">
                <CardHeader className="flex items-center justify-center ">
                    {forNewGroup && (
                        <h4 className="font-bold dark:text-white">Create a New Group</h4>
                    ) || (
                        <h4 className="font-bold dark:text-white">Edit Group Name</h4>
                    )}
                    
                </CardHeader>
                {!forNewGroup && (
                    <Divider />
                )}
                <CardBody>
                    {forNewGroup && (
                        <>
                            <Button 
                                onPress={onOpen} 
                                color="success" 
                                className="font-bold text-white">
                                Create Group
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
                                    <ModalHeader className="flex flex-col gap-1 dark:text-white">
                                        Create a New Group
                                    </ModalHeader>
                                    <form id={formId} onSubmit={handleSubmit}>
                                        <ModalBody>
                                            <label 
                                                htmlFor="groupName"
                                                className="font-bold dark:text-white">
                                                    Group Name
                                            </label>
                                            <input
                                                type="text"
                                                name="groupName"
                                                onChange={handleChange}
                                                value={form.groupName}
                                                required
                                                className="dark:text-white"
                                            />
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
                        </>
                    ) || (
                        <>
                            <form id={formId} onSubmit={handleSubmit}>
                                <label 
                                    htmlFor="groupName"
                                    className="font-bold dark:text-white">
                                        Group Name
                                </label>
                                <input
                                    type="text"
                                    name="groupName"
                                    onChange={handleChange}
                                    value={form.groupName}
                                    required
                                    className="dark:text-white"
                                />
                                <div className="flex justify-end gap-4">
                                    <Button
                                        color="primary"
                                        className="font-bold text-white p-5"
                                        onClick={() => handleBack()}
                                        >
                                        Back to Groups
                                    </Button>
                                    <Button
                                        type="submit"
                                        color="success"
                                        className="font-bold text-white hover:bg-green-900">
                                        Submit
                                    </Button>
                                </div>
                            </form>
                        </>
                    )}
                </CardBody>
            </Card>
        </>
    )
}

export default CreateCard;