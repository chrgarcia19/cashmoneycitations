'use server';

import dbConnect from "@/utils/dbConnect";
import CMCLogModel from "@/models/Log";

export async function LogCMCError(priority: string, logType: string, data: string | [string]) {

    try {
        await dbConnect();


        if (logType && data) {
            const logObject = await CMCLogModel.create({
                priority: priority,
                name: `${logType}${Date.now()}`,
                logType: logType,
                data: data
            })
            logObject.save();
        }


    } catch (e) {
        console.error(e);
    }

}