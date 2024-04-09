"use client"

import { CSLBibInterface } from "@/models/CSLBibTex";
import { Tag } from "@/models/Tag";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
const Cite = require('citation-js')
require('@citation-js/plugin-bibtex')
const { plugins } = require('@citation-js/core')
const config = plugins.config.get('@bibtex')

interface IProps {
    references: any;
}

function monthConversion(month_num: string) {
    switch(month_num){
        case "0":
            return "January";
        case "1":
            return "February";
        case "2":
            return "March"; 
        case "3":
            return "April";
        case "4":
            return "May";
        case "5":
            return "June";
        case "6":
            return "July";
        case "7":
            return "August";
        case "8":
            return "September";
        case "9":
            return "October";
        case "10":
            return "November";
        case "11":
            return "December";   
        default:
            return (month_num + 1);     
    }
}

export const Checkbox = ({ references }: IProps) => {
    const router = useRouter();

    const handleDelete = async (refID: string) => {
        try {
          await fetch(`/api/references/${refID}`, {
            method: "Delete",
          });
          router.push('/reference-table');
          router.refresh();
        } catch (error) {
        }
    };

    async function exportSingleCitation(refId: string) {
        // Call to server action to create citations & save in DB
        router.push(`/displayCitation?citation=${refId}`)
    }

    async function exportMultipleCitation(refIds: string[]) {
        // Call to server action to create citations & save in DB
        router.push(`/displayCitation?citation=${refIds}`)
    }

    const handleDeleteMany = async (refIDs: string[]) => {
        for (let i = 0; i < refIDs.length; i++){
            try {
                await fetch(`/api/references/${refIDs[i]}`, {
                    method: "Delete"
                });
            } catch (error) {
            }
        }
        router.push('/reference-table');
        router.refresh();
    }

    const [refData, setRefData] = useState<CSLBibInterface[]>([]);

    useEffect(() => {
        setRefData(references);
    }, [refData]);

    const [isChecked, setIsChecked] = useState(
        new Array(references.length).fill(false)
    );
    const [isCheckAll, setIsCheckAll] = useState(false);

    function getSelectedID(checked: Array<boolean>){
        let refIDs = new Array<string>();
        for (let i = 0; i < checked.length; i++){
            if (checked[i]){
                refIDs.push(refData[i]._id);
            }
        }
        
        return refIDs;
    }

    function getSelectedRef(checked: Array<boolean>){
        let refs = new Array<CSLBibInterface>();
        for (let i = 0; i < checked.length; i++){
            if (checked[i]){
                refs.push(refData[i]);
            }
        }
        
        return refs;
    }

    const handleSelectAll = (e: any) => {
        setIsCheckAll(!isCheckAll);
        setIsChecked(references.map((li: any) => li._id));
        if (isCheckAll){
            setIsChecked([]);
        }
    }

    const handleDeselectAll = () => {
        setIsCheckAll(false);
        for (let i = 0; i < isChecked.length; i++) {
            isChecked[i] = false;
        }
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


    const singleMenu = (reference: CSLBibInterface) => {
        return (
            <div className="flex justify-center items-center">
                <div className="btm-bar">
                    <Link className="bg-green-300 text-green-800 hover:active" style={{display: 'grid'}} href={{ pathname: `/${reference._id}/references/edit`, query: { id: reference._id} } }>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 122.88 121.51" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M28.66,1.64H58.88L44.46,16.71H28.66a13.52,13.52,0,0,0-9.59,4l0,0a13.52,13.52,0,0,0-4,9.59v76.14H91.21a13.5,13.5,0,0,0,9.59-4l0,0a13.5,13.5,0,0,0,4-9.59V77.3l15.07-15.74V92.85a28.6,28.6,0,0,1-8.41,20.22l0,.05a28.58,28.58,0,0,1-20.2,8.39H11.5a11.47,11.47,0,0,1-8.1-3.37l0,0A11.52,11.52,0,0,1,0,110V30.3A28.58,28.58,0,0,1,8.41,10.09L8.46,10a28.58,28.58,0,0,1,20.2-8.4ZM73,76.47l-29.42,6,4.25-31.31L73,76.47ZM57.13,41.68,96.3.91A2.74,2.74,0,0,1,99.69.38l22.48,21.76a2.39,2.39,0,0,1-.19,3.57L82.28,67,57.13,41.68Z"/></svg>
                        <span className="btm-nav-label">Edit</span>  
                    </Link>
                    <Link className="bg-cyan-300 text-cyan-800 hover:active" href={{ pathname: `/${reference._id}/references/view`, query: { id: reference._id} } }>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 122.88 83.78" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M95.73,10.81c10.53,7.09,19.6,17.37,26.48,29.86l0.67,1.22l-0.67,1.21c-6.88,12.49-15.96,22.77-26.48,29.86 C85.46,79.88,73.8,83.78,61.44,83.78c-12.36,0-24.02-3.9-34.28-10.81C16.62,65.87,7.55,55.59,0.67,43.1L0,41.89l0.67-1.22 c6.88-12.49,15.95-22.77,26.48-29.86C37.42,3.9,49.08,0,61.44,0C73.8,0,85.45,3.9,95.73,10.81L95.73,10.81z M60.79,22.17l4.08,0.39 c-1.45,2.18-2.31,4.82-2.31,7.67c0,7.48,5.86,13.54,13.1,13.54c2.32,0,4.5-0.62,6.39-1.72c0.03,0.47,0.05,0.94,0.05,1.42 c0,11.77-9.54,21.31-21.31,21.31c-11.77,0-21.31-9.54-21.31-21.31C39.48,31.71,49.02,22.17,60.79,22.17L60.79,22.17L60.79,22.17z M109,41.89c-5.5-9.66-12.61-17.6-20.79-23.11c-8.05-5.42-17.15-8.48-26.77-8.48c-9.61,0-18.71,3.06-26.76,8.48 c-8.18,5.51-15.29,13.45-20.8,23.11c5.5,9.66,12.62,17.6,20.8,23.1c8.05,5.42,17.15,8.48,26.76,8.48c9.62,0,18.71-3.06,26.77-8.48 C96.39,59.49,103.5,51.55,109,41.89L109,41.89z"/></svg>
                        <span className="btm-nav-label">View</span>
                    </Link>
                    <button className="bg-red-300 text-red-800 hover:active"
                    onClick={() => handleDelete(reference._id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 109.484 122.88" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.347,9.633h38.297V3.76c0-2.068,1.689-3.76,3.76-3.76h21.144 c2.07,0,3.76,1.691,3.76,3.76v5.874h37.83c1.293,0,2.347,1.057,2.347,2.349v11.514H0V11.982C0,10.69,1.055,9.633,2.347,9.633 L2.347,9.633z M8.69,29.605h92.921c1.937,0,3.696,1.599,3.521,3.524l-7.864,86.229c-0.174,1.926-1.59,3.521-3.523,3.521h-77.3 c-1.934,0-3.352-1.592-3.524-3.521L5.166,33.129C4.994,31.197,6.751,29.605,8.69,29.605L8.69,29.605z M69.077,42.998h9.866v65.314 h-9.866V42.998L69.077,42.998z M30.072,42.998h9.867v65.314h-9.867V42.998L30.072,42.998z M49.572,42.998h9.869v65.314h-9.869 V42.998L49.572,42.998z"/></svg>
                        <span className="btm-nav-label">Delete</span>
                    </button>
                    <button className="bg-orange-300 text-orange-800 hover:active"
                    onClick={() => exportSingleCitation(reference._id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 122.88 121.93" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.33,0.02h29.41v20.6H20.36v80.7h82.1V84.79h20.36v37.14H0V0.02H8.33L8.33,0.02z M122.88,0H53.3l23.74,23.18l-33.51,33.5 l21.22,21.22L98.26,44.4l24.62,24.11V0L122.88,0z"/></svg>
                        <span className="btm-nav-label">Export</span>
                    </button>
                    <button className="bg-indigo-300 text-indigo-800 hover:active"
                    onClick={handleSelectAll}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 122.88 120.79" stroke="currentColor"><path  strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M31.4,21.63h60.68V7.68c0-0.08-0.02-0.16-0.04-0.22c-0.03-0.07-0.08-0.14-0.13-0.19l-0.01-0.01 c-0.05-0.06-0.12-0.1-0.19-0.13c-0.07-0.03-0.15-0.04-0.23-0.04H7.68c-0.08,0-0.16,0.02-0.22,0.04C7.39,7.15,7.32,7.2,7.25,7.26 L7.23,7.28C7.19,7.33,7.15,7.39,7.12,7.46C7.09,7.53,7.08,7.6,7.08,7.68v83.8c0,0.08,0.02,0.16,0.05,0.22l0.01,0.03 c0.03,0.06,0.07,0.13,0.12,0.18c0.06,0.06,0.13,0.1,0.2,0.13l0.02,0.01c0.06,0.02,0.13,0.04,0.2,0.04h16.04V29.31 c0-1.03,0.21-2.03,0.58-2.93c0.39-0.94,0.96-1.79,1.67-2.5l0.04-0.04c0.7-0.69,1.54-1.25,2.46-1.63 C29.38,21.84,30.37,21.63,31.4,21.63L31.4,21.63z M51.99,75.95c-0.95-0.86-1.47-2.03-1.53-3.23c-0.06-1.19,0.34-2.4,1.2-3.35 c0.86-0.95,2.04-1.47,3.23-1.53c1.18-0.06,2.4,0.34,3.35,1.2l9.09,8.25l20.78-21.88c0.89-0.93,2.07-1.42,3.27-1.45 c1.19-0.03,2.4,0.4,3.33,1.28c0.93,0.89,1.42,2.07,1.45,3.27c0.03,1.19-0.4,2.4-1.28,3.33L69.84,88.19L69.59,88 c-0.58,0.28-1.21,0.43-1.85,0.46c-1.17,0.04-2.36-0.35-3.29-1.2L51.99,75.95L51.99,75.95z M99.15,21.63h16.04 c1.03,0,2.03,0.21,2.93,0.59c0.94,0.39,1.79,0.96,2.5,1.67l0.04,0.04c0.69,0.7,1.25,1.53,1.63,2.45c0.38,0.91,0.58,1.9,0.58,2.94 v83.8c0,1.04-0.21,2.03-0.58,2.93c-0.39,0.94-0.96,1.79-1.67,2.5c-0.71,0.71-1.55,1.28-2.5,1.67c-0.91,0.38-1.9,0.59-2.93,0.59 H31.4c-1.03,0-2.02-0.21-2.93-0.58c-0.94-0.39-1.79-0.96-2.5-1.67c-0.71-0.71-1.28-1.56-1.67-2.5c-0.38-0.91-0.58-1.9-0.58-2.93 V99.16H7.68c-1.03,0-2.03-0.21-2.93-0.59c-0.94-0.39-1.79-0.96-2.5-1.67c-0.71-0.71-1.28-1.56-1.67-2.5C0.21,93.5,0,92.51,0,91.48 V7.68c0-1.04,0.21-2.03,0.58-2.93c0.39-0.94,0.96-1.79,1.67-2.5c0.71-0.71,1.55-1.28,2.5-1.67C5.66,0.21,6.65,0,7.68,0h83.79 c1.04,0,2.03,0.21,2.93,0.58c0.94,0.39,1.79,0.96,2.5,1.67c1.4,1.4,2.26,3.31,2.26,5.43V21.63L99.15,21.63z M115.2,28.7H31.4 c-0.08,0-0.15,0.02-0.22,0.04c-0.08,0.03-0.15,0.08-0.2,0.14l-0.01,0.01c-0.06,0.05-0.1,0.12-0.13,0.19 c-0.03,0.07-0.04,0.14-0.04,0.22v83.8c0,0.08,0.02,0.16,0.04,0.22c0.03,0.07,0.08,0.14,0.14,0.2l0.02,0.02 c0.05,0.05,0.12,0.09,0.18,0.11c0.07,0.03,0.14,0.04,0.22,0.04h83.79c0.08,0,0.16-0.02,0.22-0.04l0.02-0.01 c0.07-0.03,0.13-0.07,0.18-0.13c0.05-0.06,0.1-0.12,0.13-0.19l0.01-0.02c0.02-0.06,0.03-0.13,0.03-0.21v-83.8 c0-0.08-0.02-0.15-0.04-0.22l-0.01-0.02c-0.03-0.06-0.07-0.12-0.12-0.17c-0.06-0.06-0.13-0.11-0.2-0.14 C115.35,28.72,115.28,28.7,115.2,28.7L115.2,28.7z"/></svg>
                        <span className="btm-nav-label">Select All</span>
                    </button>
                </div>
          </div>
        )
    }

    const multiMenu = (refIDs: string[], refs: CSLBibInterface[]) => {
        return (
            <div className="btm-bar">
                <button className="bg-red-300 text-red-800 hover:active"
                onClick={() => handleDeleteMany(refIDs)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 109.484 122.88" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.347,9.633h38.297V3.76c0-2.068,1.689-3.76,3.76-3.76h21.144 c2.07,0,3.76,1.691,3.76,3.76v5.874h37.83c1.293,0,2.347,1.057,2.347,2.349v11.514H0V11.982C0,10.69,1.055,9.633,2.347,9.633 L2.347,9.633z M8.69,29.605h92.921c1.937,0,3.696,1.599,3.521,3.524l-7.864,86.229c-0.174,1.926-1.59,3.521-3.523,3.521h-77.3 c-1.934,0-3.352-1.592-3.524-3.521L5.166,33.129C4.994,31.197,6.751,29.605,8.69,29.605L8.69,29.605z M69.077,42.998h9.866v65.314 h-9.866V42.998L69.077,42.998z M30.072,42.998h9.867v65.314h-9.867V42.998L30.072,42.998z M49.572,42.998h9.869v65.314h-9.869 V42.998L49.572,42.998z"/></svg>
                    <span className="btm-nav-label">Delete All Selected</span>
                </button>
                <button className="bg-orange-300 text-orange-800 hover:active"
                onClick={() => exportMultipleCitation(refIDs)}    >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 122.88 121.93" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.33,0.02h29.41v20.6H20.36v80.7h82.1V84.79h20.36v37.14H0V0.02H8.33L8.33,0.02z M122.88,0H53.3l23.74,23.18l-33.51,33.5 l21.22,21.22L98.26,44.4l24.62,24.11V0L122.88,0z"/></svg>
                    <span className="btm-nav-label">Export All Selected</span>
                </button>
                <button className="bg-indigo-300 text-indigo-800 hover:active"
                onClick={handleDeselectAll}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 122.88 120.79" stroke="currentColor"><path  strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M31.4,21.63h60.68V7.68c0-0.08-0.02-0.16-0.04-0.22c-0.03-0.07-0.08-0.14-0.13-0.19l-0.01-0.01 c-0.05-0.06-0.12-0.1-0.19-0.13c-0.07-0.03-0.15-0.04-0.23-0.04H7.68c-0.08,0-0.16,0.02-0.22,0.04C7.39,7.15,7.32,7.2,7.25,7.26 L7.23,7.28C7.19,7.33,7.15,7.39,7.12,7.46C7.09,7.53,7.08,7.6,7.08,7.68v83.8c0,0.08,0.02,0.16,0.05,0.22l0.01,0.03 c0.03,0.06,0.07,0.13,0.12,0.18c0.06,0.06,0.13,0.1,0.2,0.13l0.02,0.01c0.06,0.02,0.13,0.04,0.2,0.04h16.04V29.31 c0-1.03,0.21-2.03,0.58-2.93c0.39-0.94,0.96-1.79,1.67-2.5l0.04-0.04c0.7-0.69,1.54-1.25,2.46-1.63 C29.38,21.84,30.37,21.63,31.4,21.63L31.4,21.63z M51.99,75.95c-0.95-0.86-1.47-2.03-1.53-3.23c-0.06-1.19,0.34-2.4,1.2-3.35 c0.86-0.95,2.04-1.47,3.23-1.53c1.18-0.06,2.4,0.34,3.35,1.2l9.09,8.25l20.78-21.88c0.89-0.93,2.07-1.42,3.27-1.45 c1.19-0.03,2.4,0.4,3.33,1.28c0.93,0.89,1.42,2.07,1.45,3.27c0.03,1.19-0.4,2.4-1.28,3.33L69.84,88.19L69.59,88 c-0.58,0.28-1.21,0.43-1.85,0.46c-1.17,0.04-2.36-0.35-3.29-1.2L51.99,75.95L51.99,75.95z M99.15,21.63h16.04 c1.03,0,2.03,0.21,2.93,0.59c0.94,0.39,1.79,0.96,2.5,1.67l0.04,0.04c0.69,0.7,1.25,1.53,1.63,2.45c0.38,0.91,0.58,1.9,0.58,2.94 v83.8c0,1.04-0.21,2.03-0.58,2.93c-0.39,0.94-0.96,1.79-1.67,2.5c-0.71,0.71-1.55,1.28-2.5,1.67c-0.91,0.38-1.9,0.59-2.93,0.59 H31.4c-1.03,0-2.02-0.21-2.93-0.58c-0.94-0.39-1.79-0.96-2.5-1.67c-0.71-0.71-1.28-1.56-1.67-2.5c-0.38-0.91-0.58-1.9-0.58-2.93 V99.16H7.68c-1.03,0-2.03-0.21-2.93-0.59c-0.94-0.39-1.79-0.96-2.5-1.67c-0.71-0.71-1.28-1.56-1.67-2.5C0.21,93.5,0,92.51,0,91.48 V7.68c0-1.04,0.21-2.03,0.58-2.93c0.39-0.94,0.96-1.79,1.67-2.5c0.71-0.71,1.55-1.28,2.5-1.67C5.66,0.21,6.65,0,7.68,0h83.79 c1.04,0,2.03,0.21,2.93,0.58c0.94,0.39,1.79,0.96,2.5,1.67c1.4,1.4,2.26,3.31,2.26,5.43V21.63L99.15,21.63z M115.2,28.7H31.4 c-0.08,0-0.15,0.02-0.22,0.04c-0.08,0.03-0.15,0.08-0.2,0.14l-0.01,0.01c-0.06,0.05-0.1,0.12-0.13,0.19 c-0.03,0.07-0.04,0.14-0.04,0.22v83.8c0,0.08,0.02,0.16,0.04,0.22c0.03,0.07,0.08,0.14,0.14,0.2l0.02,0.02 c0.05,0.05,0.12,0.09,0.18,0.11c0.07,0.03,0.14,0.04,0.22,0.04h83.79c0.08,0,0.16-0.02,0.22-0.04l0.02-0.01 c0.07-0.03,0.13-0.07,0.18-0.13c0.05-0.06,0.1-0.12,0.13-0.19l0.01-0.02c0.02-0.06,0.03-0.13,0.03-0.21v-83.8 c0-0.08-0.02-0.15-0.04-0.22l-0.01-0.02c-0.03-0.06-0.07-0.12-0.12-0.17c-0.06-0.06-0.13-0.11-0.2-0.14 C115.35,28.72,115.28,28.7,115.2,28.7L115.2,28.7z"/></svg>
                    <span className="btm-nav-label">Deselect All</span>
                </button>
          </div>
        )
    }

    return (
        <>
            {references.map((reference: any, index: any) => (
              <tr className="bg-sky-100 hover:bg-zinc-400" key={index}>
                <td className="border border-slate-600">
                <input 
                    type="checkbox"
                    className="checkbox"
                    name={`${reference.title}`}
                    id={`ref-${index}`}
                    checked={isChecked[index]}
                    onChange={() => checkHandler(index)}
                />
                {countSelected(isChecked) == 1 && isChecked[index] ? singleMenu(reference) : ""}
                {countSelected(isChecked) > 1 ? multiMenu(getSelectedID(isChecked), getSelectedRef(isChecked)) : ""}
                {countSelected(isChecked) == 0 ? "" : ""}
                </td>
                <td className="border border-slate-600 text-center">
                    {reference.tags.map((tag: Tag) => (
                        <div key={tag._id} className={`badge badge-lg bg-teal-200 me-2`}>
                            {tag.tagName}
                        </div>
                    ))}
                </td>
                <td className="border border-slate-600 text-center">{monthConversion(reference.monthPublished)} {reference.dayPublished}, {reference.yearPublished}</td>
                <td className="border border-slate-600 text-center">{reference.title}</td>   
                <td className="border border-slate-600 text-center">
                    {reference.contributors.slice(0, 3).map((contributor: any) => {
                       return <div key={contributor._id}>{contributor.given}</div>
                    })}
                    {reference.contributors.length > 3 ?
                        <div>And {reference.contributors.length - 3} more</div> 
                        : ""
                    }
                </td>
                <td className="border border-slate-600 text-center">{reference.type}</td>

                </tr>
            ))}
        </>
    )    
}

export default Checkbox;