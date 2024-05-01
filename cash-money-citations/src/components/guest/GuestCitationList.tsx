// import { useEffect, useState } from 'react';
// import React from 'react';
// import { DeleteCitation, GetRefCSLJson } from '../../app/displayCitation/actions';
// import parse, { domToReact } from 'html-react-parser';
// import ReactDOMServer from 'react-dom/server';
// import { htmlToText } from 'html-to-text';

// export function CitationList({ styleChoice, localeChoice, citations, setCitations }: any) {
//   const [newCitations, setNewCitations] = useState<any[]>([]);

//   useEffect(() => {
//     if (styleChoice && localeChoice) {
//       fetchCitations();
//     }
//   }, [styleChoice, localeChoice]);

//   const options = {
//     replace({ attribs, children }: any) {
//       if (!attribs) {
//         return;
//       }

//       if (attribs.class === 'csl-entry') {
//         const citation = {
//           _id: attribs["data-csl-entry-id"],
//           data: <div>{domToReact(children, options)}</div>
//         };
//         newCitations.push(citation);
//         return citation;
//       }
//     },
//   };

//   const fetchCitations = async () => {
//     // Retrieve citations directly from local storage
//     const storedReferences = localStorage.getItem('references');
//     let allReferences = [];
//     if (storedReferences) {
//       allReferences = JSON.parse(storedReferences);
//     }

//     const allCitations = await Promise.all(allReferences.map(GetRefCSLJson));
//     const citation = new Cite(allCitations);

//     const templateName = styleChoice;
//     const localeName = localeChoice;

//     const styleData = await GetCSLStyle(templateName);
//     const localeData = await GetCSLLocale(localeName);

//     const config = plugins.config.get('@csl');

//     config.templates.add(templateName, styleData?.cslData);
//     config.locales.add(localeName, localeData?.localeData);

//     const customCitation = citation.format('bibliography', {
//       format: 'html',
//       template: templateName,
//       lang: localeName,
//     });

//     parse(customCitation, options);

//     const updatedCitations = newCitations.map((newCitation: any) => {
//       const matchingCitation = citation.data.find((dataCitation: any) => dataCitation.id === newCitation._id);

//       if (matchingCitation) {
//         return {
//           ...newCitation,
//           refId: matchingCitation.refId
//         };
//       }

//       return newCitation;
//     });

//     setCitations(updatedCitations);
//   };

//   const handleDelete = async (citationId: any) => {
//     const citationToDelete = citations.find((citation: any) => citation._id === citationId);

//     const updatedCitations = citations.filter((citation: any) => citation._id !== citationId);
//     setCitations(updatedCitations);

//     if (citationToDelete) {
//       const updatedReferences = allReferences.filter((reference: any) => reference.id !== citationToDelete.refId);
//       localStorage.setItem('references', JSON.stringify(updatedReferences));
//     }
//   };

//   return (
//     <>
//       {citations?.map((citation: any, index: any) => (
//         <tr key={citation._id || index} className={`hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'}`}>
//           <td className="px-6 py- text-center text-sm">
//             {citation.data}
//           </td>
//           <td className="px-6 py-4 text-center">
//             <CopyToClipboard citationData={citation.data} />
//             <button onClick={() => handleDelete(citation._id)}>
//               Remove
//             </button> 
//           </td>
//         </tr>
//       ))}
//     </>
//   );
// }

// const convertReactElementToPlainText = (reactElement: any) => {
//   const htmlString = ReactDOMServer.renderToStaticMarkup(reactElement);
//   const plainText = htmlToText(htmlString);
//   return plainText;
// };

// export function CopyToClipboard(citationData: any) {
//   const copyToClipboard = (text: string) => {
//     navigator.clipboard.writeText(text).then(() => {
//       alert('Copied to clipboard!');
//     }).catch(err => {
//       console.error('Failed to copy: ', err);
//     });
//   };

//   return (
//     <button onClick={() => copyToClipboard(convertReactElementToPlainText(citationData.citationData))}>
//       <img className='copy-icon' src="/copy-icon.svg" alt="Copy" width="30" height="30" />
//     </button> 
//   );
// }
