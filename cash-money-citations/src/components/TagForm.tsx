"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { mutate } from "swr";
import ClickableTag from "./ClickableTag";
import DisplayTags from "@/app/tag-center/displayTag";

interface TagData {
    tagName: string;
    tagColor: string;
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
        tagColor: tagForm.tagColor,
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
      router.push("/view-tag");
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

    function random(min: number, max: number) {
      return Math.floor(Math.random() * (max-min)) + min;
  }

    function assignTagColor(){
      const options = {
        colors: ['red', 'orange', 'amber', 'yellow',
            'lime', 'green', 'emerald', 'teal', 'cyan',
            'sky', 'blue', 'indigo', 'violet', 'purple',
            'fuchsia', 'pink', 'rose'],
        range: [2,7], // Between 100 and 400,
        prefix: 'bg', // Can be 'bg', 'text', etc.
      };

      const colorRange = {
        min: options.range[0],
        max: options.range[1],
      };
      const number = random(colorRange.min, colorRange.max) * 100;
      const indexColor = random(0, options.colors.length - 1);
      return `${options.prefix}-${options.colors[indexColor]}-${number}`;
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        form.tagColor = assignTagColor();

        forNewTag ? postData(form) : putData(form);
    };

    return (
      <>    
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
      </>
        
    )

}

export default TagForm;