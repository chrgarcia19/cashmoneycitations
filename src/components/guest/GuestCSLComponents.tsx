'use client';

import { ChevronDownIcon } from "@/app/reference-table/components/ChevronDownloadIcon";
import { Dropdown, DropdownTrigger, Button, DropdownMenu, DropdownSection, DropdownItem, Divider } from "@nextui-org/react";
import { memo, useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { FilterCslStyleNames } from "@/app/[id]/references/view/actions";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure} from "@nextui-org/react";
import {useAsyncList} from "@react-stately/data";
import { FixedSizeList as List, areEqual } from "react-window";
import memoize from 'memoize-one';
import { UpdateUserStyleList } from "@/app/displayCitation/actions";

const fetcher = (url: string) =>
fetch(url)
    .then((res) => res.json())
    .then((json) => json.data);

interface SelectionCSLProps {
    // Fix the typescript for onStyleChoiceChange was previosly string[]
    onStyleChoiceChange: (styleChoices: any) => void;
    currentStyle: string;
}

interface SelectionCSLLocaleProps {
    // Fix the typescript for onLocaleChoiceChange was previosly string[]
    onLocaleChoiceChange: (localeChoices: any) => void;
}
  
// Maps over CSL Style selection
export function SelectionGuestCSL({ onStyleChoiceChange, currentStyle }: SelectionCSLProps) {
const [styleChoice, setStyleChoice] = useState('');
const [styleSearch, setStyleSearch] = useState('');

const {
    data: cslStyles,
    error,
    isLoading,
} = useSWR(`/api/csl/guestStyles`, fetcher);

  // Update styleChoice when styleChoice changes
  useEffect(() => {
      if (cslStyles && cslStyles.length > 0) {
          const firstStyle = cslStyles[0].title; // Sets the default citation style
          setStyleChoice(firstStyle);
          onStyleChoiceChange(firstStyle);
      }
  }, [cslStyles, onStyleChoiceChange]);



// useMemo to filter cslStyles based on the searchTerm
// This ensures filtering logic is only re-evaluated when cslStyles or searchTerm changes
const filteredStyles = useMemo(() => {
  return cslStyles?.filter((cslStyle: { title: string; }) =>
    cslStyle.title.toLowerCase().includes(styleSearch.toLowerCase())
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
          {currentStyle} <ChevronDownIcon />
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
                  value={style.title}
                  checked={styleChoice.includes(style.title)}
                  onChange={handleStyleChoiceChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2"
                />
                <span className="text-sm text-gray-800 font-sm">{style.title}</span>
              </label>
            </DropdownItem>
          ))}
        </DropdownSection>

      </DropdownMenu>
    </Dropdown>
    <ModalCSLSelect />

    
  </div>
  );
}

function ModalCSLSelect() {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [cslSelect, setCslSelect] = useState<string[]>([]);


  const saveNewStyleList = async(cslSelect: string[] ) => {
    await UpdateUserStyleList(cslSelect, false);
  }

  let list = useAsyncList({
    async load({signal, filterText = ''}) {
      let res = await FilterCslStyleNames(filterText);
      let json = await res;

      return {
        items: json,
      };
    },
  });

  const Row = memo(({ data, index, style }: any) => {

    const { items } = data;
    const item = items[index];

    return (
      <div
        style={style}
      >
        <span>
          {item.title}

        </span>
        <Button onPress={() => setCslSelect([...cslSelect, item.title])}>
          Add
        </Button>
        <Divider />

      </div>

    )

  }, areEqual);

  
  const createItemData = memoize((items) => ({
    items,
  }));


  const itemData = createItemData(list.items);


  return (
    <>
      {/* <Button className="self-end px-2 py-1 text-sm" onPress={onOpen}>
              More Styles
      </Button> */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} 
      backdrop="transparent"
      radius="lg"
      size="3xl"
      shadow="lg"
      scrollBehavior="inside">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Select Citation Styles</ModalHeader>
                <ModalBody className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div>
                      <input
                        type="text"
                        placeholder="Search Styles..."
                        className="mb-4 w-full p-2 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded"
                        value={list.filterText}
                        onChange={(e) => list.setFilterText(e.target.value)}

                      />
                    </div>
                    <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-lg">
                      <List
                        width={600}
                        height={300}
                        itemCount={list.items.length}
                        itemData={itemData}
                        itemSize={50}
                      >
                        {Row}

                      </List>
                    </div>


                  </div>

                </ModalBody>

                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onPress={() => { saveNewStyleList(cslSelect); onClose(); }}>
                    Save
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
    </>
  )
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
            const firstLocale = localeData[12].name; // Sets the default value for the lang
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
      <select className='p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' defaultValue='en-US' onChange={handleLocaleChoiceChange}>
        {localeData.map((locale: any) => (
          <option key={locale._id} value={locale.name}>
            {locale.name}
          </option>
        ))}
      </select>
    );
}