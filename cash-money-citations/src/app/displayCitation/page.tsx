import { GetCitations } from './actions';
import CopyToClipboard from './CitationDisplay';

async function DisplayCitations({ referenceId }: any) {
  const citationList = await GetCitations(referenceId.citation);
  const citations = citationList?.map((doc) => {
    const citation = JSON.parse(JSON.stringify(doc));
    return citation;
  })

  return (
    <>
      <div className='px-20'>
        <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
          <thead className='bg-gray-50'>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Citation Style</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Citation</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Copy</th>
            </tr>
            
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {citations?.map((citation, index) => (
              <tr key={citation.id} className={`hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'}`}>
                <td className="px-6 py-4 text-center text-s">
                  {citation.style}
                </td>
                <td className="px-6 py- text-center text-xs">
                  {citation.CitationData}
                </td>
                <td className="px-6 py-4 text-center">
                  <CopyToClipboard citationData={citation.CitationData} />

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
    </>
  )

}


export default function citationDisplay({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { [key: string]: string | string | undefined }
}){
  
  return (
    <div className='flex flex-row items-start w-screen'>
      <DisplayCitations referenceId={searchParams} />
    </div>
  )
};
    //  <div className='flex flex-row bg-green-200 rounded-lg p-4 m-4'>
    //     <div className='mt-3'>Vancouver Citation: {citationData.van}</div>
    //     <button onClick={() => copyToClipboard(citationData.van)}>
    //     <img className='copy-icon' src="/copy-icon.svg" alt="Copy" width="30" height="30" />
    //     </button>
    //   </div>
    //   <div className='flex flex-row bg-green-200 rounded-lg p-4 m-4'>
    //     <p className='mt-3'>APA Citation: {citationData.apa}</p>
    //     <button onClick={() => copyToClipboard(citationData.apa)}>
    //     <img className='copy-icon' src="/copy-icon.svg" alt="Copy" width="30" height="30" />
    //     </button>
    //   </div>
    //   <div className='flex flex-row bg-green-200 rounded-lg p-4 m-4'>
    //     <p className='mt-3'>BibTex: {citationData.bibtex}</p>
    //     <button onClick={() => copyToClipboard(citationData.bibtex)}>
    //     <img className='copy-icon' src="/copy-icon.svg" alt="Copy" width="30" height="30" />
    //     </button>
    //   </div>