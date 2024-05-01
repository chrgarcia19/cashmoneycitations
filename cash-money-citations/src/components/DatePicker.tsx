import { Input } from "@nextui-org/react";

type Props = {
    /*[0] for month
      [1] for day
      [2] for year*/
    masterLabelText: string,
    labelText: string[],
    fieldName: string[],
    fieldValue: string[];
    fieldType: string;
    fieldPlaceholder: string;
    handleChange: any;
}

/*Creating an array of days for a select box*/
const days = new Array<number>();
for (let i = 1; i < 32; i++){
  days.push(i);
}

const DatePicker = (props: Props) => {
    return(
        <>
            <div>
                <label className="flex justify-center items-center font-bold text-lg pt-1 text-gray-800 dark:text-white">
                    {props.masterLabelText}
                </label>
                <div className="flex justify-between w-full pb-2">
                    <div className="w-1/4">
                        <div className="flex flex-col">
                            <label className="font-bold text-gray-800 dark:text-white p-1">{props.labelText[0]}</label> 
                            <select
                                name={props.fieldName[0]}
                                className="select select-sm rounded-md select-bordered w-full shadow-lg max-w-xs bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                                defaultValue={props.fieldValue[0] ? props.fieldValue[0]: 0}
                                onChange={props.handleChange}>
                                <option value="">Pick a Month</option>
                                <option value="0">January</option>
                                <option value="1">February</option>
                                <option value="2">March</option>
                                <option value="3">April</option>
                                <option value="4">May</option>
                                <option value="5">June</option>
                                <option value="6">July</option>
                                <option value="7">August</option>
                                <option value="8">September</option>
                                <option value="9">October</option>
                                <option value="10">November</option>
                                <option value="11">December</option>
                            </select> 
                        </div>
                    </div>
                    <div className="w-1/4">
                        <div className="flex flex-col">
                            <label className="font-bold text-gray-800 dark:text-white p-1">{props.labelText[1]}</label> 
                            <select 
                                name={props.fieldName[1]}
                                className="select select-sm select-bordered w-full shadow-lg max-w-xs bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                                defaultValue={props.fieldValue[1]}
                                onChange={props.handleChange}>
                                <option value="">Pick a day</option>
                                {days.map((day, i) => (
                                    <option 
                                        key={i}
                                        value={day}>
                                        {day}
                                    </option>
                                    ))} 
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-bold text-gray-800 dark:text-white p-1">{props.labelText[2]}</label> 
                        {props.masterLabelText === "Date Published (Month, Day, Year)" ? (
                            <Input
                                isRequired
                                placeholder={props.fieldPlaceholder}
                                size="sm"
                                type={props.fieldType}
                                defaultValue={props.fieldValue[2]}
                                name={props.fieldName[2]}
                                onChange={props.handleChange}
                                radius="lg"
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
                                }}/>
                        ) : (
                            <Input
                                placeholder={props.fieldPlaceholder}
                                size="sm"
                                type={props.fieldType}
                                defaultValue={props.fieldValue[2]}
                                name={props.fieldName[2]}
                                onChange={props.handleChange}
                                radius="lg"
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
                                }}/>
                        )}
                    </div>
                </div> 
            </div>
        </>
    )
}

export default DatePicker;
