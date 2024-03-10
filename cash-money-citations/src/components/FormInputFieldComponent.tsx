import React from 'react'

type Props = {
    labelText: string,
    fieldText: string,
    idText: string,
}

const FormInputFieldComponent = ({labelText, fieldText, idText} : Props) => {
  return (
    <div className="w-full p-2">
    <label
      htmlFor={idText}
      className="block text-sm font-medium text-gray-700"
    >
      {labelText}
    </label>
    <input
      type="text"
      name={fieldText}
      id={idText}
      placeholder={fieldText}
    //   autoComplete="given-name"
      className="mt-1 border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm rounded-md p-2"
    />
  </div>
  )
}

export default FormInputFieldComponent