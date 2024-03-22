'use client'

import { References } from "@/models/Reference";
import { Tag } from "@/models/Tag";
import { TagRefTable } from "./TagRefTable";
import { TagTable } from "./TagTable";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR, { mutate } from "swr";

interface TagData {
    tagID: string[];
    tagName: string[];
}

interface RefData {
    refID: string[];
}

interface IProps {
    tags: any;
    references: any;
}

const fetcher = (url: string) =>
  fetch(url)
    .then((res) => res.json())
    .then((json) => json.data);

export const ApplyTagsToRef = ({ tags, references }: IProps) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const contentType = "application/json";    

    function getSingleItem(apiType: string){
        const id = searchParams.get('id');
        const {
            data: item,
            error,
            isLoading,
        } = useSWR(id ? `/api/${apiType}/${id}` : null, fetcher);

        if (error) return <p>Failed to load</p>;
        if (isLoading) return <p>Loading...</p>;
        if (!item){ return null }
        else if (item) { return item }; 
    }

    function getRefForm(data: any){
        const referenceForm = {
            type: data.type,
            citekey: data.citekey,
            title: data.title,
            contributors: data.contributors,
            publisher: data.publisher,
            year: data.year,
            month: data.month,
            address: data.address,
            edition: data.edition,
            volume: data.volume,
            isbn: data.isbn,
            doi: data.doi,
            pages: data.pages,
            journal: data.journal,
            image_url: data.image_url,
            tags: data.tags,
        };

        return referenceForm;
    }

    function getTagForm(data: any){
        const tagForm = {
            tagName: data.tagName,
            tagColor: data.tagColor,
            referenceID: data.referenceID,
        };

        return tagForm;
    }
    
    /*Function for access the tag route and updating it*/
    const putDataTag = async (tags: Tag[]) => {
        const id  = searchParams.get("id");
    
        try {
          const res = await fetch(`/api/tags/${id}`, {
            method: "PUT",
            headers: {
              Accept: contentType,
              "Content-Type": contentType,
            },
            body: JSON.stringify(tags),
          });
    
          // Throw error with status code in case Fetch API req failed
          if (!res.ok) {
            throw new Error(res.status.toString());
          }
    
          const { data } = await res.json();
    
          mutate(`/api/tags/${id}`, data, true); // Update the local data without a revalidation
        } catch (error) {
        }
      };

      /*Function for access the tag route and updating it*/
    const putDataRef = async (refs: References[]) => {
        const id  = searchParams.get("id");
    
        try {
          const res = await fetch(`/api/references/${id}`, {
            method: "PUT",
            headers: {
              Accept: contentType,
              "Content-Type": contentType,
            },
            body: JSON.stringify(refs),
          });
    
          // Throw error with status code in case Fetch API req failed
          if (!res.ok) {
            throw new Error(res.status.toString());
          }
    
          const { data } = await res.json();
    
          mutate(`/api/references/${id}`, data, true); // Update the local data without a revalidation
        } catch (error) {
        }
      };

    const handleAddTag = (refs: References[], tags: Tag[]) => {
        let currentRef, currentTag;
        /*Adding all selected tags to each ref*/  
        for (let i = 0; i < refs.length; i++){
            currentRef = refs[i];
            for (let j = 0; j < tags.length; j++){
                currentRef.tags.push(tags[j]);
            }
            refs[i] = currentRef;
            //tag.referenceID.push(refs[i]._id);
            //refs[i].tags.push(tag);
        }
        /*Adding all selected refs to each tag*/  
        for (let i = 0; i < tags.length; i++){
            currentTag = tags[i];
            for (let j = 0; j < refs.length; j++){
                currentTag.referenceID.push(refs[j]._id);
            }
            tags[i] = currentTag;
            //tag.referenceID.push(refs[i]._id);
            //refs[i].tags.push(tag);
        }
        putDataRef(refs);
        putDataTag(tags);
        router.push("/tag-center");
        router.refresh();
        
        
    }

    return(
        <>
            <div className="card w-screen h-auto bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">Apply Tags to References</h2>
                        <form onSubmit={() => handleAddTag(references, tags)}>
                            <TagRefTable references={references} />
                            <TagTable tags={tags} />
                            <div className="card-actions justify-end">
                                <button 
                                    className="btn btn-primary"
                                    type="submit"
                                    >
                                    Add to Reference</button>
                            </div>
                        </form>
                    </div>
                </div>
            </>
    )
}