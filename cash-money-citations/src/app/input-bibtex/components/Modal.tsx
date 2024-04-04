'use client'
import {  Modal,   ModalContent,   ModalHeader,   ModalBody,   ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import {Textarea} from "@nextui-org/react";
import React, { useState } from "react";

export function UploadBibModal() {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const [value, setValue] = useState("");
    return (
    <>
        <Button onPress={onOpen}>Upload Bib(La)Tex</Button>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Bib(La)Tex Input</ModalHeader>
                <Button color="primary" variant="shadow" onPress={onClose} >
                    Upload .Bib
                </Button>
                <ModalBody>
                <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                    <Textarea
                     label="Enter Bib(La)Tex here or upload a .Bib file above"
                     variant="bordered"
                     classNames={{
                        base: "max-w-md",
                        input: "resize-y min-h-[80px]"
                     }}
                     value={value}
                     onValueChange={setValue}
                    />
                </div>

                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onPress={onClose}>
                    Action
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
    </>
    )
}