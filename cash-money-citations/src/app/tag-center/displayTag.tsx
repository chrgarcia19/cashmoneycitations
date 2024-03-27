import dbConnect from "@/utils/dbConnect";
import Tag from "../../models/Tag";
import Link from "next/link";
import TagForm from "@/components/TagForm";
import { ApplyTagsToRef } from "./applyTagsToRef";
import CSLBibTex from "@/models/CSLBibTex";

async function getTags() {
    await dbConnect();
  
    const result = await Tag.find({});
    const tags = result.map((doc) => {
      const tag = JSON.parse(JSON.stringify(doc));
      return tag;
    });
  
    return tags;
}

async function getReferences() {
    await dbConnect();
  
    const result = await CSLBibTex.find({});
    const references = result.map((doc) => {
      const reference = JSON.parse(JSON.stringify(doc));
      return reference;
    });
  
    return references;
}

export default async function DisplayTags(){
    const tags = await getTags();
    const references = await getReferences();

    const tagData = {
        tagName: "",
        tagColor: "",
    }

    return (
        <>
            <div className="center-content">
                <div className="join join-horizontal">
                    <div className="card w-1/3 bg-base-100 shadow-xl">
                        <div className="card-body items-center text-center">
                            {tags.map((tag) => (
                                <span key={tag._id}>
                                    <Link href={{ pathname: `/${tag._id}/tags/edit`, query: { id: tag._id}}}>
                                        <div className={`badge badge-lg bg-teal-200 me-2`}>
                                            {tag.tagName}
                                        </div>
                                    </Link>
                                </span>
                            ))}
                            <br />
                            <div className="card-actions">
                            <h2 className="card-title">Create Tag</h2>
                                <TagForm formID={"add-new-tag"} tagForm={tagData} />
                            </div>
                        </div>
                    </div>
                    <ApplyTagsToRef tags={tags} references={references} />
                </div>
            </div>
        </>
    );
}
