"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { mutate } from "swr";

interface TagData {
    tagName: string;
}

type Props = {
    formID: string;
    tagForm: TagData;
    forNewTag?: boolean;
};

const TagForm = ({formID, tagForm, forNewTag = true} : Props) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const contentType = "application/json";

    const [form, setForm] = useState({
        tagName: tagForm.tagName,
    });

    /* The PUT method edits an existing entry in the mongodb database. */
  const putData = async (form: TagData) => {
    const id  = searchParams.get("id");

    try {
      const res = await fetch(`/api/tags/${id}`, {
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

      mutate(`/api/tags/${id}`, data, true); // Update the local data without a revalidation
      router.push("/");
      router.refresh();
    } catch (error) {
   
    }
  };

  /* The POST method adds a new entry in the mongodb database. */
  const postData = async (form: TagData) => {
    try {
      const res = await fetch("/api/tags", {
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

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        forNewTag ? postData(form) : putData(form);
        /*if (Object.keys(errs).length === 0) {
            forNewUser ? postData(form) : putData(form);
        } else {
            setErrors( { errs });
        }*/
        console.log(form.tagName);
    };

    return (
        <>
            <div>Welcome to the Tag Center!</div>
            <br />
            <div className="">
            <div className="card w-96 bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <h2 className="card-title">Create Tag</h2>
              <div className="card-actions">
              <form id={formID} onSubmit={handleSubmit}>
                <div className="join join-horizontal">
                    <input
                        type="text"
                        name="tagName"
                        onChange={handleChange}
                        value={form.tagName}
                        required
                    /> 
                    <button type="submit" className="btn btn-sm bg-green-500 hover:bg-green-900 text-white">
                        Submit
                    </button>
                </div>    
                </form>
              </div>
            </div>
          </div>
                
            </div>
            
        </>
        
    )

}

export default TagForm;