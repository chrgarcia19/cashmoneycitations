import ReferenceCheckbox from "./ReferenceCheckbox";
import {getUserReferences} from "./componentActions/actions";
import { authConfig } from '@/lib/auth';
import { getServerSession } from 'next-auth';

async function ReferenceTable(){
  const session = await getServerSession(authConfig);
  const userId = session?.user?.id ?? '';

  const references = await getUserReferences(userId);
  
    return(
        <>
        <div className="background">
          <div className='pt-20 pb-20 pr-10 pl-10'>
          <table className='table table-lg table-pin-row'>
            <thead>
              <tr className="sticky">
                <th className="border border-slate-800 text-center text-black text-xl bg-sky-400">Select</th>
                <th className="border border-slate-800 text-center text-black text-xl bg-sky-400">Reference Type</th>
                <th className="border border-slate-800 text-center text-black text-xl bg-sky-400">Reference Title</th>
                <th className="border border-slate-800 text-center text-black text-xl bg-sky-400">Contributors</th>
                <th className="border border-slate-800 text-center text-black text-xl bg-sky-400">Date Published</th>
              </tr>
            </thead>
            <tbody>
              <ReferenceCheckbox references={references}></ReferenceCheckbox>
            </tbody>
          </table>
          </div>
        </div>
      </>
    )
}

export default ReferenceTable;