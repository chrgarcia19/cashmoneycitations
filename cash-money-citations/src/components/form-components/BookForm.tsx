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

interface BookData {
    type: string;
    citekey: string;
    image_url: string;
    source_title: string;
    volume: string;
    edition: string;
    contributors: Contributor[];
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
    book_title?: string;
    contributors?: string;
    publisher?: string;
    year_published?: string;
  }

type Props = {
    formID: string;
    bookForm: BookData;
    forNewReference?: boolean;
};

const WebForm = ({formID, bookForm, forNewReference = true}: Props) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const contentType = "application/json";
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    
    const [form, setForm] = useState({
        type: "book",
        citekey: bookForm.citekey,
        image_url: bookForm.image_url,
        contributors: bookForm.contributors,
        source_title: bookForm.source_title,
        volume: bookForm.volume,
        edition: bookForm.edition,
        month_published: bookForm.month_published,
        day_published: bookForm.day_published,
        year_published: bookForm.year_published,
        publisher: bookForm.publisher,
        city: bookForm.city,
        state: bookForm.state,
    });

    const id  = searchParams.get("id");

    const fetcher = async (url: string) => {
        const res = await fetch(`/api/bookRef/${id}`);
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
    const putData = async (form: BookData) => {
        const id  = searchParams.get("id");

        try {
        const res = await fetch(`/api/bookRef/${id}`, {
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

        mutate(`/api/bookRef/${id}`, data, true); // Update the local data without a revalidation
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
    const postData = async (form: BookData) => {
        try {
        const res = await fetch("/api/bookRef", {
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
        if (!form.contributors) err.contributors = "Contributor info is required";
        if (!form.publisher) err.publisher = "Publisher is required";
        if (!form.year_published) err.year_published = "Year is required";
        if (!form.image_url) {
            form.image_url = "https://st2.depositphotos.com/8301258/11704/v/450/depositphotos_117048908-stock-illustration-design-books-logo-vector.jpg";
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
                        htmlFor="source_title">
                        Book Title
                    </label>
                    <input
                        type="text"
                        name="source_title"
                        defaultValue={form.source_title}
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
                                    name="volume"
                                    defaultValue={form.volume}
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
                                name="edition"
                                defaultValue={form.edition}
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
                                name="city"
                                defaultValue={form.city}
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
                                name="state"
                                defaultValue={form.state}
                                onChange={handleChange}
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
                                    defaultValue={form.month_published}
                                    onChange={handleChange}>
                                    <option value="" disabled selected>Pick a Month</option>
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
                                    <option disabled selected>Pick a day</option>
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

export default WebForm;