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

const handleStyleChoiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const styleChoice = e.target.value;
    setStyleChoice(styleChoice);

    // CODE BELOW IS FOR CHECKBOX FUNCTIONALITY
    // if (e.target.checked) {
    // setStyleChoices(prevChoices => [...prevChoices, styleChoice]);
    // onStyleChoiceChange([...styleChoices, styleChoice]);
    // } else {
    // const newChoices = styleChoices.filter(choice => choice !== styleChoice);
    // setStyleChoices(newChoices);
    // onStyleChoiceChange(newChoices);
    // }
};

return (
    <span className="space-x-5">
      <select onChange={(e) => setStyleChoice(e.target.value)}>
        {cslStyles.slice(0, 10).map((cslStyle: any) => (
          <option key={cslStyle.id} value={cslStyle.name}>
            {cslStyle.name}
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