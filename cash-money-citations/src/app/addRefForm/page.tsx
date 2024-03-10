import React from "react";

// Local imports
import FormInputFieldComponent from "@/components/FormInputFieldComponent";

const page = () => {

    
  return (
    <div className="container mx-auto px-4 ">
      <h1 className="text-3xl font-bold m-3">Add Reference</h1>
      <form>
        <div className="flex flex-wrap -mx-2">
          {/* Left column */}
          <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
            <FormInputFieldComponent
              labelText="Contributor First Name"
              fieldText="First Name"
              idText="first-name"
            />
            <FormInputFieldComponent
              labelText="Contributor Last Name"
              fieldText="Last Name"
              idText="last-name"
            />
            {/* ... Other left-side fields ... */}

            <div className="flex justify-center p-3">
          <button type="button" className="w-52 rounded-lg bg-green-500 text-white font-bold py-2">
            Add
          </button>
        </div>

        <div className="flex justify-center p-3">
          <button type="button" className="w-52 rounded-lg bg-red-500 text-white font-bold py-2">
            Delete
          </button>
        </div>
          </div>

          {/* Right column */}
          <div className="w-full md:w-1/2 px-2">
            <FormInputFieldComponent
              labelText="Citekey"
              fieldText="Citekey"
              idText="citeKey"
            />
            <FormInputFieldComponent
              labelText="Title"
              fieldText="Title"
              idText="titleText"
            />

<FormInputFieldComponent
            labelText="Publisher"
            fieldText="Publisher"
            idText="publisherText"
          />
          <FormInputFieldComponent
            labelText="Year"
            fieldText="Year"
            idText="yearText"
          />
          <FormInputFieldComponent
            labelText="Month"
            fieldText="Month"
            idText="monthText"
          />
          <FormInputFieldComponent
            labelText="Address"
            fieldText="Address"
            idText="addressText"
          />
          <FormInputFieldComponent
            labelText="Edition"
            fieldText="Edition"
            idText="editionText"
          />
          <FormInputFieldComponent
            labelText="Volume"
            fieldText="Volume"
            idText="volumeText"
          />
          <FormInputFieldComponent
            labelText="ISBN"
            fieldText="ISBN"
            idText="isbnText"
          />
          <FormInputFieldComponent
            labelText="DOI"
            fieldText="DOI"
            idText="doiText"
          />
          <FormInputFieldComponent
            labelText="Pages"
            fieldText="Pages"
            idText="pagesText"
          />
          <FormInputFieldComponent
            labelText="Journal"
            fieldText="Journal"
            idText="journalText"
          />
          <FormInputFieldComponent
            labelText="Image Url"
            fieldText="Image Url"
            idText="imgtext"
          />
            {/* ... Other right-side fields ... */}
          </div>
        </div>

        <div className="flex justify-center p-3">
          <button type="submit" className="w-80 rounded-lg bg-green-500 text-white font-bold py-2">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default page;
