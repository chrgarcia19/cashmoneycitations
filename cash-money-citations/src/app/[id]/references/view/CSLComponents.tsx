'use client';

import { ChevronDownIcon } from "@/app/reference-table/components/ChevronDownloadIcon";
import { Dropdown, DropdownTrigger, Button, DropdownMenu, DropdownSection, DropdownItem } from "@nextui-org/react";
import { Suspense, useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { GetAllCslStyleNames } from "./actions";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure} from "@nextui-org/react";

const fetcher = (url: string) =>
fetch(url)
    .then((res) => res.json())
    .then((json) => json.data);

interface SelectionCSLProps {
    // Fix the typescript for onStyleChoiceChange was previosly string[]
    onStyleChoiceChange: (styleChoices: any) => void;
}

interface SelectionCSLLocaleProps {
    // Fix the typescript for onLocaleChoiceChange was previosly string[]
    onLocaleChoiceChange: (localeChoices: any) => void;
}
  
// Maps over CSL Style selection
export function SelectionCSL({ onStyleChoiceChange }: SelectionCSLProps) {
const [styleChoice, setStyleChoice] = useState('');
const [styleSearch, setStyleSearch] = useState('');
const {isOpen, onOpen, onOpenChange} = useDisclosure();

const {
    data: cslStyles,
    error,
    isLoading,
} = useSWR(`/api/csl/styles`, fetcher);

  // Update styleChoise when styleChoice changes
  useEffect(() => {
      if (cslStyles && cslStyles.length > 0) {
          const firstStyle = cslStyles[0].name;
          setStyleChoice(firstStyle);
          onStyleChoiceChange(firstStyle);
      }
  }, [cslStyles, onStyleChoiceChange]);

// useMemo to filter cslStyles based on the searchTerm
// This ensures filtering logic is only re-evaluated when cslStyles or searchTerm changes
const filteredStyles = useMemo(() => {
  return cslStyles?.filter((cslStyle: { name: string; }) =>
    cslStyle.name.toLowerCase().includes(styleSearch.toLowerCase())
  );
}, [cslStyles, styleSearch]);

if (error) return <p>Failed to load</p>;
if (isLoading) return <p>Loading...</p>;
if (!cslStyles) return null;

const handleStyleChoiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const styleChoice = e.target.value;
    setStyleChoice(styleChoice);
    onStyleChoiceChange(styleChoice);
};

const GetCslNames = async() => {
  await GetAllCslStyleNames();
}


return (
  <div className="flex gap-4">
    {/* <select className='p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' value={styleChoice} onChange={handleStyleChoiceChange}>
      {cslStyles.map((cslStyle: any) => (
        <option key={cslStyle._id} value={cslStyle.name}>
          {cslStyle.title}
        </option>
      ))}
    </select> */}
    <Dropdown>
      <DropdownTrigger >
        <Button variant="bordered">
          Citation Styles <ChevronDownIcon />
        </Button>
      </DropdownTrigger>
      <DropdownMenu variant="faded" aria-label="Dropdown menu with description"
      topContent={
        <input
          type="text"
          placeholder="Search Styles..."
          className="mb-4 w-full p-2 text-gray-700 leading-tight"
          value={styleSearch}
          onChange={(e) => setStyleSearch(e.target.value)}
        />}
      >
        <DropdownSection
          style={{ maxHeight: '200px', overflowY: 'auto' }}
        >
          {filteredStyles.map((style: any) => (
            <DropdownItem key={style._id} className="flex items-center justify-between bg-white rounded-lg shadow">
              <label htmlFor={`locale-${style._id}`} className="flex items-center w-full">
                <input
                  id={`locale-${style._id}`}
                  type="radio"
                  name="styles"
                  value={style.name}
                  checked={styleChoice.includes(style.name)}
                  onChange={handleStyleChoiceChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2"
                />
                <span className="text-sm text-gray-800 font-sm">{style.name}</span>
              </label>
            </DropdownItem>
          ))}
        </DropdownSection>

      </DropdownMenu>
    </Dropdown>

    <Button className="self-end px-2 py-1 text-sm" onPress={onOpen}>
            More Styles
    </Button>
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
              <ModalBody>
                <p> 
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
                <p>
                  Magna exercitation reprehenderit magna aute tempor cupidatat consequat elit
                  dolor adipisicing. Mollit dolor eiusmod sunt ex incididunt cillum quis. 
                  Velit duis sit officia eiusmod Lorem aliqua enim laboris do dolor eiusmod. 
                  Et mollit incididunt nisi consectetur esse laborum eiusmod pariatur 
                  proident Lorem eiusmod et. Culpa deserunt nostrud ad veniam.
                </p>
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
  </div>
  );
}


export function SelectionLocale({ onLocaleChoiceChange }: SelectionCSLLocaleProps) {
    const [localeChoice, setLocaleChoice] = useState('en-US');

    const {
        data: localeData,
        error,
        isLoading,
    } = useSWR(`/api/csl/locales`, fetcher);
    
    // Update localeChoice when localeData changes
    useEffect(() => {
        if (localeData && localeData.length > 0) {
            const firstLocale = localeData[0].name;
            setLocaleChoice(firstLocale);
            onLocaleChoiceChange(firstLocale);
        }
    }, [localeData, onLocaleChoiceChange]);

    if (error) return <p>Failed to load</p>;
    if (isLoading) return <p>Loading...</p>;
    if (!localeData) return null;

    const handleLocaleChoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLocaleChoice = e.target.value;
        setLocaleChoice(newLocaleChoice);
        onLocaleChoiceChange(newLocaleChoice);
    };
    
    return (
      <select className='p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' onChange={handleLocaleChoiceChange}>
        {localeData.map((locale: any) => (
          <option key={locale._id} value={locale.name}>
            {locale.name}
          </option>
        ))}
      </select>
    );
}