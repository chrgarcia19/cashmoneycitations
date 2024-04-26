import { Input } from "@nextui-org/react";

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
            {/*<label
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
    </input>*/}
            <Input
                name={props.fieldName}
                type={props.fieldType}
                label={props.labelText}
                labelPlacement="outside"
                placeholder={props.fieldPlaceholder}
                value={props.fieldValue}
                onChange={props.handleChange}
                radius="full"
                className="dark:text-white"
                >
            </Input>
        </>
    )
}

export default FormField;