import dbConnect from "@/utils/dbConnect";
import Reference from "@/models/Reference";

export default async function getReferences() {
    await dbConnect();

    const result = await Reference.find({});
    const references = result.map((doc) => {
      const reference = JSON.parse(JSON.stringify(doc));
      return reference;
    });

    return references;
}