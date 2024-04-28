'use server';

import {getDBStatistics} from "@/utils/dbConnect";

export async function GetDatabaseStatus() {

    const stats = await getDBStatistics();
    
    return stats;

}