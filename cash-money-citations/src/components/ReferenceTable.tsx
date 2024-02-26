import dbConnect from "@/utils/dbConnect";
import Reference from "@/models/Reference";
import ReferenceCheckbox from "./ReferenceCheckbox";

async function getReferences() {
    await dbConnect();
  
    const result = await Reference.find({});
    const references = result.map((doc) => {
      const reference = JSON.parse(JSON.stringify(doc));
      return reference;
    });
  
    return references;
}

async function ReferenceTable(){
    const references = await getReferences();

    return(
        <>
        <div className='mt-10'>
        <table className='table table-lg table-pin-rows table-pin-cols'>
          <thead>
            <tr>
              <th className="border border-slate-800 text-center text-black text-xl bg-sky-400">Select</th>
              <th className="border border-slate-800 text-center text-black text-xl bg-sky-400">Reference Type</th>
              <th className="border border-slate-800 text-center text-black text-xl bg-sky-400">Reference Title</th>
              <th className="border border-slate-800 text-center text-black text-xl bg-sky-400">Contributors</th>
              <th className="border border-slate-800 text-center text-black text-xl bg-sky-400">Publisher</th>
              <th className="border border-slate-800 text-center text-black text-xl bg-sky-400">Year</th>
            </tr>
          </thead>
          <tbody>
            <ReferenceCheckbox references={references}></ReferenceCheckbox>
          </tbody>
        </table>
        </div>
        </>
      )
}

export default ReferenceTable;