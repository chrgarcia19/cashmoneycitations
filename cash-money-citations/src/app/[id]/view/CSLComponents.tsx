'use client';

import { useEffect, useState, useMemo } from "react";
import useSWR from "swr";

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
const [styleChoices, setStyleChoices] = useState<string[]>([]);

 // State for holding the search term
 const [searchTerm, setSearchTerm] = useState('');

const {
    data: cslStyles,
    error,
    isLoading,
} = useSWR(`/api/csl/styles`, fetcher);

   // useMemo to filter cslStyles based on the searchTerm
    // This ensures filtering logic is only re-evaluated when cslStyles or searchTerm changes
    const filteredStyles = useMemo(() => {
        return cslStyles?.filter((cslStyle: { name: any; }) =>
            cslStyle.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [cslStyles, searchTerm]);


if (error) return <p>Failed to load</p>;
if (isLoading) return <p>Loading...</p>;
if (!cslStyles) return null;



// const handleStyleChoiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const styleChoice = e.target.value;
//     if (e.target.checked) {
//     setStyleChoices(prevChoices => [...prevChoices, styleChoice]);
//     onStyleChoiceChange([...styleChoices, styleChoice]);
//     } else {
//     const newChoices = styleChoices.filter(choice => choice !== styleChoice);
//     setStyleChoices(newChoices);
//     onStyleChoiceChange(newChoices);
//     }
// };

const handleStyleChoiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const styleChoice = e.target.value;
    const newChoices = e.target.checked
        ? [...styleChoices, styleChoice]
        : styleChoices.filter(choice => choice !== styleChoice);

    setStyleChoices(newChoices);
    onStyleChoiceChange(newChoices);
};


return (
    <div className="bg-white p-4 mx-auto rounded-lg shadow-lg">

        {/* Heading */}
        <h2 className="text-2xl font-bold text-black mb-4">Choose a citation style</h2>
            <input
                type="text"
                placeholder="Search styles..."
                className="mb-4 w-full p-2 text-gray-700 leading-tight"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // Set searchTerm to the input's value
            />
            <div className="overflow-auto max-h-80" style={{ maxHeight: '50vh' }}>
                <div className="space-y-2">
                    {filteredStyles.map((cslStyle : any) => (
                        <div key={cslStyle.id} className="flex items-center justify-between bg-white p-3 rounded-lg shadow">
                            <label htmlFor={`csl-style-${cslStyle.id}`} className="flex items-center w-full">
                                <input
                                    id={`csl-style-${cslStyle.id}`}
                                    type="checkbox"
                                    value={cslStyle.name}
                                    checked={styleChoices.includes(cslStyle.name)}
                                    onChange={handleStyleChoiceChange}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2"
                                />
                                <span className="text-lg text-gray-800 font-medium">{cslStyle.name}</span>
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
);
}


export function SelectionLocale({ onLocaleChoiceChange }: SelectionCSLLocaleProps) {
    const [localeChoice, setLocaleChoice] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');


    const {
        data: localeData,
        error,
        isLoading,
    } = useSWR(`/api/csl/locales`, fetcher);

    const filteredLocales = useMemo(() => {
        return localeData?.filter((locale: { name: string }) =>
          locale.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }, [localeData, searchTerm]);
    
    if (error) return <p>Failed to load</p>;
    if (isLoading) return <p>Loading...</p>;
    if (!localeData) return null;
    const handleLocaleChoiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newLocaleChoice = e.target.value;
        setLocaleChoice(newLocaleChoice);
        onLocaleChoiceChange(newLocaleChoice);
      };
    
    
    return (
        // <span className="space-x-5">
        //   {localeData.map((locale: any) => (
        //     <div key={locale._id}>
        //       <label>
        //         <input
        //           type="radio"
        //           value={locale.name}
        //           checked={localeChoice === locale.name}
        //           onChange={handleLocaleChoiceChange}
        //         />
        //         {locale.name}
        //       </label>
        //     </div>
        //   ))}
        // </span>

        <div className="bg-white p-4 mx-auto rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-black mb-4">Choose a locale</h2>
        <input
          type="text"
          placeholder="Search locales..."
          className="mb-4 w-full p-2 text-gray-700 leading-tight"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="overflow-auto max-h-80" style={{ maxHeight: '50vh' }}>
          <div className="space-y-2">
            {filteredLocales.map((locale: any) => (
              <div key={locale._id} className="flex items-center justify-between bg-white p-3 rounded-lg shadow">
                <label htmlFor={`locale-${locale._id}`} className="flex items-center w-full">
                  <input
                    id={`locale-${locale._id}`}
                    type="radio"
                    name="locales"
                    value={locale.name}
                    checked={localeChoice === locale.name}
                    onChange={handleLocaleChoiceChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2"
                  />
                  <span className="text-lg text-gray-800 font-medium">{locale.name}</span>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
}