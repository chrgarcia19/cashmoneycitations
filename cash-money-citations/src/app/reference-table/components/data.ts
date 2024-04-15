import React from "react";
import { getUserReferences } from "@/components/componentActions/actions";
import { useSession } from "next-auth/react";


const columns = [
  {name: "ID", uid: "id", sortable: true},
  {name: "TITLE", uid: "title", sortable: true},
  {name: "Date Published", uid: "datePublished", sortable: true},
  {name: "Contributors", uid: "contributors", sortable: true},
  {name: "STATUS", uid: "status", sortable: true},
];

const statusOptions = [
  {name: "Active", uid: "active"},
  {name: "Paused", uid: "paused"},
];

export {columns, statusOptions};
