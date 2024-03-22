'use server'

import dbConnect from "@/utils/dbConnect";
import CSLBibModel from "@/models/CSLBibTex";
import CitationModel from "@/models/Citation";
import User from "@/models/User";
import { authConfig } from '@/lib/auth';
import { getServerSession } from 'next-auth';

export async function GetCitations(referenceId: any) {
    await dbConnect();

    const session = await getServerSession(authConfig);
    const userId = session?.user?.id ?? '';
    
    const user = await User.findById(userId);


    const citationList = [];

    for (const citationId of user.ownedCitations) {
        let citation = await CitationModel.findById(citationId);

        citationList.push(citation)
    }

    return citationList;


}