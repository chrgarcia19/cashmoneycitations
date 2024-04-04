'use client'
import {  Modal,   ModalContent,   ModalHeader,   ModalBody,   ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import {Textarea} from "@nextui-org/react";
import React, { useState, ChangeEvent, useRef, useEffect } from "react";
import { ParseBibTexUpload } from "./BibFileUpload";
import {BibLatexParser} from "biblatex-csl-converter"

export function UploadBibModal() {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [parsedData, setParsedData] = useState<string>('');
    const [errors, setErrors] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Load data from localStorage when the component mounts
    useEffect(() => {
      const cachedData = localStorage.getItem('bibtexData');
      if (cachedData) {
          setParsedData(cachedData);
      }
    }, []);

    // Save data to localStorage whenever parsedData changes
    useEffect(() => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        debounceTimeoutRef.current = setTimeout(() => {
            localStorage.setItem('bibtexData', parsedData);
        }, 2000); // 2 seconds delay
    }, [parsedData]);

    const handleButtonClick = () => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }

    function validateFileType(file: File) {
      const validTypes = ['application/x-bibtex'];
      return validTypes.includes(file.type);
    }

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
      // Validate file type
      if (e.target.files && validateFileType(e.target.files[0])) {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("file", file as File);

        const parsedBibTex = await ParseBibTexUpload(formData);

        try {
          let parser = new BibLatexParser(parsedBibTex, {processUnexpected: false, processUnknown: false})
          let data = parser.parse();
          setParsedData(parsedBibTex);
          // Save users input to localStorage
          localStorage.setItem('bibtexData', parsedBibTex);
          if (data.errors.length == 0) {
            setErrors([]);
          } else {
            setErrors(data.errors.map(error => `Error in line ${error.line}: ${error.type}`));
          }
          
        } catch(e) {
          setErrors(['Invalid BibTex Data']);
        }

        
      }
    };

    // New function to validate data
    const validateData = async (data: string) => {
      try {
        let parser = new BibLatexParser(data, {processUnexpected: false, processUnknown: false})
        let parsedData = parser.parse();
        // Save users input to localStorage
        localStorage.setItem('bibtexData', data);
        if (parsedData.errors.length == 0) {
          setParsedData(data);
          setErrors([]);
        } else {
          setErrors(parsedData.errors.map(error => `Error in line ${error.line}: ${error.type}`));
        }
      } catch(e) {
        setErrors(['Invalid BibTex Data']);
      }
    };

    useEffect(() => {
      validateData(parsedData);
    }, [parsedData]);

    return (
    <>
        <Button onPress={onOpen}>Upload Bib(La)Tex</Button>
        <Modal
          isOpen={isOpen} 
          onOpenChange={onOpenChange}
          backdrop="transparent"
          radius="lg"
          size="3xl"
          shadow="lg"
        >
          <ModalContent className="h-[90%]">
            {(onClose) => (
              <>
                <div className="flex flex-wrap gap-4 items-center">
                  <ModalHeader className="flex flex-col gap-1">Bib(La)Tex Input</ModalHeader>
                  <Button size="md" className="right-0" color="primary" variant="shadow" onPress={handleButtonClick}>
                      Upload .Bib File
                  </Button>
                </div>
                <input
                  type="file"
                  accept=".bib"
                  style={{ display: 'none'}}
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
                
                <ModalBody>
                <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                    <Textarea
                     label="Enter Bib(La)Tex here or upload a .Bib file above"
                     variant="bordered"
                     minRows={12}
                     maxRows={48}
                     value={parsedData}
                     onValueChange={setParsedData}
                    />
                    {errors.map((error, index) => (
                      <div key={index} className="error">{error}</div>
                    ))}
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