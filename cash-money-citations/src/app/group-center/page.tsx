import { getUserReferences } from "@/components/componentActions/actions";
import { getUserGroups } from "@/components/componentActions/groupActions";
import { authConfig } from "@/lib/auth";
import { getServerSession } from "next-auth";
import GroupCard from "./groupCard";
import { group } from "console";
import { Group } from "@/models/Group";
import CreateCard from "./createGroup";

export default async function GroupCenter() {

    const session = await getServerSession(authConfig);
    const userId = session?.user?.id ?? '';

    const groups = await getUserGroups(userId);
    const references = await getUserReferences(userId);

    const groupData = {
        groupName: "",
    };

    return (
        <>
            <div className="flex items-center justify-center pt-10">
                <div className="flex justify-between">
                    {groups?.map((group: Group) => (
                    <GroupCard key={group._id} group={group} />
                ))}
                <CreateCard formId={"create-group"} groupForm={groupData} />
                </div>
            </div>
        </>
    )
}