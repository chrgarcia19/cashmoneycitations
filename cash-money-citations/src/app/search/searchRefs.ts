"use server"
import CSLBibModel from "@/models/CSLBibTex";
import dbConnect from "../../utils/dbConnect";

export default async function searchRefs(str: string) {
    await dbConnect();
    let searchTerm = `${str}`;

    const convertToLowerCase = (text: string) => {
        const convertedText = text.replace(/[A-Z]/g, (match) =>
            match.toLowerCase()
        );
        return convertedText;
    };
    const searchTermLower = convertToLowerCase(searchTerm);

    const convertFirstLetterToCapital = (text: string) => {
        const convertedText = text.replace(/(^\w{1})|(\.\s*\w{1})/g, (match) =>
            match.toUpperCase()
        );
        return convertedText;
    };
    const searchTermFirst = convertFirstLetterToCapital(searchTerm);

    try {
        let references = await CSLBibModel.find({
            $or: [
                { "title.0": { $regex: searchTermLower } },
                { "title.0": { $regex: searchTerm } },
                { "title.0": { $regex: searchTermFirst } },
            ],
        });
        return JSON.stringify(references);
    } catch (error) {
        console.error("Error searching references:", error);
        throw new Error("An error occurred while searching references.");
    }
}