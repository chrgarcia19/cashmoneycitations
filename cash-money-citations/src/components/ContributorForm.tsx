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

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
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

  // useEffect(() => {
  //   setIsClient(true);
  //   if (contributors.length > 0) {
  //     setFormFields([...contributors]);
  //   } else {
  //     setFormFields([
  //       {
  //         contributorType: '',
  //         contributorFirstName: '',
  //         contributorLastName: '',
  //         contributorMiddleI: ''
  //       }
  //     ]);
  //   }
  // }, []);



  return (
    <div className="App">
      <form>
        {formFields.map((form, index) => (
          <div key={index}>
            <input
              name='contributorType'
              placeholder='Contributor Type (Author, Editor, etc.)'
              onChange={(event) => handleFormChange(event, index)}
              value={form.contributorType}
            />
            <input
              name='contributorFirstName'
              placeholder='Contributor First Name'
              onChange={(event) => handleFormChange(event, index)}
              value={form.contributorFirstName}
            />
            <input
              name='contributorLastName'
              placeholder='Contributor Last Name'
              onChange={(event) => handleFormChange(event, index)}
              value={form.contributorLastName}
            />
            <input
              name='contributorMiddleI'
              placeholder='Contributor Middle Initial'
              onChange={(event) => handleFormChange(event, index)}
              value={form.contributorMiddleI}
            />
            <button type="button" onClick={() => removeFields(index)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={addFields}>Add More..</button>
        <br />
      </form>
    </div>
  );
};

export default ContributorForm;