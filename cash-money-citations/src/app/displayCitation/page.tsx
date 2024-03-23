import { GetCitations } from './actions';
import { CopyToClipboard, CitationChoice, DeleteCitationDisplay } from './CitationDisplay';

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
                <td className="px-6 py-4 text-center text-sm">
                  {citation.style}
                </td>
                <td className="px-6 py- text-center text-sm">
                  {citation.CitationData}
                </td>
                <td className="px-6 py-4 text-center">
                  <CopyToClipboard citationData={citation.CitationData} />
                  <DeleteCitationDisplay citationId={citation._id} />
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
      <CitationChoice referenceId={searchParams} />
    </div>
  )
};