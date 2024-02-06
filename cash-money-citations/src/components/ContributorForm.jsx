import { useState } from 'react';

function ContributorForm({ updateFormData = (Array) => {}, contributors}) {
  const [formFields, setFormFields] = useState([
    { contributorType: '', contributorFirstName: '', contributorLastName: '', contributorMiddleI: ''},
  ])

  const handleFormChange = (event, index) => {
    let data = [...formFields];
    data[index][event.target.name] = event.target.value;
    setFormFields(data);
  }

  const submit = (e) => {
    e.preventDefault();
    //This needs to be modified, as ideally, you set the referenceForm.contributors to the results you get out of these formFields
    updateFormData(formFields);
  }

  const addFields = () => {
    let object = {
      contributorType: '', 
      contributorFirstName: '', 
      contributorLastName: '', 
      contributorMiddleI: ''
    }

    setFormFields([...formFields, object])
  }

  const removeFields = (index) => {
    let data = [...formFields];
    data.splice(index, 1)
    setFormFields(data)
  }

  return (
    <div className="App">
      <form onSubmit={submit}>
        {formFields.map((form, index) => {
          return (
            <div key={index}>

              <label htmlFor="type">Contributor Type</label>
              <select name="type" defaultValue={""} onChange={event => handleFormChange(event, index)} required>
                <option value="" disabled hidden>Choose here</option>
                <option value="Author">Author</option>
                <option value="Editor">Editor</option>
                <option value="Translator">Translator</option>
              </select>

              <input
                name='contributorFirstName'
                placeholder='Contributor First Name'
                onChange={event => handleFormChange(event, index)}
                value={form.contributorFirstName}
              />
              <input
                name='contributorLastName'
                placeholder='Contributor Last Name'
                onChange={event => handleFormChange(event, index)}
                value={form.contributorLastName}
              />
              <input
                name='contributorMiddleI'
                placeholder='Contributor Middle Initial'
                onChange={event => handleFormChange(event, index)}
                value={form.contributorMiddleI}
              />
              <button onClick={() => removeFields(index)}>Remove</button>
            </div>
          )
        })}
      </form>
      <button onClick={addFields}>Add More..</button>
      <br />
      <button onClick={submit}>Finish Contributors</button>
    </div>
  );
}

export default ContributorForm;