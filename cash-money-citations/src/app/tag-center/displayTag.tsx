import dbConnect from "@/utils/dbConnect";
import Tag from "../../models/Tag";
import Link from "next/link";
import TagForm from "@/components/TagForm";

async function getTags() {
    await dbConnect();
  
    const result = await Tag.find({});
    const tags = result.map((doc) => {
      const tag = JSON.parse(JSON.stringify(doc));
      return tag;
    });
  
    return tags;
}

export default async function DisplayTags(){
    const tags = await getTags();

    const tagData = {
        tagName: "",
        tagColor: "",
    };


    return (
        <>
            <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body items-center text-center">
                    {tags.map((tag) => (
                        <span key={tag._id}>
                            <Link href={{ pathname: `/${tag._id}/edit`, query: { id: tag._id}}}>
                                <div className={`badge badge-lg bg-teal-200 me-2`}>
                                    {tag.tagName}
                                </div>
                            </Link>
                        </span>
                    ))}
                    <div className="card-actions">
                    <h2 className="card-title">Create Tag</h2>
                        <TagForm formID={"add-new-tag"} tagForm={tagData} />
                    </div>
                </div>
            </div>
        </>
    );
}
