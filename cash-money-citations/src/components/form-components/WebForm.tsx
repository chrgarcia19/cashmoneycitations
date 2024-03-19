"use client"

import { Contributor } from "@/models/Contributor";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import ContributorForm from "../ContributorForm";

/*Creating an array of days for a select box*/
const days = new Array<number>();
for (let i = 1; i < 32; i++){
  days.push(i);
}

interface WebData {
    type: string;
    citekey: string;
    image_url: string;
    contributors: Contributor[];
    source_title: string;
    website_title: string;
    website_url: string;
    month_accessed: string;
    day_accessed: string;
    year_accessed: string;
    month_published: string;
    day_published: string;
    year_published: string;
    publisher: string;
}

interface Error {
    type?: string;
    citekey?: string;
    source_title?: string;
    contributors?: string;
    publisher?: string;
    year?: string;
  }

type Props = {
    formID: string;
    webForm: WebData;
    forNewReference?: boolean;
};

const WebForm = ({formID, webForm, forNewReference = true}: Props) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const contentType = "application/json";
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    
    const [form, setForm] = useState({
        type: "website",
        citekey: webForm.citekey,
        image_url: webForm.image_url,
        contributors: webForm.contributors,
        source_title: webForm.source_title,
        website_title: webForm.website_title,
        website_url: webForm.website_url,
        month_accessed: webForm.month_accessed,
        day_accessed: webForm.day_accessed,
        year_accessed: webForm.year_accessed,
        month_published: webForm.month_published,
        day_published: webForm.day_published,
        year_published: webForm.year_published,
        publisher: webForm.publisher,
    });

    const id  = searchParams.get("id");

    const fetcher = async (url: string) => {
        const res = await fetch(`/api/webRef/${id}`);
        if (!res.ok) {
        throw new Error("An error occurred while fetching the data.");
        }
        return res.json();
    };

    const useData = (url: string) => {
        const { data, error, mutate } = useSWR(url, fetcher);

        return {
        data,
        error,
        isLoading: !data && !error,
        mutate,
        };
    };

    /* The PUT method edits an existing entry in the mongodb database. */
    const putData = async (form: WebData) => {
        const id  = searchParams.get("id");

        try {
        const res = await fetch(`/api/webRef/${id}`, {
            method: "PUT",
            headers: {
            Accept: contentType,
            "Content-Type": contentType,
            },
            body: JSON.stringify(form),
        });

        // Throw error with status code in case Fetch API req failed
        if (!res.ok) {
            throw new Error(res.status.toString());
        }

        const { data } = await res.json();

        mutate(`/api/webRef/${id}`, data, true); // Update the local data without a revalidation
        router.push("/");
        router.refresh();
        } catch (error) {
        setMessage("Failed to update reference");
        }
    };

    //Handling contributor stuff
    const updateFormData = (newData: Array<any>) => {
        setForm({
        ...form,
        contributors: newData,
        });
    };

    /* The POST method adds a new entry in the mongodb database. */
    const postData = async (form: WebData) => {
        try {
        const res = await fetch("/api/webRef", {
            method: "POST",
            headers: {
            Accept: contentType,
            "Content-Type": contentType,
            },
            body: JSON.stringify(form),
        });

        // Throw error with status code in case Fetch API req failed
        if (!res.ok) {
            throw new Error(res.status.toString());
        }
        router.push("/");
        router.refresh();
        } catch (error) {
        setMessage("Failed to add reference");
        }
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
        if (!form.type) err.type = "Type is required";
        if (!form.citekey) err.citekey = "Citekey is required";
        if (!form.source_title) err.source_title = "Article title is required";
        if (!form.contributors) err.contributors = "Contributor info is required";
        if (!form.publisher) err.publisher = "Publisher is required";
        if (!form.year_published) err.year = "Year is required";
        if (!form.image_url) {
            form.image_url = "https://netzrechtliches.de/wp-content/uploads/2019/06/website-1778529_640.png";
        }
        return err;
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const errs = formValidate();

        if (Object.keys(errs).length === 0) {
            forNewReference ? postData(form) : putData(form);
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
    
                        <label className="font-bold" htmlFor="citekey">
                            Citekey
                        </label>
                        <input
                            type="text"
                            name="citekey"
                            defaultValue={form.citekey}
                            onChange={handleChange}
                            required
                        /> 
    
                        <label 
                            className="font-bold" 
                            htmlFor="image_url">
                            Image URL (Optional)
                        </label>
                        <input
                            type="url"
                            name="image_url"
                            defaultValue={form.image_url}
                            onChange={handleChange}
                        />
    
                        <label 
                            className="font-bold" 
                            htmlFor="article_title">
                            Article Title
                        </label>
                            <input
                            type="text"
                            name="source_title"
                            defaultValue={form.source_title}
                            onChange={handleChange}
                            required 
                            />
                        <label 
                            className="font-bold"
                            htmlFor="website_title">
                            Website Title
                        </label>
                            <input
                            type="text"
                            name="website_title"
                            defaultValue={form.website_title}
                            onChange={handleChange}
                            required 
                            />
                        <label 
                            className="font-bold"
                            htmlFor="url">
                            Website URL
                        </label>
                            <input
                            type="text"
                            name="website_url"
                            defaultValue={form.website_url}
                            onChange={handleChange}
                            required 
                            />
                        
                        <br/>
                        <label className="font-bold" htmlFor="date_accessed">
                            Date Accessed (Month, Day, Year)
                        </label>
                        <div className="join w-auto">
                            <div className="me-3">
                                <div className="join join-vertical">
                                    <div className="label">
                                        <span className="label-text">Month</span>
                                    </div>
                                    <select
                                        name="month_accessed"
                                        className="select select-sm select-bordered w-40"
                                        defaultValue={form.month_accessed}
                                        onChange={handleChange}>
                                        <option value="" disabled>Pick a Month</option>
                                        <option value="January">January</option>
                                        <option value="February">February</option>
                                        <option value="March">March</option>
                                        <option value="April">April</option>
                                        <option value="May">May</option>
                                        <option value="June">June</option>
                                        <option value="July">July</option>
                                        <option value="August">August</option>
                                        <option value="September">September</option>
                                        <option value="October">October</option>
                                        <option value="November">November</option>
                                        <option value="December">December</option>
                                    </select> 
                                </div>
                            </div>
                            <div className="me-3">
                                <div className="join join-vertical">
                                    <div className="label">
                                        <span className="label-text">Day</span>
                                    </div>
                                    <select 
                                        name="day_accessed"
                                        className="select select-sm select-bordered w-40"
                                        defaultValue={form.day_accessed}
                                        onChange={handleChange}>
                                        <option value="" disabled>Pick a day</option>
                                        {days.map((day, i) => (
                                            <option 
                                                key={i}
                                                defaultValue={form.day_accessed}>
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
                                    name="year_accessed"
                                    defaultValue={form.year_accessed}
                                    onChange={handleChange}
                                    required 
                                />
                            </div>
                        </div>
    
                        <br/>
                        <br/>
                        <label className="font-bold" htmlFor="date_published">
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
                                        defaultValue={form.month_published}
                                        onChange={handleChange}>
                                        <option value="" disabled>Pick a Month</option>
                                        <option value="January">January</option>
                                        <option value="February">February</option>
                                        <option value="March">March</option>
                                        <option value="April">April</option>
                                        <option value="May">May</option>
                                        <option value="June">June</option>
                                        <option value="July">July</option>
                                        <option value="August">August</option>
                                        <option value="September">September</option>
                                        <option value="October">October</option>
                                        <option value="November">November</option>
                                        <option value="December">December</option>
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
                                        defaultValue={form.day_published}
                                        onChange={handleChange}>
                                        <option value="" disabled>Pick a day</option>
                                        {days.map((day, i) => (
                                            <option 
                                                key={i}
                                                defaultValue={form.day_published}>
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
                                    name="year_published"
                                    defaultValue={form.year_published}
                                    onChange={handleChange}
                                    required 
                                />
                            </div>
                        </div>
                                        
    
                        <label
                            className="font-bold"
                            htmlFor="publisher">
                            Publisher
                        </label>
                        <input
                            type="text"
                            name="publisher"
                            defaultValue={form.publisher}
                            onChange={handleChange}
                            required
                        />        
    
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

export default WebForm;