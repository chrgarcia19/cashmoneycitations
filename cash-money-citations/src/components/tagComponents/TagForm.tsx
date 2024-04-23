"use client"

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { mutate } from "swr";
import { editTag, handleNewTag } from "../componentActions/tagActions";

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
    const { data: session } = useSession();
    const router = useRouter();
    const contentType = "application/json";

    const [form, setForm] = useState({
        tagName: tagForm.tagName,
        tagColor: tagForm.tagColor,
    });


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
        const id = searchParams.get('id');
        const userId = session?.user?.id;

        form.tagColor = assignTagColor();

        if (forNewTag) {
          handleNewTag(form, userId);
          router.push("/tag-center");
          router.refresh();
        } else {
          editTag(form, id);
          router.push("/tag-center");
          router.refresh();
        }
    };

    return (
      <>    
        <div className="flex justify-center items-center">
          <form id={formID} onSubmit={handleSubmit}>
            <div className="join join-horizontal">
              <input
                  type="text"
                  name="tagName"
                  className="w-3/5 dark:text-white"
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
      </>
        
    )

}

export default TagForm;