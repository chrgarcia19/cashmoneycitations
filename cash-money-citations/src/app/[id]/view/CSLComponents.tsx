'use client';

import { useEffect, useState } from "react";
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
const [styleChoice, setStyleChoice] = useState('');

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

if (error) return <p>Failed to load</p>;
if (isLoading) return <p>Loading...</p>;
if (!cslStyles) return null;

const handleStyleChoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const styleChoice = e.target.value;
    setStyleChoice(styleChoice);
    onStyleChoiceChange(styleChoice);
};

return (
    <select className='p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' value={styleChoice} onChange={handleStyleChoiceChange}>
      {cslStyles.map((cslStyle: any) => (
        <option key={cslStyle._id} value={cslStyle.name}>
          {cslStyle.title}
        </option>
      ))}
    </select>
  );
}


export function SelectionLocale({ onLocaleChoiceChange }: SelectionCSLLocaleProps) {
    const [localeChoice, setLocaleChoice] = useState('');

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
      <select className='p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' value={localeChoice} onChange={handleLocaleChoiceChange}>
        {localeData.map((locale: any) => (
          <option key={locale._id} value={locale.name}>
            {locale.name}
          </option>
        ))}
      </select>
    );
}