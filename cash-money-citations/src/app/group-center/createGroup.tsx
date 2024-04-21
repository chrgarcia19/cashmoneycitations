'use client'

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { editGroup, handleNewGroup } from "@/components/componentActions/groupActions";
import { Button, Card, CardBody, CardHeader, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";

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

    return (
        <>
            <Card className="me-3">
                <CardHeader>
                    <h4 className="font-bold">Create a New Group</h4>
                </CardHeader>
                <CardBody>
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
                >
                    <ModalContent>
                        <>
                        <ModalHeader className="flex flex-col gap-1">
                            Create a New Group
                        </ModalHeader>
                        <form id={formId} onSubmit={handleSubmit}>
                            <ModalBody>
                                <label 
                                    htmlFor="groupName"
                                    className="font-bold">
                                        Group Name
                                </label>
                                <input
                                    type="text"
                                    name="groupName"
                                    onChange={handleChange}
                                    value={form.groupName}
                                    required
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
                </CardBody>
            </Card>
        </>
    )
}

export default CreateCard;