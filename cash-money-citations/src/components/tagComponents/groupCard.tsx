import {Card, CardHeader, CardBody} from "@nextui-org/react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link} from "@nextui-org/react";
import ViewReference from "./viewRefModal";

type Props = {
    tag: any;
}

const GroupCard = (props: Props) => {

    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    return (
        <>
            <Card>
                <CardHeader>
                    <h4>{props.tag.tagName}</h4>
                </CardHeader>
                <CardBody>
                <Button onPress={onOpen} color="primary">
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
                            {props.tag.tagName} - Group Contents:
                        </ModalHeader>
                        <ModalBody>
                            {props.tag.referenceID.map((id: string) => (
                                <ViewReference referenceId={id} />
                            ))}
                        </ModalBody>
                        <ModalFooter>
                            
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