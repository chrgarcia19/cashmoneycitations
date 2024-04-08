import Link from "next/link";
import TagForm from "@/components/TagForm";
import { ApplyTagsToRef } from "../../components/tagComponents/applyTagsToRef";
import { getUserTags } from "@/components/componentActions/tagActions";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { getUserReferences } from "@/components/componentActions/actions";

export default async function DisplayTags(){
    const session = await getServerSession(authConfig);
    const userId = session?.user?.id ?? '';

    const tags = await getUserTags(userId);
    const references = await getUserReferences(userId);

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
                            {tags?.map((tag) => (
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
