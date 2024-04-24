type Props = {
    labelText: string,
    fieldName: string,
    fieldValue: any;
    fieldType: string;
    fieldPlaceholder: string;
    handleChange: any;
}

const FormField = (props: Props) => {
    return (
        <>
            <label
                className="font-bold"
                htmlFor={props.fieldName}>
            {props.labelText}
            </label>
            <input
                type={props.fieldType}
                value={props.fieldValue}
                name={props.fieldName}
                onChange={props.handleChange}
                placeholder={props.fieldPlaceholder}
                className="dark:text-white"
                > 
            </input>
        </>
    )
}

export default FormField;