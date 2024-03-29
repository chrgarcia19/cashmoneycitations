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
            <label className="font-bold pt-1" htmlFor={props.fieldName[0]}>
                {props.masterLabelText}
            </label>
            <div className="join w-auto">
                <div className="me-3">
                    <div className="join join-vertical">
                        <div className="label">
                            <span className="label-text">{props.labelText[0]}</span>
                        </div>
                        <select
                            name={props.fieldName[0]}
                            className="select select-sm select-bordered w-40"
                            defaultValue={props.fieldValue[0]}
                            onChange={props.handleChange}>
                            <option value="" disabled>Pick a Month</option>
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
                <div className="me-3">
                    <div className="join join-vertical">
                        <div className="label">
                            <span className="label-text">{props.labelText[1]}</span>
                        </div>
                        <select 
                            name={props.fieldName[1]}
                            className="select select-sm select-bordered w-40"
                            defaultValue={props.fieldValue[1]}
                            onChange={props.handleChange}>
                            <option value="" disabled>Pick a day</option>
                            {days.map((day, i) => (
                                <option 
                                    key={i}
                                    value={day}
                                    >
                                    {day}
                                </option>
                                ))} 
                        </select>
                    </div>
                </div>
                <div className="join join-vertical">
                    <div className="label">
                        <span className="label-text">{props.labelText[2]}</span>
                    </div>
                    <input
                        className="h-8 w-52"
                        placeholder={props.fieldPlaceholder}
                        type={props.fieldType}
                        defaultValue={props.fieldValue[2]}
                        name={props.fieldName[2]}
                        onChange={props.handleChange}
                        required 
                    />
                </div>
            </div> 
        </>
    )
}

export default DatePicker;