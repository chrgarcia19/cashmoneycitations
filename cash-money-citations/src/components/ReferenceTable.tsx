import dbConnect from "@/utils/dbConnect";
import Reference from "@/models/Reference";

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
        <br>
        </br>
        <div className='relative flex mt-10 overflow-x-auto'>
        <table className='table-auto w-full text-lg text-center'>
          <thead>
            <tr>
              <th className="px-8 py-4 border border-slate-600 text-center bg-newdollagreen">Select</th>
              <th className="px-8 py-4 border border-slate-600 text-center bg-newdollagreen">Reference Type</th>
              <th className="px-8 py-4 border border-slate-600 text-center bg-newdollagreen">Reference Title</th>
              <th className="px-8 py-4 border border-slate-600 text-center bg-newdollagreen">Contributors</th>
              <th className="px-8 py-4 border border-slate-600 text-center bg-newdollagreen">Publisher</th>
              <th className="px-8 py-4 border border-slate-600 text-center bg-newdollagreen">DOI</th>
            </tr>
          </thead>
          <tbody>
            {references.map((reference) => (
              <>
              <tr className="hover:bg-zinc-500" key={reference._id}>
                <td className="px-8 py-4 border border-slate-600"><input type='checkbox' className='rounded' /></td>
                <td className="px-8 py-4 border border-slate-600 text-center">{reference.type}</td>
                <td className="px-8 py-4 border border-slate-600 text-center">{reference.title}</td>   
                <td className="px-8 py-4 border border-slate-600 text-center">          
                {reference.contributors.map((contributor: any) => {
                  return(
                    <div key={contributor._id}>{contributor.contributorFirstName} {contributor.contributorMiddleI} {contributor.contributorLastName}</div>
                  )
                })}
                </td>
                <td className="px-8 py-4 border border-slate-600 text-center">{reference.publisher}</td>
                <td className="px-8 py-4 border border-slate-600 text-center">{reference.doi}</td>
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