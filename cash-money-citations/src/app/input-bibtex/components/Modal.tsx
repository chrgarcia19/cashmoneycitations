'use client'
import {  Modal,   ModalContent,   ModalHeader,   ModalBody,   ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import {Textarea} from "@nextui-org/react";
import React, { useState, ChangeEvent, useRef, useEffect } from "react";
import { ParseBibTexUpload } from "./BibFileUpload";

export function UploadBibModal() {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [parsedData, setParsedData] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Load data from localStorage when the component mounts
    useEffect(() => {
      const cachedData = localStorage.getItem('bibtexData');
      if (cachedData) {
          setParsedData(cachedData);
      }
    }, []);

    const handleButtonClick = () => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("file", file as File);

        const parsedBibTex = await ParseBibTexUpload(formData);
        setParsedData(parsedBibTex);

        // Save users input to localStorage
        localStorage.setItem('bibtexData', parsedBibTex);
        
      }
    };

    return (
    <>
        <Button onPress={onOpen}>Upload Bib(La)Tex</Button>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Bib(La)Tex Input</ModalHeader>
                <Button color="primary" variant="shadow" onPress={handleButtonClick}>
                    Upload .Bib
                </Button>
                <input
                  type="file"
                  style={{ display: 'none'}}
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
                
                <ModalBody>
                <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                    <Textarea
                     label="Enter Bib(La)Tex here or upload a .Bib file above"
                     variant="bordered"
                     classNames={{
                        base: "max-w-md",
                        input: "resize-y min-h-[80px]"
                     }}
                     value={parsedData}
                     onValueChange={setParsedData}
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