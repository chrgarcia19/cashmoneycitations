'use client'

import { Contributor } from '@/models/Contributor';
import React, { useState, useEffect } from 'react';
import { BiSolidTrash, BiPlusCircle } from 'react-icons/bi';
import FormField from './FormField';
import { Input } from '@nextui-org/react';

interface ContributorFormProps {
  updateFormData: (newData: Contributor[]) => void;
  contributors: Contributor[];
}

const ContributorForm: React.FC<ContributorFormProps> = ({ updateFormData, contributors }) => {
  const [formFields, setFormFields] = useState<Contributor[]>([]);
  const [isClient, setIsClient] = useState(false);

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>, index: number) => {
    const { name, value } = event.target;
    const newData = [...formFields];
    newData[index][name as keyof Contributor] = value;
    setFormFields(newData);
    updateFormData(formFields);
  };

  const addFields = () => {
    const newField: Contributor = {
      role: "",
      given: "",
      middle: "",
      family: "",
      suffix: "",
    };
    setFormFields([...formFields, newField]);
  };

  const removeFields = (index: number) => {
    const newData = [...formFields];
    newData.splice(index, 1);
    setFormFields(newData);
  };

  useEffect(() => {
    setIsClient(true);
    if (contributors.length > 0) {
      setFormFields([...contributors]);
    } else {
      setFormFields([
        {
          role: "",
          given: "",
          middle: "",
          family: "",
          suffix: "",
        }
      ]);
    }
  }, []);

  return (
    <>
    <div className="m-0 justify-center items-center">
      <div className="flex flex-col justify-center items-center p-2">
        <h1 className="font-bold align-middle text-gray-800 dark:text-white">Contributor Information</h1>
        <h1 className="font-bold align-middle text-gray-800 dark:text-white">(Type, First Name, Middle Name/Initial, Last Name, Suffix)</h1>
        
      </div>
        {formFields.map((form, index) => (
          <div key={index} className="flex items-center justify-center">
            <select name="role" className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-lg w-3/4 pl-0.5 pr-1 mr-1 h-8 border" defaultValue={form.role} onChange={(event) => handleFormChange(event, index)} required>
              <option value="" disabled>Role</option>
              <option value="Author">Author</option>
              <option value="Editor">Editor</option>
              <option value="Translator">Translator</option>
              <option value="Compiler">Compiler</option>
            </select>
            <Input
              type='text'
              name='given'
              size='sm'
              placeholder='First Name'
              radius="lg"
              value={form.given}
              onChange={(event: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => handleFormChange(event, index)} 
              classNames={{
                input: [
                    "bg-transparent",
                    "text-black/90 dark:text-white/90",
                    "placeholder:text-default-700/50 dark:placeholder:text-white/60",
                ],
                innerWrapper: "bg-transparent",
                inputWrapper: [
                    "shadow-xl",
                    "bg-default-200/50",
                    "dark:bg-default/60",
                    "backdrop-blur-xl",
                    "backdrop-saturate-200",
                    "hover:bg-default-200/70",
                    "dark:hover:bg-default/70",
                    "group-data-[focused=true]:bg-default-200/50",
                    "dark:group-data-[focused=true]:bg-default/60",
                    "!cursor-text",
                    "px-0"
                ],
              }}/> 
            <Input
              type='text'
              name='middle'
              size='sm'
              radius="lg"
              placeholder='Middle Name'
              value={form.middle}
              onChange={(event: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => handleFormChange(event, index)}
              classNames={{
                input: [
                    "bg-transparent",
                    "text-black/90 dark:text-white/90",
                    "placeholder:text-default-700/50 dark:placeholder:text-white/60",
                ],
                innerWrapper: "bg-transparent",
                inputWrapper: [
                    "shadow-xl",
                    "bg-default-200/50",
                    "dark:bg-default/60",
                    "backdrop-blur-xl",
                    "backdrop-saturate-200",
                    "hover:bg-default-200/70",
                    "dark:hover:bg-default/70",
                    "group-data-[focused=true]:bg-default-200/50",
                    "dark:group-data-[focused=true]:bg-default/60",
                    "!cursor-text",
                    "px-0"
                ],
              }} />
            <Input
              isRequired
              type='text'
              name='family'
              size='sm'
              radius="lg"
              placeholder='Last Name'
              value={form.family}
              onChange={(event: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => handleFormChange(event, index)}
              classNames={{
                input: [
                    "bg-transparent",
                    "text-black/90 dark:text-white/90",
                    "placeholder:text-default-700/50 dark:placeholder:text-white/60",
                ],
                innerWrapper: "bg-transparent",
                inputWrapper: [
                    "shadow-xl",
                    "bg-default-200/50",
                    "dark:bg-default/60",
                    "backdrop-blur-xl",
                    "backdrop-saturate-200",
                    "hover:bg-default-200/70",
                    "dark:hover:bg-default/70",
                    "group-data-[focused=true]:bg-default-200/50",
                    "dark:group-data-[focused=true]:bg-default/60",
                    "!cursor-text",
                    "px-0"
                ],
              }} />
            <Input
              type='text'
              name='suffix'
              size='sm'
              radius="lg"
              placeholder='Suffix'
              value={form.suffix}
              onChange={(event: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => handleFormChange(event, index)}
              className='w-1/3'
              classNames={{
                input: [
                    "bg-transparent",
                    "text-black/90 dark:text-white/90",
                    "placeholder:text-default-700/50 dark:placeholder:text-white/60",
                ],
                innerWrapper: "bg-transparent",
                inputWrapper: [
                    "shadow-xl",
                    "bg-default-200/50",
                    "dark:bg-default/60",
                    "backdrop-blur-xl",
                    "backdrop-saturate-200",
                    "hover:bg-default-200/70",
                    "dark:hover:bg-default/70",
                    "group-data-[focused=true]:bg-default-200/50",
                    "dark:group-data-[focused=true]:bg-default/60",
                    "!cursor-text",
                    "px-0"
                ],
              }} />   
            <button type="button" className="m-0 text-white bg-red-500 hover:bg-red-700 dark:hover:bg-red-900 rounded-lg text-sm mb-0.5 p-1" onClick={() => removeFields(index)}><BiSolidTrash /></button>
          </div>
      ))}
      <div className='flex items-center'>
        <button type="button" className="text-white bg-indigo-600 hover:bg-indigo-500 dark:hover:bg-indigo-400 rounded-lg p-1 mr-2" onClick={addFields}><BiPlusCircle /></button>
        <label className='font-bold text-indigo-600 dark:text-indigo-400 pt-5'>
            Add Contributors
        </label>
      </div>        
    </div>
    </>
  );
};

export default ContributorForm;
