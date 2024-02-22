"use client"
import Reference from "@/models/Reference";
import dbConnect from "@/utils/dbConnect";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";



const ViewReference = () => {
    const fetcher = (url: string) =>
    fetch(url)
        .then((res) => res.json())
        .then((json) => json.data);

    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const router = useRouter();

    const handleDelete = async () => {
        try {
          await fetch(`/api/references/${reference._id}`, {
            method: "Delete",
          });
          router.push('/');
          router.refresh();
        } catch (error) {
        }
    };

    const {
        data: reference,
        error,
        isLoading,
      } = useSWR(id ? `/api/references/${id}` : null, fetcher);

      
      if (error) return <p>Failed to load</p>;
      if (isLoading) return <p>Loading...</p>;
      if (!reference) return null;
      
    return(
        <>
            <div className="bg-green-200 p-4 mx-16 space-y-4"> 
                <span className="block h-12 rounded-lg ">Reference Type: {reference.type}</span>
                <span className="block h-12 rounded-lg">Title: {reference.title}</span>
                <span className="block h-12 rounded-lg">Contributors: {reference.contributors.map((contributor: any) => (
                    <span key={contributor._id}>{contributor.contributorFirstName} {contributor.contributorMiddleI} {contributor.contributorLastName}<br></br></span>
                ))}</span>
                <span className="block h-12 rounded-lg">Publisher: {reference.publisher}</span>
                <span className="block h-12 rounded-lg">Month: {reference.month}</span>
                <span className="block h-12 rounded-lg">Year: {reference.year}</span>
                <span>
                    <button className="bg-cyan-300 text-cyan-800 hover:active">
                        <span><Link href={{ pathname: `/${reference._id}/edit`, query: { id: reference._id} } }>Edit</Link></span>
                    </button>
                    <button className="bg-red-300 text-red-800 hover:active"
                        onClick={handleDelete}>
                        <span>Delete</span>
                    </button>
                    <button className="bg-orange-300 text-orange-800 hover:active">
                        <span>Export</span>
                    </button>
                </span>
            </div> 
            
            
        </> 
    )
    
}

export default ViewReference;