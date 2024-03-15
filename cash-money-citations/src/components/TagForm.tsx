"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { mutate } from "swr";

interface TagData {
    name: string;
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
        tagName: tagForm.name,
    });

    /* The PUT method edits an existing entry in the mongodb database. */
  const putData = async (form: FormData) => {
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
  const postData = async (form: FormData) => {
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
        console.log(form);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        /*const errs = formValidate();

        if (Object.keys(errs).length === 0) {
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
                <form id="createTag" onSubmit={handleSubmit}>
                    <label className="font-bold" htmlFor="create_tag">
                        Create Tag
                    </label>
                    <div className="join join-horizontal">
                        <input
                            type="text"
                            name="create_tag"
                            defaultValue={form.tagName}
                            onChange={handleChange}
                            required
                        /> 
                        <button type="submit" className="btn btn-sm bg-green-500 hover:bg-green-900 text-white">
                            Submit
                        </button>
                    </div>
                    
                        
                </form>
            </div>
            <div className="badge badge-lg bg-blue-400">default</div>
        </>
        
    )

}

export default TagForm;