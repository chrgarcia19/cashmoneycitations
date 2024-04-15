const columns = [
  {name: "TITLE", uid: "title", sortable: true},
  {name: "DATE PUBLISHED", uid: "datePublished", sortable: true},
  {name: "CONTRIBUTORS", uid: "contributors", sortable: true},
  {name: "TAGS", uid: "tags", sortable: true},
  {name: "ACTIONS", uid: "actions"},
  {name: "TYPE", uid: "type", sortable: true},
];

const statusOptions = [
  {name: "Active", uid: "active"},
  {name: "Paused", uid: "paused"},
];

export {columns, statusOptions};
