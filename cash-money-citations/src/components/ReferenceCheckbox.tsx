"use client"

import { References } from "@/models/Reference";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";

interface IProps {
    references: any;
}

const fetcher = (url: string) =>
  fetch(url)
    .then((res) => res.json())
    .then((json) => json.data);

export const Checkbox = ({ references }: IProps) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const id = searchParams.get('id');

    const handleDelete = async () => {
        try {
          await fetch(`/api/references/${id}`, {
            method: "Delete",
          });
          router.push('/');
          router.refresh();
        } catch (error) {
        }
    };

    const handleDeleteMany = async (refIDs: string[]) => {
        for (let i = 0; i < refIDs.length; i++){
            try {
                await fetch(`/api/references/${refIDs[i]}`, {
                    method: "Delete"
                });
                router.push('/');
                router.refresh();
            } catch (error) {
            }
        }
    }

    const {
        error,
        isLoading,
      } = useSWR(id ? `/api/references/${id}` : null, fetcher);

      
      if (error) return <p>Failed to load</p>;
      if (isLoading) return <p>Loading...</p>;

    const [refData, setRefData] = useState<References[]>([]);

    useEffect(() => {
        setRefData(references);
    }, [refData]);

    const [isChecked, setIsChecked] = useState(
        new Array(references.length).fill(false)
    );

    function getSelected(checked: Array<boolean>){
        let refIDs = new Array<string>();
        for (let i = 0; i < checked.length; i++){
            if (checked[i]){
                refIDs.push(refData[i]._id);
            }
        }
        
        return refIDs;
    }

    function countSelected(checked: Array<boolean>){
        let numChecked = 0;
        for (let i = 0; i < checked.length; i++){
            if (checked[i]){
                numChecked += 1;
            }
        }
        return numChecked;
    }

    const checkHandler = (position: number) => {
        const checkState = isChecked.map((reference, i) => 
            i === position ? !reference : reference
        );

        setIsChecked(checkState)
    }

    const singleMenu = (refID: string) => {
        return (
            <div className="btm-nav">
                <Link className="bg-green-300 text-green-800 hover:active" style={{display: 'grid'}} href={{ pathname: `/${refID}/edit`, query: { id: refID} } }>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 122.88 121.51" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M28.66,1.64H58.88L44.46,16.71H28.66a13.52,13.52,0,0,0-9.59,4l0,0a13.52,13.52,0,0,0-4,9.59v76.14H91.21a13.5,13.5,0,0,0,9.59-4l0,0a13.5,13.5,0,0,0,4-9.59V77.3l15.07-15.74V92.85a28.6,28.6,0,0,1-8.41,20.22l0,.05a28.58,28.58,0,0,1-20.2,8.39H11.5a11.47,11.47,0,0,1-8.1-3.37l0,0A11.52,11.52,0,0,1,0,110V30.3A28.58,28.58,0,0,1,8.41,10.09L8.46,10a28.58,28.58,0,0,1,20.2-8.4ZM73,76.47l-29.42,6,4.25-31.31L73,76.47ZM57.13,41.68,96.3.91A2.74,2.74,0,0,1,99.69.38l22.48,21.76a2.39,2.39,0,0,1-.19,3.57L82.28,67,57.13,41.68Z"/></svg>
                    <span className="btm-nav-label">Edit</span>  
                </Link>
                <Link className="bg-cyan-300 text-cyan-800 hover:active" href={{ pathname: `/${refID}/view`, query: { id: refID} } }>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 122.88 83.78" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M95.73,10.81c10.53,7.09,19.6,17.37,26.48,29.86l0.67,1.22l-0.67,1.21c-6.88,12.49-15.96,22.77-26.48,29.86 C85.46,79.88,73.8,83.78,61.44,83.78c-12.36,0-24.02-3.9-34.28-10.81C16.62,65.87,7.55,55.59,0.67,43.1L0,41.89l0.67-1.22 c6.88-12.49,15.95-22.77,26.48-29.86C37.42,3.9,49.08,0,61.44,0C73.8,0,85.45,3.9,95.73,10.81L95.73,10.81z M60.79,22.17l4.08,0.39 c-1.45,2.18-2.31,4.82-2.31,7.67c0,7.48,5.86,13.54,13.1,13.54c2.32,0,4.5-0.62,6.39-1.72c0.03,0.47,0.05,0.94,0.05,1.42 c0,11.77-9.54,21.31-21.31,21.31c-11.77,0-21.31-9.54-21.31-21.31C39.48,31.71,49.02,22.17,60.79,22.17L60.79,22.17L60.79,22.17z M109,41.89c-5.5-9.66-12.61-17.6-20.79-23.11c-8.05-5.42-17.15-8.48-26.77-8.48c-9.61,0-18.71,3.06-26.76,8.48 c-8.18,5.51-15.29,13.45-20.8,23.11c5.5,9.66,12.62,17.6,20.8,23.1c8.05,5.42,17.15,8.48,26.76,8.48c9.62,0,18.71-3.06,26.77-8.48 C96.39,59.49,103.5,51.55,109,41.89L109,41.89z"/></svg>
                    <span className="btm-nav-label">View</span>
                </Link>
                <button className="bg-red-300 text-red-800 hover:active"
                onClick={handleDelete}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 109.484 122.88" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.347,9.633h38.297V3.76c0-2.068,1.689-3.76,3.76-3.76h21.144 c2.07,0,3.76,1.691,3.76,3.76v5.874h37.83c1.293,0,2.347,1.057,2.347,2.349v11.514H0V11.982C0,10.69,1.055,9.633,2.347,9.633 L2.347,9.633z M8.69,29.605h92.921c1.937,0,3.696,1.599,3.521,3.524l-7.864,86.229c-0.174,1.926-1.59,3.521-3.523,3.521h-77.3 c-1.934,0-3.352-1.592-3.524-3.521L5.166,33.129C4.994,31.197,6.751,29.605,8.69,29.605L8.69,29.605z M69.077,42.998h9.866v65.314 h-9.866V42.998L69.077,42.998z M30.072,42.998h9.867v65.314h-9.867V42.998L30.072,42.998z M49.572,42.998h9.869v65.314h-9.869 V42.998L49.572,42.998z"/></svg>
                    <span className="btm-nav-label">Delete</span>
                </button>
                <button className="bg-orange-300 text-orange-800 hover:active">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 122.88 121.93" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.33,0.02h29.41v20.6H20.36v80.7h82.1V84.79h20.36v37.14H0V0.02H8.33L8.33,0.02z M122.88,0H53.3l23.74,23.18l-33.51,33.5 l21.22,21.22L98.26,44.4l24.62,24.11V0L122.88,0z"/></svg>
                    <span className="btm-nav-label">Export</span>
                </button>
          </div>
        )
    }

    const multiMenu = (refIDs: string[]) => {
        return (
            <div className="btm-nav">
                <button className="bg-red-300 text-red-800 hover:active"
                onClick={() => handleDeleteMany(refIDs)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 109.484 122.88" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.347,9.633h38.297V3.76c0-2.068,1.689-3.76,3.76-3.76h21.144 c2.07,0,3.76,1.691,3.76,3.76v5.874h37.83c1.293,0,2.347,1.057,2.347,2.349v11.514H0V11.982C0,10.69,1.055,9.633,2.347,9.633 L2.347,9.633z M8.69,29.605h92.921c1.937,0,3.696,1.599,3.521,3.524l-7.864,86.229c-0.174,1.926-1.59,3.521-3.523,3.521h-77.3 c-1.934,0-3.352-1.592-3.524-3.521L5.166,33.129C4.994,31.197,6.751,29.605,8.69,29.605L8.69,29.605z M69.077,42.998h9.866v65.314 h-9.866V42.998L69.077,42.998z M30.072,42.998h9.867v65.314h-9.867V42.998L30.072,42.998z M49.572,42.998h9.869v65.314h-9.869 V42.998L49.572,42.998z"/></svg>
                    <span className="btm-nav-label">Delete All Selected</span>
                </button>
                <button className="bg-orange-300 text-orange-800 hover:active">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 122.88 121.93" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.33,0.02h29.41v20.6H20.36v80.7h82.1V84.79h20.36v37.14H0V0.02H8.33L8.33,0.02z M122.88,0H53.3l23.74,23.18l-33.51,33.5 l21.22,21.22L98.26,44.4l24.62,24.11V0L122.88,0z"/></svg>
                    <span className="btm-nav-label">Export All Selected</span>
                </button>
          </div>
        )
    }

    return (
        <>
            {references.map((reference: any, index: any) => (
              <>
              <tr className="hover:bg-zinc-500" key={index}>
                <td className="border border-slate-600">
                <input 
                    type="checkbox"
                    className="checkbox"
                    name={`${reference.title}`}
                    id={`ref-${index}`}
                    checked={isChecked[index]}
                    onChange={() => checkHandler(index)}
                />
                {countSelected(isChecked) == 1 && isChecked[index] ? singleMenu(reference._id) : ""}
                {countSelected(isChecked) > 1 ? multiMenu(getSelected(isChecked)) : ""}
                {countSelected(isChecked) == 0 ? "" : ""}
                </td>
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
        </>
    )    
}

export default Checkbox;

