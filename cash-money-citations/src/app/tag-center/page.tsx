import TagOptions from "@/components/tagComponents/tagOptions";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { getUserTags } from "@/components/componentActions/tagActions";
import { getUserReferences } from "@/components/componentActions/actions";


export default async function TagCenter() {

    const session = await getServerSession(authConfig);
    const userId = session?.user?.id ?? '';

    const tags = await getUserTags(userId);
    const references = await getUserReferences(userId);

    return (
        <>
            <TagOptions tags={tags} references={references} />
        </>
    )
}