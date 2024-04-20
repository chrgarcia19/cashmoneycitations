import { getUserReferences } from "@/components/componentActions/actions";
import { getUserGroups } from "@/components/componentActions/groupActions";
import { authConfig } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function GroupCenter() {

    const session = await getServerSession(authConfig);
    const userId = session?.user?.id ?? '';

    const groups = await getUserGroups(userId);
    const references = await getUserReferences(userId);

    return (
        <>
            <div className="flex items-center justify-center">
                Group Center
            </div>
        </>
    )
}