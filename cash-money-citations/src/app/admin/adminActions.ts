'use server';

import {getDBStatistics} from "@/utils/dbConnect";
import dbConnect from "@/utils/dbConnect";
import CSLBibModel from "@/models/CSLBibTex";
import CMCLogModel from "@/models/Log";
import { LogCMCError } from "@/components/componentActions/logActions";

export async function GetDatabaseStatus() {

    const stats = await getDBStatistics();
    return stats;

}

export async function GetCollectionStats(collName: string) {
    try {
      await dbConnect();
  
      let collection;
      switch(collName) {
        case "cslbibmodels":
          collection = CSLBibModel;
          break;
        // Add more cases here for other collections
      }
  
      if (!collection) {
        throw new Error(`Unknown collection: ${collName}`);
      }
  
      const result = await collection.collection.aggregate([
        {
          $collStats: {
            storageStats: {},
            count: {},
            latencyStats: { histograms: false }
          }
        }
      ]).toArray();

      const stats = {
        ns: { label: 'Namespace', value: result[0].ns },
        localTime: { label: 'Local Time', value: result[0].localtime },
        count: { label: 'Count', value: result[0].count },
        size: { label: 'Size', value: result[0].storageStats.size },
        avgObjSize: { label: 'Average Object Size', value: result[0].storageStats.avgObjSize },
        freeStorageSize: { label: 'Free Storage Size', value: result[0].storageStats.freeStorageSize },
        totalSize: { label: 'Total Size', value: result[0].storageStats.totalSize },
      };
  
      return stats;
  
    } catch (e: any) {
      LogCMCError("CRITICAL", "DATABASE", e);
      console.error(e);
    }
}

export async function GetCMCLogs() {
  try {
    await dbConnect();

    let logs = await CMCLogModel.find();

    // Convert each log to an object and _id to string
    logs = logs.map(log => {
      const logObject = log.toObject();
      logObject._id = logObject._id.toString();
      logObject.createdAt = logObject.createdAt.toISOString();
      return logObject;
    });

    return logs;

  } catch(e: any) {
    LogCMCError("CRITICAL", "DATABASE", e);
    console.error(e);
  }
}