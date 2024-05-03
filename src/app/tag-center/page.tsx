
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { getTags, getUserTags } from "@/components/componentActions/tagActions";
import { getUserReferences } from "@/components/componentActions/actions";
import TagOptions from "./tagOptions";

export default async function TagCenter() {

    const session = await getServerSession(authConfig);
    const userId = session?.user?.id ?? '';

    const allTags = await getTags();
    const tags = await getUserTags(userId);
    const references = await getUserReferences(userId);

    return (
        <>
            <h1 
                className="font-bold text-3xl flex items-center justify-center pt-10">
                    Welcome to the Tag Center!
            </h1>
            <div className="flex items-center justify-center pl-5 pt-5 pr-5">
                <div className="flex flex-wrap gap-4">
                    <TagOptions tags={tags} references={references} allTags={allTags} />
                </div>
            </div>

            
        </>
    )
}