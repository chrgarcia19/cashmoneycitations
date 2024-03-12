import { GetCitations } from './actions';

async function DisplayCitations({ referenceId }: any) {
  const citationList = await GetCitations(referenceId.citation);
  const citations = citationList?.map((doc) => {
    const citation = JSON.parse(JSON.stringify(doc));
    return citation;
  })

  return (
    <>
      
        {citations?.map((citation) => (
          <div key={citation.id}>
            {citation.CitationData}
            <div className='flex flex-row bg-green-200 rounded-lg p-4 m-4'>
            <div className='mt-3'>{citation.name}</div>
            {/* <button onClick={() => copyToClipboard(citationData.van)}> */}
            {/* <img className='copy-icon' src="/copy-icon.svg" alt="Copy" width="30" height="30" />
            </button> */}
            </div>
          </div>
        ))}
      
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