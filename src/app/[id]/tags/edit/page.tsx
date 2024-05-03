import { getUserReferences } from "@/components/componentActions/actions";
import { authConfig } from "@/lib/auth";
import { CSLBibInterface } from "@/models/CSLBibTex";
import { getServerSession } from "next-auth";
import EditTag from "./editTag";

export default async function GetReferencesForTags(){
    const session = await getServerSession(authConfig);
    const userId = session?.user?.id ?? '';

    const references = await getUserReferences(userId) ?? new Array<CSLBibInterface>();

    return (
        <>
            <EditTag references={references} />
        </>
    )
    
}