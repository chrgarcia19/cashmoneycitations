const columns = [
  {name: "ID", uid: "id", sortable: true},
  {name: "TITLE", uid: "title", sortable: true},
  {name: "DATE PUBLISHED", uid: "datePublished", sortable: true},
  {name: "CONTRIBUTORS", uid: "contributors", sortable: true},
  {name: "TAGS", uid: "tags", sortable: true},
  {name: "STATUS", uid: "status", sortable: true},
  {name: "ACTIONS", uid: "actions"}
];

const statusOptions = [
  {name: "Active", uid: "active"},
  {name: "Paused", uid: "paused"},
];

export {columns, statusOptions};
