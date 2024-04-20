import ReferenceTable from "./components/ReferenceTable";
import { getUserReferences } from "@/components/componentActions/actions";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { ReferenceProvider } from "./components/ReferenceTable";

export default async function RefTable() {
    // Get User Id from session
    const session = await getServerSession(authConfig);

    const userId = session?.user?.id ?? '';

    const userRefObject = await getUserReferences(userId);

    return(
      <ReferenceTable userRefObject={userRefObject} />
    )
  }