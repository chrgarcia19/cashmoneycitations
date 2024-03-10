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
     <div className="container mx-auto px-4 ">
      <h1 className="text-3xl font-bold m-3">Add Reference</h1>
      <form className="w-full">
        <div className="flex flex-wrap -mx-2">
          {/* Left column */}
          <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
            {formFields.map((form, index) => (
              <div key={index} className="flex flex-wrap mb-2">
                <select 
                  name="contributorType" 
                  className="bg-white border-gray-300 rounded-md w-full p-2 mb-2 md:w-auto md:mr-2"
                  defaultValue={form.contributorType} 
                  onChange={(event) => handleFormChange(event, index)} 
                  required
                >
                  <option value="" disabled hidden>Contributor Type</option>
                  <option value="Author">Author</option>
                  <option value="Editor">Editor</option>
                  <option value="Translator">Translator</option>
                  {/* Add more options as needed */}
                </select>
                <input
                  name='contributorFirstName'
                  placeholder='First Name'
                  value={form.contributorFirstName}
                  onChange={(event) => handleFormChange(event, index)}
                  className="border border-gray-300 rounded-md w-full p-2 mb-2 md:w-auto md:mr-2"
                />
                <input
                  name='contributorLastName'
                  placeholder='Last Name'
                  value={form.contributorLastName}
                  onChange={(event) => handleFormChange(event, index)}
                  className="border border-gray-300 rounded-md w-full p-2 mb-2 md:w-auto md:mr-2"
                />
                <input
                  name='contributorMiddleI'
                  placeholder='Middle Initial'
                  value={form.contributorMiddleI}
                  onChange={(event) => handleFormChange(event, index)}
                  className="border border-gray-300 rounded-md w-full p-2 mb-2 md:w-1/5 md:mr-2"
                />
                <button 
                  type="button" 
                  className="bg-red-500 text-white rounded-md p-2 mb-2 md:w-auto"
                  onClick={() => removeFields(index)}
                >
                  Remove
                </button>
              </div>
            ))}
            <div className="flex justify-center p-3">
              <button 
                type="button" 
                className="w-52 rounded-lg bg-green-500 text-white font-bold py-2"
                onClick={addFields}
              >
                Add More..
              </button>
            </div>
          </div>
          {/* Right column if you have more fields */}
        </div>
      </form>
    </div>
  );
};

export default ContributorForm;