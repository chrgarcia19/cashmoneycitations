'use client'

import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import Link from "next/link";


const fetcher = (url: string) =>
  fetch(url)
    .then((res) => res.json())
    .then((json) => json.data);

    const ReferencePage = () => {
      const searchParams = useSearchParams();
      const router = useRouter();
      const id = searchParams.get('id');

      const handleDelete = async () => {

            try {
              await fetch(`/api/references/${id}`, {
                method: "Delete",
              });
              router.push('/');
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

      return (
        <>

      <div key={reference._id}>
      <div className="card">
        <img src={reference.image_url} alt="Reference Cover" />
        <h5 className="pet-name">{reference.title}</h5>
        <div className="main-content">
          <p className="pet-name">{reference.title}</p>
          <p className="owner">Type: {reference.type}</p>

          <div className="likes info">
            <p className="label">Year</p>
            <ul>
              {reference.year}
            </ul>
          </div>
          <div className="dislikes info">
            <p className="label">Publisher</p>
            <ul>
              {reference.publisher}
            </ul>
          </div>

          <div className="btn-container">
            <Link href={{ pathname: `/${reference._id}/edit`, query: { id: reference._id } }}>
              <button className="btn edit">Edit</button>
            </Link>
            <button className="btn delete" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    
    </>
      )
    }

    export default ReferencePage

