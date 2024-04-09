'use client'
import {  Modal,   ModalContent,   ModalHeader,   ModalBody,   ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import {Textarea} from "@nextui-org/react";
import React, { useState, ChangeEvent, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ParseJsonUpload, SaveJsonFileToDB } from "./JSONFileUpload";
import Ajv from "ajv";

export function UploadJSONModal() {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [parsedData, setParsedData] = useState<string[]>([]);
    const [errors, setErrors] = useState<string[]>([]);
    const [submitResult, setSubmitResult] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const session = useSession();

    // Load data from localStorage when the component mounts
    useEffect(() => {
      const cachedData = localStorage.getItem('jsonRefData');
      if (cachedData) {
        setParsedData(JSON.parse(cachedData)); // Update setParsedData to accept a string array
      }
    }, []);

    // Save data to localStorage whenever parsedData changes
    useEffect(() => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        debounceTimeoutRef.current = setTimeout(() => {
            localStorage.setItem('jsonRefData', JSON.stringify(parsedData));
        }, 2000); // 2 seconds delay
    }, [parsedData]);

    const handleButtonClick = () => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }

    function validateFileType(file: File) {
      const validTypes = ['application/json'];
      return validTypes.includes(file.type);
    }

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
      // Validate file type
      if (e.target.files && validateFileType(e.target.files[0])) {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("file", file as File);
    
        let jsonEntries = await ParseJsonUpload(formData);
        // Ensure jsonEntries is an array
        if (!Array.isArray(jsonEntries)) {
            jsonEntries = [jsonEntries];
        }
        try {
          let parsedData = [];
          let errors = [];
          for (const jsonEntry of jsonEntries) {
            if (errors.length == 0) {
              parsedData.push(JSON.stringify(jsonEntry, null, 2));
            } else {
              errors.push("");
            }
          }
          setParsedData(parsedData);
          // Save users input to localStorage
          localStorage.setItem('jsonRefData', JSON.stringify(parsedData));
    
          if (errors.length > 0) {
            setErrors(errors);
          } else {
            setErrors([]);
          }
          
        } catch(e) {
          setErrors(['Invalid Imported JSON Data']);
          console.error(e)
        }
      }
    };

    const handleSaveToReferences = async () => {
      validateData(parsedData);
      const userId = session.data?.user?.id ?? '';
      const success = await SaveJsonFileToDB(parsedData, userId);
      if (success) {
        setSubmitResult(true);
      } else {
        setSubmitResult(false);
      }
    };

    const handleValueChange = (newValue: string, index: number) => {
      setParsedData(prevData => prevData.map((entry, i) => i === index ? newValue : entry));
    };

    const handleAddEntry = () => {
      setParsedData(prevData => [...prevData, '']);
    };

    const handleDelete = (index: number) => {
      setParsedData(prevData => prevData.filter((entry, i) => i !== index));
    };

    const validateData = async (data: string[]) => {
      let errors = [];
      const ajv = new Ajv();

      // Ajv schema for JSON validation
      const jsonSchema = {
        type: "object",
        properties: {
            title: {type: ["string"]},
            issue: {type: ["string"]},
            volume: {type: ["string"]},
            DOI: {type: ["string"]},
            ISSN: {type: ["string"]},
            ISBN: {type: ["string"]},
            URL: {type: ["string"]},
            "container-title": {type: ["string"]},
            language: {type: ["string"]},
            page: {type: ["string"]},
            type: {type: ["string"]}
        },
      }

      for (const entry of data) {
        try {
          const jsonData = JSON.parse(entry);
          const valid = ajv.validate(jsonSchema, jsonData);
          if (!valid && ajv.errors) {
            ajv.errors.forEach((error) => {
                errors.push(`${error.instancePath} ${error.message}`);
              });
            }
        } catch(e) {
          errors.push('Invalid JSON Data');
        }
      }
      setErrors(errors);
    };

    useEffect(() => {
      validateData(parsedData)
    }, [parsedData]);

    return (
    <>
        <Button onPress={onOpen}>Upload JSON</Button>
        <Modal
          isOpen={isOpen} 
          onOpenChange={onOpenChange}
          backdrop="transparent"
          radius="lg"
          size="3xl"
          shadow="lg"
          scrollBehavior="inside"
        >
          <ModalContent className="h-[90%]">
            {(onClose) => (
              <>
                <div className="flex flex-wrap gap-4 items-center">
                  <ModalHeader className="flex flex-col gap-1 self-end">JSON Input</ModalHeader>
                  <Button size="md" className="right-0" color="primary" variant="shadow" onPress={handleButtonClick}>
                      Upload JSON File
                  </Button>
                </div>
                <input
                  type="file"
                  accept=".json"
                  style={{ display: 'none'}}
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
                
                <ModalBody className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                  <div>
                    <Button onClick={handleAddEntry}>Add Entry</Button>

                      {parsedData.map((entry, index) => (
                        <div className="flex items-end" key={index}>
                          <Textarea
                            label={`Entry ${index + 1}`}
                            variant="bordered"
                            minRows={12}
                            value={entry}
                            onValueChange={(newValue) => handleValueChange(newValue, index)}
                          />
                          <Button onClick={() => handleDelete(index)}>Delete</Button>
                        </div>
                      ))}
                      {errors.map((error, index) => (
                        <span key={index} className="error">{error}</span>
                      ))}
                  </div>

                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onPress={handleSaveToReferences}>
                    Save to references
                  </Button>
                </ModalFooter>
                {submitResult &&
                  <div role="alert" className="alert alert-success">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>JSON references have been successfully added.</span>
                  </div>
                }
              </>
            )}
          </ModalContent>
        </Modal>
    </>
    )
}