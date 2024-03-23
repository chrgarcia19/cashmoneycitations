'use server'

import dbConnect from "@/utils/dbConnect";
import CSLBibModel from "@/models/CSLBibTex";
import CitationModel from "@/models/Citation";
import User from "@/models/User";
import { authConfig } from '@/lib/auth';
import { getServerSession } from 'next-auth';

async function getUserIdServer() {
    await dbConnect();

    const session = await getServerSession(authConfig);
    const userId = session?.user?.id ?? '';
    
    return await User.findById(userId);
}

export async function DeleteCitation(referenceId: string, citationId: string) {
    const user = await getUserIdServer();


}

export async function GetCitations(referenceId: any) {
    const user = await getUserIdServer();


    const citationList = [];

    for (const citationId of user.ownedCitations) {
        let citation = await CitationModel.findById(citationId);

        citationList.push(citation)
    }

    return citationList;


}