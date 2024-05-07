import React from "react";
import { DisplayCMCLogs } from "./components/admin-dashboard";
import ImportCSLStyles from "./components/ImportCSLStyles";
import GetUsers from "./components/GetUsers";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import importCSLFiles from "@/utils/initCslStylesDb";
import importLocaleFiles from "@/utils/initLocaleDb";
import ImportLocale from "./components/ImportLocale";
import GetLocales, { GetCslStyles } from "./components/ViewCslLocale";
import AdmZip from "adm-zip";
import fs from "fs";
import path from "path";
import util from "util";
import os from "os";
import { DisplayServerStatistics, DisplayCollectionStatistics } from "./components/admin-dashboard";

const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const unlink = util.promisify(fs.unlink);
const rm = util.promisify(fs.rm);
const stat = util.promisify(fs.stat);

async function ParseZipFile(zipFile: any) {
  const file: File | null = zipFile.get("file") as unknown as File;

  if (!file) throw new Error("No file uploaded");

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const tmpFilePath = path.join(os.tmpdir(), file.name);
  fs.writeFileSync(tmpFilePath, buffer);

  const zip = new AdmZip(tmpFilePath);
  const extractPath = "./tmp";
  zip.extractAllTo(extractPath, /*overwrite*/ true);

  return extractPath;
}

export default async function AdminDashboard() {
  const session = await getServerSession(authConfig);
  const currentUserEmail = session?.user?.email;

  async function handleCslSubmit(zipFile: any, includeDependent: boolean) {
    "use server";

    const extractPath = await ParseZipFile(zipFile);

    async function processDirectory(directory: string) {
      const files = await readdir(directory);

      // Check directory name to see if style is dependent
      const isDependent = path.basename(directory) === "dependent";

      // If includeDependent is false and the directory is 'dependent', skip this directory
      if (!includeDependent && isDependent) {
        return;
      }

      for (const file of files) {
        const filePath = path.join(directory, file);
        const stats = await stat(filePath);

        if (stats.isDirectory()) {
          await processDirectory(filePath);
        } else {
          const extension = path.extname(filePath);
          if (extension === ".csl") {
            const fileData = await readFile(filePath, "utf8");
            await importCSLFiles({
              name: file,
              contents: fileData,
              isDependent,
            });
            await unlink(filePath);
          }
        }
      }
    }
    await processDirectory(extractPath);

    // Deletes entire directory after execution
    await rm(extractPath, {
      recursive: true,
      force: true,
    });
  }

  async function handleLocaleSubmit(zipFile: any) {
    "use server";
    const extractPath = await ParseZipFile(zipFile);
    console.log(extractPath);
    async function processDirectory(directory: string) {
      const files = await readdir(directory);

      for (const file of files) {
        const filePath = path.join(directory, file);
        const stats = await stat(filePath);

        if (stats.isDirectory()) {
          await processDirectory(filePath);
        } else {
          const extension = path.extname(filePath);
          if (extension === ".xml") {
            const fileData = await readFile(filePath, "utf8");
            await importLocaleFiles({ name: file, contents: fileData });
            await unlink(filePath);
          }
        }
      }
    }
    await processDirectory(extractPath);

    // Deletes entire directory after execution
    await rm(extractPath, {
      recursive: true,
      force: true,
    });
  }

  return (
    <>
    <HeroSectionAdminHeader />
      <div className="center-content">
        <div className="flex flex-col">
          <div className="bg-white rounded-lg p-6">

          </div>
          <div className="bg-white rounded-lg p-6">
            <GetUsers currentUser={currentUserEmail} />
            {/* <SessionInfo /> */}
            {/* <AdminDashboardClient /> */}
          </div>
          <div className="flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10 mx-auto max-w-4xl">
              <ImportCSLStyles handleCslSubmit={handleCslSubmit} />
              <ImportLocale handleLocaleSubmit={handleLocaleSubmit} />
            </div>
            <div className="flex flex-row justify-evenly m-5">
              <GetCslStyles />
              <GetLocales />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


const HeroSectionAdminHeader = () => {
  return (
    <div className="relative bg-deep-purple-accent-400">
      <div className="absolute inset-x-0 bottom-0">
        <svg
          viewBox="0 0 224 12"
          fill="currentColor"
          className="w-full -mb-1 text-white"
          preserveAspectRatio="none"
        >
          <path d="M0,0 C48.8902582,6.27314026 86.2235915,9.40971039 112,9.40971039 C137.776408,9.40971039 175.109742,6.27314026 224,0 L224,12.0441132 L0,12.0441132 L0,0 Z" />
        </svg>
      </div>
      <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">

          <DisplayServerStatistics />
          <DisplayCollectionStatistics />
          <h2 className='font-bold text-3xl p-2'>Logs</h2>
          <DisplayCMCLogs />
          <a
            href="/"
            aria-label="Scroll down"
            className="flex items-center justify-center w-10 h-10 mx-auto text-white duration-300 transform border border-gray-400 rounded-full hover:text-teal-accent-400 hover:border-teal-accent-400 hover:shadow hover:scale-110"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="currentColor"
            >
              <path d="M10.293,3.293,6,7.586,1.707,3.293A1,1,0,0,0,.293,4.707l5,5a1,1,0,0,0,1.414,0l5-5a1,1,0,1,0-1.414-1.414Z" />
            </svg>
          </a>
        </div>
      </div>
  );
};

