import { getUserReferences } from "@/components/componentActions/actions";
import { authConfig } from "@/lib/auth";
import { getServerSession } from "next-auth";
import EditGroup from "./editGroup";
import { CSLBibInterface } from "@/models/CSLBibTex";

export default async function GetReferencesForGroups(){
    const session = await getServerSession(authConfig);
    const userId = session?.user?.id ?? '';

    const references = await getUserReferences(userId) ?? new Array<CSLBibInterface>();

    return (
        <>
            <EditGroup references={references}/>
        </>
    )
    
}