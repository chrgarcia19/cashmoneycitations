"use client"

import { Contributor } from "@/models/Contributor";
// import { DateTemplate } from "@/models/CSLBibTex";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import ContributorForm from "../ContributorForm";
import { HandleManualReference } from "../citationActions";
import { EditReference } from "../editReferenceActions";

/*Creating an array of days for a select box*/
const days = new Array<number>();
for (let i = 1; i < 32; i++){
  days.push(i);
}

interface BookData {
    type: string;
    citekey: string;
    image_url: string;
    title: string;
    isbn: string;
    volume: string;
    edition: string;
    contributors: Contributor[];
    date: string;
    month_published: string;
    day_published: string;
    year_published: string;
    publisher: string;
    city: string;
    state: string;
}

interface Error {
    type?: string;
    citekey?: string;
    title?: string;
    contributors?: string;
    publisher?: string;
    year_published?: string;
  }

type Props = {
    formID: string;
    bookForm: BookData;
    forNewReference?: boolean;
};

const BookForm = ({formID, bookForm, forNewReference = true}: Props) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const contentType = "application/json";
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    
    const [form, setForm] = useState({
        type: "book",
        image_url: bookForm.image_url,
        contributors: bookForm.contributors,
        date: bookForm.date,
        title: bookForm.title,
        isbn: bookForm.isbn,
        volume: bookForm.volume,
        edition: bookForm.edition,
        month_published: bookForm.month_published,
        day_published: bookForm.day_published,
        year_published: bookForm.year_published,
        publisher: bookForm.publisher,
        city: bookForm.city,
        state: bookForm.state,
    });

    //Handling contributor stuff
    const updateFormData = (newData: Array<any>) => {
        setForm({
        ...form,
        contributors: newData,
        });
    };


    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => {
        const target = e.target;
        const value = target.value;
        const name = target.name;

        setForm({
        ...form,
        [name]: value,
        });
    };

    /* Makes sure reference info is filled for reference name, type, contributors, and image url*/
    const formValidate = () => {
        let err: Error = {};
        //if (!form.type) err.type = "Type is required";
        if (!form.title) err.title = "Title is required";
        if (!form.contributors) err.contributors = "Contributor info is required";
        if (!form.publisher) err.publisher = "Publisher is required";
        // if (!form.year_published) err.year_published = "Year is required";
        return err;
      };
    
      const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const errs = formValidate();
        const id = searchParams.get('id')
        if (Object.keys(errs).length === 0) {
          forNewReference ? HandleManualReference(form) : EditReference(form, id);
        } else {
          setErrors({ errs });
        }
      };

    const formContent = () => {
        return (
            <>
                <div className="flex items-center justify-center">
                    <ContributorForm updateFormData ={ updateFormData } contributors = {form.contributors}/>
                </div>
    
                    <form id={formID} onSubmit={handleSubmit} className="pb-5">
    
    
                        <label 
                            className="font-bold" 
                            htmlFor="image_url">
                            Image URL (Optional)
                        </label>
                        <input
                            type="url"
                            value={form.image_url}
                            name="image_url"
                            onChange={handleChange}
                        />
    
                        <label
                            className="font-bold"
                            htmlFor="title">
                            Book Title
                        </label>
                        <input
                            type="text"
                            id="reference-title"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            required
                        />
    
                        <div className="join w-auto pt-1">
                            <div className="me-10">
                                <div className="join join-vertical">
                                    <label
                                        className="font-bold me-2"
                                        htmlFor="volume">
                                        Volume
                                    </label>
                                    <input
                                        className="w-64"
                                        type="text"
                                        value={form.volume}
                                        name="volume"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="join join-vertical">
                                <label
                                    className="font-bold me-2"
                                    htmlFor="edition">
                                    Edition
                                </label>
                                <input
                                    className="w-64"
                                    type="text"
                                    value={form.edition}
                                    name="edition"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
    
                        <div className="join w-auto pt-1">
                            <div className="join join-vertical me-10">
                                <label
                                    className="font-bold me-2" 
                                    htmlFor="city">
                                    City
                                </label>
                                <input
                                    className="w-64"
                                    type="text"
                                    value={form.city}
                                    name="city"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="join join-vertical">
                                <label
                                    className="font-bold"
                                    htmlFor="state">
                                    State
                                </label>
                                <input
                                className="w-64"
                                    type="text"
                                    value={form.state}
                                    name="state"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <label
                            className="font-bold"
                            htmlFor="isbn">
                            International Standard Book Number (ISBN)
                        </label>
                        <input
                            type="text"
                            name="isbn"
                            value={form.isbn}
                            onChange={handleChange}
                            required
                        />  
    
                        <label
                            className="font-bold"
                            htmlFor="publisher">
                            Publisher
                        </label>
                        <input
                            type="text"
                            value={form.publisher}
                            name="publisher"
                            onChange={handleChange}
                            required
                        />     
                        
                        <label className="font-bold pt-1" htmlFor="date_published">
                            Date Published (Month, Day, Year)
                        </label>
                        <div className="join w-auto">
                            <div className="me-3">
                                <div className="join join-vertical">
                                    <div className="label">
                                        <span className="label-text">Month</span>
                                    </div>
                                    <select
                                        name="month_published"
                                        className="select select-sm select-bordered w-40"
                                        defaultValue={form.date}
                                        onChange={handleChange}>
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
                                        <span className="label-text">Day</span>
                                    </div>
                                    <select 
                                        name="day_published"
                                        className="select select-sm select-bordered w-40"
                                        defaultValue={form.date}
                                        onChange={handleChange}>
                                        <option value="" disabled>Pick a day</option>
                                        {days.map((day, i) => (
                                            <option 
                                                key={i}
                                                value={form.date}
                                                >
                                                {day}
                                            </option>
                                            ))} 
                                    </select>
                                </div>
                            </div>
                            <div className="join join-vertical">
                                <div className="label">
                                    <span className="label-text">Year</span>
                                </div>
                                <input
                                    className="h-8 w-52"
                                    placeholder="Pick a Year"
                                    type="text"
                                    value={form.date}
                                    name="year_published"
                                    onChange={handleChange}
                                    required 
                                />
                            </div>
                        </div> 
                        
                        <button type="submit" className="btn bg-green-500 hover:bg-green-900 text-white">
                            Submit
                        </button> 
                </form>
                <p>{message}</p>
                <div>
                {Object.keys(errors).map((err, index) => (
                    <li key={index}>{err}</li>
                ))}
                </div>
            </>
        )
    }

    return (
        <>
        {!forNewReference && (
            <div className="pt-5 pb-5 w-full flex items-center justify-center">
                <div className="bg-gray-100 w-2/5 rounded-xl">
                    <div className="flex justify-center items-center">
                        <h1 className="text-2xl align-middle pt-5">Edit Reference</h1>
                    </div>
                    <div className="pt-5">
                        {formContent()}
                    </div>
                
                </div>
            </div>
        )}
        {forNewReference && (
            formContent()
        )}
        </>
    )

    

}

export default BookForm;