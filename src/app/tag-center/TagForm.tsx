"use client"

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { editTag, handleNewTag } from "../../components/componentActions/tagActions";
import { Button, Input } from "@nextui-org/react";
    
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

    const backToTagCenter = () => {
      router.push("/tag-center");
      router.refresh();
    }

    return (
      <>    
        <div className="flex justify-center items-center">
          <form id={formID} onSubmit={handleSubmit}>
            {forNewTag && (
              <div className="flex items-center gap-0.5 pb-2">
                <Input 
                  isRequired
                  type="text"
                  name="tagName"
                  size="sm"
                  className="dark:text-white pt-5"
                  onChange={handleChange}
                  value={form.tagName} 
                  classNames={{
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
                        "px-0",
                    ],
                }}/>
                <Button
                  type="submit"
                  color="success"
                  size="sm"
                  className="font-bold text-sm text-white hover:bg-green-900">
                    Submit
                </Button>
              </div> 
            )}
            {!forNewTag && (
              <>
                <input
                  type="text"
                  name="tagName"
                  className="dark:text-white"
                  onChange={handleChange}
                  value={form.tagName}
                  required
                />
                <div className="flex gap-2 items-center">
                  <Button
                    onClick={() => backToTagCenter()}
                    color="primary"
                    className="font-bold text-white hover:bg-blue-900">
                      Back to Tags
                  </Button>
                  <Button
                    type="submit"
                    color="success"
                    className="font-bold text-white hover:bg-green-900">
                      Submit
                  </Button>
                </div> 
              </>
            )}

          </form>  
        </div>
      </>
        
    )

}

export default TagForm;