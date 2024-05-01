'use client'
import { Input } from "@nextui-org/react";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

type Props = {
    labelText: string;
    fieldName: string;
    fieldValue: string;
    fieldPlaceholder: string;
    handleChange: any;
}

const PasswordField = (props: Props) => {

    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    return(
        <>
            <Input
                isRequired
                name={props.fieldName}
                endContent={
                    <button className="focus:outline-none my-0 mx-2" type="button" onClick={toggleVisibility}>
                        {isVisible ? (
                            <FaEyeSlash className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                            <FaEye className="text-2xl text-default-400 pointer-events-none" />
                    )}
                </button>
                }
                type={isVisible ? "text" : "password"}
                label={props.labelText}
                labelPlacement="outside"
                placeholder={props.fieldPlaceholder}
                value={props.fieldValue}
                onChange={props.handleChange}
                description={`Enter the ${props.fieldPlaceholder}`}
                radius="lg"
                className="pt-2"
                classNames={{
                    label: "font-bold text-lg text-black/50 dark:text-white/90",
                    description: "text-black dark:text-white/90",
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
                }}>
            </Input>
        </>
    )
}

export default PasswordField;