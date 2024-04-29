'use client'

import { Contributor } from '@/models/Contributor';
import React, { useState, useEffect } from 'react';
import { BiSolidTrash, BiPlusCircle } from 'react-icons/bi';
import FormField from './FormField';

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
      <div className="flex justify-center items-center">
        <h1 className="font-bold align-middle text-gray-800 dark:text-white">Contributor Information (Type, First Name, Middle Name/Initial, Last Name, Suffix)</h1>
      </div>
        {formFields.map((form, index) => (
          <div key={index} className="flex items-center justify-center">
            <select name="role" className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-lg w-1/3 pl-0.5 pr-1 mr-1 h-8 border" defaultValue={form.role} onChange={(event) => handleFormChange(event, index)} required>
              <option value="" disabled>Role</option>
              <option value="Author">Author</option>
              <option value="Editor">Editor</option>
              <option value="Translator">Translator</option>
              <option value="Compiler">Compiler</option>
            </select>
            <FormField 
              required={false} 
              labelText={'First Name'} 
              fieldName={'given'} 
              fieldValue={form.given} 
              fieldType={'text'} 
              fieldPlaceholder={'First Name'} 
              handleChange={(event: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => handleFormChange(event, index)} />
            <FormField 
              required={false} 
              labelText={'Middle Name'} 
              fieldName={'middle'} 
              fieldValue={form.middle} 
              fieldType={'text'} 
              fieldPlaceholder={'Middle Name'} 
              handleChange={(event: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => handleFormChange(event, index)} />
            <FormField 
              required={true} 
              labelText={'Last name'} 
              fieldName={'family'} 
              fieldValue={form.family} 
              fieldType={'text'} 
              fieldPlaceholder={'Last Name'} 
              handleChange={(event: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => handleFormChange(event, index)} />
            <FormField 
              required={false} 
              labelText={'Suffix'} 
              fieldName={'suffix'} 
              fieldValue={form.suffix} 
              fieldType={'text'} 
              fieldPlaceholder={'Suffix'} 
              handleChange={(event: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => handleFormChange(event, index)} />
            {/*<input
              name='given'
              placeholder='First Name'
              onChange={(event) => handleFormChange(event, index)}
              defaultValue={form.given}
              className="w-2/4 pr-0.5 mr-0.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            <input
              name='middle'
              placeholder='Middle Name/Initial'
              onChange={(event) => handleFormChange(event, index)}
              defaultValue={form.middle}
              className="w-2/4 pr-0.5 mr-0.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            <input
              name='family'
              placeholder='Last Name'
              onChange={(event) => handleFormChange(event, index)}
              defaultValue={form.family}
              className="w-2/4 pr-0.5 mr-0.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            
            <input
              name='suffix'
              placeholder='Suffix'
              onChange={(event) => handleFormChange(event, index)}
              defaultValue={form.suffix}
        className="w-1/6 pr-0.5 mr-0.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />*/}
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
