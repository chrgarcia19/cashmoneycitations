import Link from "next/link";
import dbConnect from "../utils/dbConnect";
import Reference, { References } from "../models/Reference";
import { GetServerSideProps } from "next";

type Props = {
  references: References[];
};

const Index = ({ references }: Props) => {
  return (
    <>
      {references.map((reference) => (
        <div key={reference._id}>
          <div className="card">
            <img src={reference.image_url} />
            <h5 className="pet-name">{reference.title}</h5>
            <div className="main-content">
              <p className="pet-name">{reference.title}</p>
              <p className="owner">Type: {reference.type}</p>

              {/* Extra Pet Info: Year and Publisher */}
              <div className="likes info">
                <p className="label">Year</p>
                {reference.year}
              </div>
              <div className="dislikes info">
                <p className="label">Publisher</p>
                <ul>
                  {reference.publisher}
                </ul>
              </div>
              <div className="btn-container">
                <Link href={{ pathname: "/[id]/edit", query: { id: reference._id } }}>
                  <button className="btn edit">Edit</button>
                </Link>
                <Link href={{ pathname: "/[id]", query: { id: reference._id } }}>
                  <button className="btn view">View</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

/* Retrieves pet(s) data from mongodb database */
export const getServerSideProps: GetServerSideProps<Props> = async () => {
  await dbConnect();

  /* find all the data in our database */
  const result = await Reference.find({});

  /* Ensures all objectIds and nested objectIds are serialized as JSON data */
  const references = result.map((doc) => {
    const reference = JSON.parse(JSON.stringify(doc));
    return reference;
  });

  return { props: { references: references } };
};

export default Index;
