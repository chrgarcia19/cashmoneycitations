'use client'

import { Contributor } from '@/models/Contributor';
import React, { useState, useEffect } from 'react';
import { BiSolidTrash, BiPlusCircle } from 'react-icons/bi';

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
      firstName: "",
      middleName: "",
      lastName: "",
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
          firstName: "",
          middleName: "",
          lastName: "",
          suffix: "",
        }
      ]);
    }
  }, []);

  return (
    <>
    <div className="m-0 justify-center items-center">
      <div className="flex justify-center items-center">
        <h1 className="font-bold align-middle">Contributor Information (Type, First Name, Middle Name/Initial, Last Name, Suffix)</h1>
      </div>
        {formFields.map((form, index) => (
          <div key={index} className="flex items-center justify-center">
            <select name="role" className="bg-white border-gray-300 rounded-lg w-1/3 pl-0.5 pr-1 mr-1 h-8 border-t border-r border-l border-b" defaultValue={form.role} onChange={(event) => handleFormChange(event, index)} required>
              <option value="" disabled>Role</option>
              <option value="Author">Author</option>
              <option value="Editor">Editor</option>
              <option value="Translator">Translator</option>
              <option value="Compiler">Compiler</option>
            </select>
            <input
              name='firstName'
              placeholder='First Name'
              onChange={(event) => handleFormChange(event, index)}
              defaultValue={form.firstName}
              className="w-2/4 pr-0.5 mr-0.5" />
            <input
              name='middleName'
              placeholder='Middle Name/Initial'
              onChange={(event) => handleFormChange(event, index)}
              defaultValue={form.middleName}
              className="w-2/4 pr-0.5 mr-0.5" />
            <input
              name='lastName'
              placeholder='Last Name'
              onChange={(event) => handleFormChange(event, index)}
              defaultValue={form.lastName}
              className="w-2/4 pr-0.5 mr-0.5" />
            
            <input
              name='suffix'
              placeholder='Suffix'
              onChange={(event) => handleFormChange(event, index)}
              defaultValue={form.suffix}
              className="w-1/6 pr-0.5 mr-0.5" />
              <button type="button" className="m-0 text-white bg-red-500 hover:bg-red-900 rounded-lg text-sm mb-0.5 p-1" onClick={() => removeFields(index)}><BiSolidTrash /></button>
          </div>
      ))}
      <div className='join join-horizontal'>
        <button type="button" className="text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg p-1 me-2" onClick={addFields}><BiPlusCircle /></button>
        <label 
          className='font-bold label-text text-indigo-600 pt-5'>
            Add Contributors
        </label>
      </div>        
    </div>
    </>
  );
};

export default ContributorForm;