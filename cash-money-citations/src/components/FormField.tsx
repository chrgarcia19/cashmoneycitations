import { Input } from "@nextui-org/react";

type Props = {
    required: boolean,
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
            {props.required && (
                <Input
                    isRequired
                    name={props.fieldName}
                    type={props.fieldType}
                    label={props.labelText}
                    labelPlacement="outside"
                    placeholder={props.fieldPlaceholder}
                    value={props.fieldValue}
                    onChange={props.handleChange}
                    description={`Enter the ${props.fieldPlaceholder}`}
                    radius="lg"
                    className="pt-4"
                    classNames={{
                        label: "font-bold text-lg text-black/50 dark:text-white/90",
                        input: [
                          "bg-transparent",
                          "text-black/90 dark:text-white/90",
                          "placeholder:text-default-700/50 dark:placeholder:text-white/60",
                        ],
                        innerWrapper: "bg-transparent",
                        inputWrapper: [
                          "shadow-xl",
                          "bg-default-200/50",
                          "dark:bg-default/60",
                          "backdrop-blur-xl",
                          "backdrop-saturate-200",
                          "hover:bg-default-200/70",
                          "dark:hover:bg-default/70",
                          "group-data-[focused=true]:bg-default-200/50",
                          "dark:group-data-[focused=true]:bg-default/60",
                          "!cursor-text",
                          "px-0"
                        ],
                    }}
                    />
            ) || (
                <Input
                    name={props.fieldName}
                    type={props.fieldType}
                    label={props.labelText}
                    labelPlacement="outside"
                    placeholder={props.fieldPlaceholder}
                    value={props.fieldValue}
                    onChange={props.handleChange}
                    description={`Enter the ${props.fieldPlaceholder}`}
                    radius="lg"
                    className="pt-4"
                    classNames={{
                        label: "font-bold text-lg text-black/50 dark:text-white/90",
                        input: [
                          "bg-transparent",
                          "text-black/90 dark:text-white/90",
                          "placeholder:text-default-700/50 dark:placeholder:text-white/60",
                        ],
                        innerWrapper: "bg-transparent",
                        inputWrapper: [
                          "group-data-[focus-visible=true]:ring-0 group-data-[focus-visible=true]:ring-offset-0",
                          "shadow-xl",
                          "bg-default-200/50",
                          "dark:bg-default/60",
                          "backdrop-blur-xl",
                          "backdrop-saturate-200",
                          "hover:bg-default-200/70",
                          "dark:hover:bg-default/70",
                          "group-data-[focused=true]:bg-default-200/50",
                          "dark:group-data-[focused=true]:bg-default/60",
                          "!cursor-text",
                          "px-0"
                        ],
                    }}
                />
            )}
        </>
    )
}

export default FormField;