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
        <div className='overflow-x-auto'>
        <table className='table-lg border'>
          <thead>
            <tr>
              <th className="border border-slate-600 text-center">Select</th>
              <th className="border border-slate-600 text-center">Reference Type</th>
              <th className="border border-slate-600 text-center">Reference Title</th>
              <th className="border border-slate-600 text-center">Contributors</th>
              <th className="border border-slate-600 text-center">Publisher</th>
              <th className="border border-slate-600 text-center">DOI</th>
            </tr>
          </thead>
          <tbody>
            {references.map((reference) => (
              <>
                <tr className="hover" key={reference._id}>
                  <td className="border border-slate-600"><input type='checkbox' className='checkbox' /></td>
                  <td className="border border-slate-600 text-center">{reference.type}</td>
                  <td className="border border-slate-600 text-center">{reference.title}</td>
                  <td className="border border-slate-600 text-center">Placeholder</td>
                  <td className="border border-slate-600 text-center">{reference.publisher}</td>
                  <td className="border border-slate-600 text-center">{reference.doi}</td>
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