import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import dbConnect from "../../utils/dbConnect";
import Reference, { References } from "../../models/Reference";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { ParsedUrlQuery } from "querystring";

interface Params extends ParsedUrlQuery {
  id: string;
}

type Props = {
  reference: References;
};

/* Allows you to view pet card info and delete pet card*/
const ReferencePage = ({ reference }: Props) => {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const handleDelete = async () => {
    const referenceID = router.query.id;

    try {
      await fetch(`/api/references/${referenceID}`, {
        method: "Delete",
      });
      router.push("/");
    } catch (error) {
      setMessage("Failed to delete the reference.");
    }
  };

  return (
    <div key={reference._id}>
      <div className="card">
        <img src={reference.image_url} />
        <h5 className="pet-name">{reference.title}</h5>
        <div className="main-content">
          <p className="pet-name">{reference.title}</p>
          <p className="owner">Type: {reference.type}</p>
          {/* Extra Pet Info: Likes and Dislikes */}
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
            <Link href={`/${reference._id}/edit`}>
              <button className="btn edit">Edit</button>
            </Link>
            <button className="btn delete" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<Props, Params> = async ({
  params,
}: GetServerSidePropsContext) => {
  await dbConnect();

  if (!params?.id) {
    return {
      notFound: true,
    };
  }

  const reference = await Reference.findById(params.id).lean();

  if (!reference) {
    return {
      notFound: true,
    };
  }

  /* Ensures all objectIds and nested objectIds are serialized as JSON data */
  const serializedReference = JSON.parse(JSON.stringify(reference));

  return {
    props: {
      reference: serializedReference,
    },
  };
};

export default ReferencePage;
