import { getUserReferences } from "@/components/componentActions/actions";
import { authConfig } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { CSLBibInterface } from "@/models/CSLBibTex";
import GroupOptions from "./groupOptions";

const GroupModify = async () => {
    const session = await getServerSession(authConfig);

    const userId = session?.user?.id ?? '';

    const references = await getUserReferences(userId) ?? new Array<CSLBibInterface>();
    return (
        <>
            <GroupOptions references={references} />
        </>
    )
}

export default GroupModify;