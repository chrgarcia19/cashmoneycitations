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


if (error) return <p>Failed to load</p>;
if (isLoading) return <p>Loading...</p>;
if (!cslStyles) return null;

const handleStyleChoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const styleChoice = e.target.value;
    setStyleChoice(styleChoice);
    onStyleChoiceChange(styleChoice);
};

return (
    <span className="space-x-5">
      <select onChange={handleStyleChoiceChange}>
        {cslStyles.map((cslStyle: any) => (
          <option key={cslStyle.id} value={cslStyle.name}>
            {cslStyle.title}
          </option>
        ))}
      </select>
    </span>
  );
}


export function SelectionLocale({ onLocaleChoiceChange }: SelectionCSLLocaleProps) {
    const [localeChoice, setLocaleChoice] = useState<string | null>(null);

    const {
        data: localeData,
        error,
        isLoading,
    } = useSWR(`/api/csl/locales`, fetcher);
    
    if (error) return <p>Failed to load</p>;
    if (isLoading) return <p>Loading...</p>;
    if (!localeData) return null;
    const handleLocaleChoiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newLocaleChoice = e.target.value;
        setLocaleChoice(newLocaleChoice);
        onLocaleChoiceChange(newLocaleChoice);
    };
    
    return (
        <span className="space-x-5">
          {localeData.slice(0, 10).map((locale: any) => (
            <div key={locale._id}>
              <label>
                <input
                  type="radio"
                  value={locale.name}
                  checked={localeChoice === locale.name}
                  onChange={handleLocaleChoiceChange}
                />
                {locale.name}
              </label>
            </div>
          ))}
        </span>
    );
}