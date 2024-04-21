
'use client'

import {Card, CardHeader, CardBody, Divider} from "@nextui-org/react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import { Group } from "@/models/Group";
import ViewGroupReferences from "./viewGroupRefs";


type Props = {
    group: Group;
}

const GroupCard = (props: Props) => {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    return (
        <>  
            <div className="me-3">
                <Card>
                    <CardHeader>
                        <h4 className="font-bold">{props.group.groupName}</h4>
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
                    >
                        <ModalContent>
                            <>
                            <ModalHeader className="flex flex-col gap-1">
                                Group Contents - {props.group.groupName}:
                            </ModalHeader>
                            <Divider />
                            <ModalBody>
                                {props.group.referenceId.map((id: string, index: number) => (
                                    <ViewGroupReferences key={index} referenceId={id}/>
                                ))}
                            </ModalBody>
                            <Divider />
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    className="font-bold text-white">
                                        Delete Group
                                </Button>
                                <Button
                                    color="primary"
                                    className="font-bold text-white">
                                        Add References
                                </Button>
                                <Button
                                    color="warning"
                                    className="font-bold text-white">
                                        Create Bibliography
                                </Button>
                            </ModalFooter>
                            </>
                        </ModalContent>
                    </Modal>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}

export default GroupCard;