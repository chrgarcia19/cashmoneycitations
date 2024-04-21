import { getUserReferences } from "@/components/componentActions/actions";
import { getGroups, getUserGroups } from "@/components/componentActions/groupActions";
import { authConfig } from "@/lib/auth";
import { getServerSession } from "next-auth";
import GroupCard from "./groupCard";
import { Group } from "@/models/Group";
import CreateCard from "./createGroup";
import GroupLibrary from "./groupLibrary";

export default async function GroupCenter() {

    const session = await getServerSession(authConfig);
    const userId = session?.user?.id ?? '';

    const groups = await getUserGroups(userId);
    const references = await getUserReferences(userId);

    const groupLibrary = await getGroups();

    const groupData = {
        groupName: "",
    };

    return (
        <>
            <h1 
                className="font-bold text-3xl flex items-center justify-center pt-10">
                    Welcome to the Group Center!
            </h1>
            <div className="flex items-center justify-center pl-5 pt-10 pr-5">
                <div className="flex flex-wrap gap-4">
                    {groups?.map((group: Group) => (
                        <GroupCard key={group._id} group={group} />
                    ))}
                    <CreateCard formId={"create-group"} groupForm={groupData} />
                    <GroupLibrary groups={groupLibrary} />
                </div>
            </div>
        </>
    )
}