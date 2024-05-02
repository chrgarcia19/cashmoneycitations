'use server';

import {getDBStatistics} from "@/utils/dbConnect";
import dbConnect from "@/utils/dbConnect";
import CSLBibModel from "@/models/CSLBibTex";
import CitationModel from "@/models/Citation";
import User from "@/models/User";
import Tag from "@/models/Tag";
import CSLStyleModel from "@/models/CSLStyle";
import CSLLocaleModel from "@/models/CSLLocale";
import CMCLogModel from "@/models/Log";
import { LogCMCError } from "@/components/componentActions/logActions";
import Log from "@/models/Log";
import mongoose from "mongoose";

export async function fetchDocumentsFromCollection(collectionName: string, page: number, limit: number) {
  try {
    await dbConnect();

    let collection;
    switch(collectionName) {
      case "references":
        collection = CSLBibModel;
        break;
      case "citations":
        collection = CitationModel;
        break;
      case "users":
        collection = User;
        break;
      case "tags":
        collection = Tag;
        break;
      case "cslstyles":
        collection = CSLStyleModel;
        break;
      case "locales":
        collection = CSLLocaleModel;
        break;
      case "logs":
        collection = Log;
        break;

    }

    const collectionFields: { [key: string]: string[] } = {
      users: ['_id', 'username', 'createdAt', 'updatedAt'],
      logs: ['name', 'logType', 'createdAt', 'updatedAt'],
      references: ['title', 'isOwnedBy' ,'createdAt', 'updatedAt'],
      cslstyles: ['title', 'isDependent', 'createdAt', 'updatedAt'],
      locales: ['name', 'createdAt', 'updatedAt'],
      tags: ['tagName', 'tagColor', 'createdAt', 'updatedAt'],
      citations: ['name', 'style', 'createdAt', 'updatedAt'],

    }

    if (!collectionFields[collectionName]) {
      throw new Error(`Unknown collection: ${collectionName}`);
    }
    const fieldNames = collectionFields[collectionName];


    const fields: { [key: string]: number } = collectionFields[collectionName].reduce((obj: { [key: string]: number }, field) => {
      obj[field] = 1;
      return obj;
    }, {});

    const skip = (page - 1) * limit;

    let documents = await collection?.find({}, fields)
    .skip(skip)
    .limit(limit)
    .exec();

    if (fields.isOwnedBy && collection) {
      documents = await collection.populate(documents, { path: 'isOwnedBy' });
    }
  
    documents = toObjectRecursive(documents);

    const totalDocuments = collection ? await collection.collection.countDocuments() : 0;

    return { documents, totalDocuments, fieldNames };

  } catch (e: any) {
    LogCMCError("CRITICAL", "DATABASE", e);
    console.error(e);
  }
}

function toObjectRecursive(doc: any) {
  if (doc instanceof mongoose.Document || doc instanceof mongoose.Types.DocumentArray) {
    doc = doc.toObject({ getters: true, virtuals: true });
    for (let key in doc) {
      if (key === 'createdAt' || key === 'updatedAt') {
        doc[key] = new Date(doc[key]).toISOString();
      } else {
        doc[key] = toObjectRecursive(doc[key]);
      }
    }
  } else if (doc instanceof mongoose.Types.ObjectId) {
    doc = doc.toString();
  } else if (Array.isArray(doc)) {
    for (let i = 0; i < doc.length; i++) {
      doc[i] = toObjectRecursive(doc[i]);
    }
  } else if (typeof doc === 'object' && doc !== null) {
    for (let key in doc) {
      if (key === 'createdAt' || key === 'updatedAt') {
        doc[key] = new Date(doc[key]).toISOString();
      } else {
        doc[key] = toObjectRecursive(doc[key]);
      }
    }
  }
  return doc;
}

export async function GetDatabaseStatus() {

    const stats = await getDBStatistics();
    return stats;

}

export async function GetCollectionStats(collName: string) {
    try {
      await dbConnect();
  
      let collection;
      switch(collName) {
        case "references":
          collection = CSLBibModel;
          break;
        case "citations":
          collection = CitationModel;
          break;
        case "users":
          collection = User;
          break;
        case "tags":
          collection = Tag;
          break;
        case "cslstyles":
          collection = CSLStyleModel;
          break;
        case "locales":
          collection = CSLLocaleModel;
          break;
        case "logs":
          collection = Log;
          break;

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