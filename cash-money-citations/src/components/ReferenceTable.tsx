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
              <th className="border border-slate-800 text-center text-black text-xl bg-green-600">Select</th>
              <th className="border border-slate-800 text-center text-black text-xl bg-green-600">Reference Type</th>
              <th className="border border-slate-800 text-center text-black text-xl bg-green-600">Reference Title</th>
              <th className="border border-slate-800 text-center text-black text-xl bg-green-600">Contributors</th>
              <th className="border border-slate-800 text-center text-black text-xl bg-green-600">Publisher</th>
              <th className="border border-slate-800 text-center text-black text-xl bg-green-600">Year</th>
            </tr>
          </thead>
          <tbody>
            {references.map((reference) => (
              <>
              <tr className="hover:bg-zinc-500" key={reference._id}>
                <td className="border border-slate-600"><ReferenceCheckbox refID={reference._id}/></td>
                <td className="border border-slate-600 text-center">{reference.type}</td>
                <td className="border border-slate-600 text-center">{reference.title}</td>   
                <td className="border border-slate-600 text-center">          
                {reference.contributors.map((contributor: any) => {
                  return(
                    <div key={contributor._id}>{contributor.contributorFirstName} {contributor.contributorMiddleI} {contributor.contributorLastName}</div>
                  )
                })}
                </td>
                <td className="border border-slate-600 text-center">{reference.publisher}</td>
                <td className="border border-slate-600 text-center">{reference.year}</td>
                </tr>
              </>  
            ))}
          </tbody>
        </table>
        </div>
        </>
      )
}

export default ReferenceTable;