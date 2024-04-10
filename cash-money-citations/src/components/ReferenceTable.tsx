import ReferenceCheckbox from "./ReferenceCheckbox";
import {getUserReferences} from "./componentActions/actions";
import { authConfig } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { getUserTags } from "./componentActions/tagActions";

async function ReferenceTable(){
  const session = await getServerSession(authConfig);
  const userId = session?.user?.id ?? '';

  const references = await getUserReferences(userId);
  const tags = await getUserTags(userId);
  
    return(
      <>
        <div className='pt-20 pb-20 pr-10 pl-10'>
        <table className='table table-lg table-pin-row'>
          <thead>
            <tr className="sticky">
              <th className="border border-slate-800 text-center text-black text-xl bg-sky-400">Select</th>
              <th className="border border-slate-800 text-center text-black text-xl bg-sky-400">Tags</th>
              <th className="border border-slate-800 text-center text-black text-xl bg-sky-400">Date Published</th>
              <th className="border border-slate-800 text-center text-black text-xl bg-sky-400">Title</th>
              <th className="border border-slate-800 text-center text-black text-xl bg-sky-400">Contributors</th>
              <th className="border border-slate-800 text-center text-black text-xl bg-sky-400">Type</th>
            </tr>
          </thead>
          <tbody>
            <ReferenceCheckbox references={references} tags={tags}></ReferenceCheckbox>
          </tbody>
        </table>
        </div>
      </>
    )
}

export default ReferenceTable;