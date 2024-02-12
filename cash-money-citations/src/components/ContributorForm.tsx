'use client'

import { Contributor } from '@/models/Contributor';
import React, { useState, useEffect } from 'react';

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
      contributorType: '',
      contributorFirstName: '',
      contributorLastName: '',
      contributorMiddleI: ''
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
          contributorType: '',
          contributorFirstName: '',
          contributorLastName: '',
          contributorMiddleI: ''
        }
      ]);
    }
  }, []);

  return (
    <div className="App">
      <div className="flex justify-center items-center">
        <h1 className="text-xl align-middle">Contributor Information (Type, First Name, Last Name, Middle Initial)</h1>
      </div>
      <form>
        {formFields.map((form, index) => (
          <div key={index} className="display-block inline-flex">
            <select name="type" className="bg-white border-gray-300 rounded-lg w-1/3 pr-0.5 mr-0.5 h-8 border-t border-r border-l border-b" defaultValue={form.contributorType} onChange={(event) => handleFormChange(event, index)} required>
              <option value="" disabled hidden>Contributor Type</option>
              <option value="Author">Author</option>
              <option value="Editor">Editor</option>
              <option value="Translator">Translator</option>
            </select>
            <input
              name='contributorFirstName'
              placeholder='Contributor First Name'
              onChange={(event) => handleFormChange(event, index)}
              value={form.contributorFirstName}
              className="w-1/3 pr-0.5 mr-0.5"
            />
            <input
              name='contributorLastName'
              placeholder='Contributor Last Name'
              onChange={(event) => handleFormChange(event, index)}
              value={form.contributorLastName}
              className="w-1/3 pr-0.5 mr-0.5"
            />
            <input
              name='contributorMiddleI'
              placeholder='Contributor Middle Initial'
              onChange={(event) => handleFormChange(event, index)}
              value={form.contributorMiddleI}
              className="w-2/12 pr-0.5 mr-0.5"
            />
            <button type="button" className="m-0 text-white bg-red-500 hover:bg-red-900 rounded-lg text-sm" onClick={() => removeFields(index)}>Remove</button>
          </div>
        ))}
        <button type="button" className="text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg" onClick={addFields}>Add More..</button>
      </form>
    </div>
  );
};

export default ContributorForm;