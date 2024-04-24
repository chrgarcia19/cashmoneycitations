'use client'
import {  Modal,   ModalContent,   ModalHeader,   ModalBody,   ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import {Textarea} from "@nextui-org/react";
import React, { useState, ChangeEvent, useRef, useEffect } from "react";
import { ParseBibTexUpload, SaveBibFileToDb } from "./BibFileUpload";
import {BibLatexParser} from "biblatex-csl-converter"
import { useSession } from "next-auth/react";
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import {Code} from "@nextui-org/react";
import { okaidia } from '@uiw/codemirror-theme-okaidia';
import { zebraStripes } from '@uiw/codemirror-extensions-zebra-stripes';

export function UploadBibModal() {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [parsedData, setParsedData] = useState<string[]>([]);
    const [errors, setErrors] = useState<any[]>([{
      line: 0
    }]);
    const [submitResult, setSubmitResult] = useState(false);
    const [value, setValue] = React.useState("console.log('hello world!');");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const session = useSession();

    // Load data from localStorage when the component mounts
    useEffect(() => {
      const cachedData = localStorage.getItem('bibtexData');
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
            localStorage.setItem('bibtexData', JSON.stringify(parsedData));
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
    
        const bibEntries = await ParseBibTexUpload(formData);
    
        try {
          let parsedData = [];
          let errors = [];
    
          for (const bibEntry of bibEntries) {
            let parser = new BibLatexParser(bibEntry, {processUnexpected: false, processUnknown: false})
            let data = parser.parse();
    
            if (data.errors.length == 0) {
              parsedData.push(bibEntry);
            } else {
              errors.push(...data.errors.map(error => `Error in line ${error.line}: ${error.type}`));
            }
          }
    
          setParsedData(parsedData);
          // Save users input to localStorage
          localStorage.setItem('bibtexData', JSON.stringify(parsedData));
    
          if (errors.length > 0) {
            setErrors(errors);
          } else {
            setErrors([]);
          }
          
        } catch(e) {
          setErrors(['Invalid BibTex Data']);
        }
      }
    };

    const handleSaveToReferences = async () => {
      validateData(parsedData);
      const userId = session.data?.user?.id ?? '';
      const success = await SaveBibFileToDb(parsedData, userId);
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
      let validEntries = [];
      for (const entry of data) {
        try {
          let parser = new BibLatexParser(entry, {processUnexpected: false, processUnknown: false})
          let parsedData = parser.parse();
    
          if (parsedData.errors.length == 0) {
            validEntries.push(entry);
          } else {
            errors.push(...parsedData.errors.map(error => `Error on line ${error.line}: ${error.type}`));
          }
        } catch(e) {
          errors.push('Invalid BibTex Data');
        }
      }
      setErrors(errors);
    };

    useEffect(() => {
      validateData(parsedData)
    }, [parsedData]);

    console.log(errors)
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
          scrollBehavior="inside"
        >
          <ModalContent className="h-[90%]">
            {(onClose) => (
              <>
                <div className="flex flex-wrap gap-4 items-center">
                  <ModalHeader className="flex flex-col gap-1 self-end">Bib(La)Tex Input</ModalHeader>
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
                
                <ModalBody className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                  <div>
                    <Button onClick={handleAddEntry}>Add Entry</Button>

                      {parsedData.map((entry, index) => (
                        <div className="flex items-end" key={index}>
                          {/* <Textarea
                            label={`Entry ${index + 1}`}
                            variant="bordered"
                            minRows={12}
                            value={entry}
                            onValueChange={(newValue) => handleValueChange(newValue, index)}
                          /> */}
                          <Code color="default">
                            {/* <CodeMirror value={entry} height="200px"
                                  theme={okaidia}
                                  
                            onChange={(newValue) => handleValueChange(newValue, index)}
                            extensions={[javascript({ jsx: true })]} /> */}
                            <CodeMirror
                              value={entry}
                              theme="light"
                              extensions={[javascript({ jsx: true }),
                                zebraStripes({
                                  lineNumber: [errors],
                                  lightColor:'#aca2ff33',
                                })
                              ]}
                              basicSetup={{
                                lineNumbers:true,
                                history: true,
                                syntaxHighlighting: true,
                                rectangularSelection: true
                              }
                              }
                              

                              onChange={(value, viewUpdate) => {
                                handleValueChange(value, index);
                              }}
                            />

                          </Code>

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
                    <span>Bib(La)Tex references have been successfully added.</span>
                  </div>
                }
              </>
            )}
          </ModalContent>
        </Modal>
    </>
    )
}