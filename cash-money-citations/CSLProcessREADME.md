# CSL Process

This documentation will go through how citations are generated, validated, & stored within the Cash Money Citations web application. 

## Overall Idea

The task of dynamically generating citations based off of unknown reference types/data is tricky for a multitude of reasons, including:
#### 1. Each reference type contains different fields of information.
#### 2. Each reference type requires different information.
#### 3. Each citation style requires different information in specific formats.

***

The overall idea is that if we are able to normalize all of the reference data from different sources, we should in theory be able to format it into CSL-JSON. With this CSL-JSON will then can go to any citation style supported by the Citation Style Language project, which maintains a wide variety of citation styles, locales, and much more . At the time of this documentation (*3/15/2024*) there are around **2,595** independent styles with over **8,000** dependent styles.

 ```mermaid
stateDiagram-v2
   manual_reference --> format
   DOI --> format
   ISBN --> format
   ISSN --> format
   format --> validation
   validation --> CSLJSON
   CSLJSON --> Citation_Styles
```
***
## Current Process

Currently the way that we handle different input types, & data to create dynamic citations is as follows.

 ```mermaid
stateDiagram-v2
   manual_reference --> format
   DOI --> format
   ISBN --> format
   ISSN --> format
   format --> validation
   validation --> stored_in_Database
   validation --> toBib(La)Tex
   toBib(La)Tex --> parsed_to_CSLJSON
   parsed_to_CSLJSON --> update_database_reference
```

### Important BibLaTex Commands
- const { plugins } = require('@citation-js/core')
- const config = plugins.config.get('@bibtex')
- config.parse.sentenceCase = 'always';
- plugins.input.forceType = "@else/list+object"
- config.types.bibtex.target['conference'] = 'conference'
- config.parse.strict = true

#### Input Types
https://citation.js.org/api/0.3/tutorial-input_formats.html

#### Schema feilds

Differing dates are requried for the different input types (DOI, Manual, ISBN, etc)

#### BibLaTex Feilds
``` TypeScript
{
  abstract: [ 'field', 'literal' ],
  addendum: [ 'field', 'literal' ],
  afterword: [ 'list', 'name' ],
  annotation: [ 'field', 'literal' ],
  annotator: [ 'list', 'name' ],
  author: [ 'list', 'name' ],
  authortype: [ 'field', 'key' ],
  bookauthor: [ 'list', 'name' ],
  bookpagination: [ 'field', 'key' ],
  booksubtitle: [ 'field', 'literal' ],
  booktitle: [ 'field', 'title' ],
  booktitleaddon: [ 'field', 'literal' ],
  chapter: [ 'field', 'literal' ],
  commentator: [ 'list', 'name' ],
  date: [ 'field', 'date' ],
  doi: [ 'field', 'verbatim' ],
  edition: [ 'field', 'literal' ],
  editor: [ 'list', 'name' ],
  editora: [ 'list', 'name' ],
  editorb: [ 'list', 'name' ],
  editorc: [ 'list', 'name' ],
  editortype: [ 'field', 'key' ],
  editoratype: [ 'field', 'key' ],
  editorbtype: [ 'field', 'key' ],
  editorctype: [ 'field', 'key' ],
  eid: [ 'field', 'literal' ],
  entrysubtype: [ 'field', 'literal' ],
  eprint: [ 'field', 'verbatim' ],
  eprintclass: [ 'field', 'literal' ],
  eprinttype: [ 'field', 'literal' ],
  eventdate: [ 'field', 'date' ],
  eventtitle: [ 'field', 'title' ],
  eventtitleaddon: [ 'field', 'literal' ],
  file: [ 'field', 'verbatim' ],
  foreword: [ 'list', 'name' ],
  holder: [ 'list', 'name' ],
  howpublished: [ 'field', 'literal' ],
  indextitle: [ 'field', 'literal' ],
  institution: [ 'list', 'literal' ],
  introduction: [ 'list', 'name' ],
  isan: [ 'field', 'literal' ],
  isbn: [ 'field', 'literal' ],
  ismn: [ 'field', 'literal' ],
  isrn: [ 'field', 'literal' ],
  issn: [ 'field', 'literal' ],
  issue: [ 'field', 'literal' ],
  issuesubtitle: [ 'field', 'literal' ],
  issuetitle: [ 'field', 'literal' ],
  iswc: [ 'field', 'literal' ],
  journalsubtitle: [ 'field', 'literal' ],
  journaltitle: [ 'field', 'literal' ],
  label: [ 'field', 'literal' ],
  language: [ 'list', 'key' ],
  library: [ 'field', 'literal' ],
  location: [ 'list', 'literal' ],
  mainsubtitle: [ 'field', 'literal' ],
  maintitle: [ 'field', 'title' ],
  maintitleaddon: [ 'field', 'literal' ],
  month: [ 'field', 'literal' ],
  nameaddon: [ 'field', 'literal' ],
  note: [ 'field', 'literal' ],
  number: [ 'field', 'literal' ],
  organization: [ 'list', 'literal' ],
  origdate: [ 'field', 'date' ],
  origlanguage: [ 'list', 'key' ],
  origlocation: [ 'list', 'literal' ],
  origpublisher: [ 'list', 'literal' ],
  origtitle: [ 'field', 'title' ],
  pages: [ 'field', 'range' ],
  pagetotal: [ 'field', 'literal' ],
  pagination: [ 'field', 'key' ],
  part: [ 'field', 'literal' ],
  publisher: [ 'list', 'literal' ],
  pubstate: [ 'field', 'key' ],
  reprinttitle: [ 'field', 'literal' ],
  series: [ 'field', 'title' ],
  shortauthor: [ 'list', 'name' ],
  shorteditor: [ 'list', 'name' ],
  shorthand: [ 'field', 'literal' ],
  shorthandintro: [ 'field', 'literal' ],
  shortjournal: [ 'field', 'literal' ],
  shortseries: [ 'field', 'literal' ],
  shorttitle: [ 'field', 'title' ],
  subtitle: [ 'field', 'literal' ],
  title: [ 'field', 'title' ],
  titleaddon: [ 'field', 'literal' ],
  translator: [ 'list', 'name' ],
  type: [ 'field', 'title' ],
  url: [ 'field', 'uri' ],
  urldate: [ 'field', 'date' ],
  venue: [ 'field', 'literal' ],
  version: [ 'field', 'literal' ],
  volume: [ 'field', 'integer' ],
  volumes: [ 'field', 'integer' ],
  year: [ 'field', 'literal' ],
  crossref: [ 'field', 'entry key' ],
  entryset: [ 'separated', 'literal' ],
  execute: [ 'field', 'code' ],
  gender: [ 'field', 'gender' ],
  langid: [ 'field', 'identifier' ],
  langidopts: [ 'field', 'literal' ],
  ids: [ 'separated', 'entry key' ],
  indexsorttitle: [ 'field', 'literal' ],
  keywords: [ 'separated', 'literal' ],
  options: [ 'separated', 'options' ],
  presort: [ 'field', 'string' ],
  related: [ 'separated', 'literal' ],
  relatedoptions: [ 'separated', 'literal' ],
  relatedtype: [ 'field', 'identifier' ],
  relatedstring: [ 'field', 'literal' ],
  sortkey: [ 'field', 'literal' ],
  sortname: [ 'list', 'name' ],
  sortshorthand: [ 'field', 'literal' ],
  sorttitle: [ 'field', 'literal' ],
  sortyear: [ 'field', 'integer' ],
  xdata: [ 'separated', 'entry key' ],
  xref: [ 'field', 'entry key' ],
  namea: [ 'list', 'name' ],
  nameb: [ 'list', 'name' ],
  namec: [ 'list', 'name' ],
  nameatype: [ 'field', 'key' ],
  namebtype: [ 'field', 'key' ],
  namectype: [ 'field', 'key' ],
  lista: [ 'list', 'literal' ],
  listb: [ 'list', 'literal' ],
  listc: [ 'list', 'literal' ],
  listd: [ 'list', 'literal' ],
  liste: [ 'list', 'literal' ],
  listf: [ 'list', 'literal' ],
  usera: [ 'field', 'literal' ],
  userb: [ 'field', 'literal' ],
  userc: [ 'field', 'literal' ],
  userd: [ 'field', 'literal' ],
  usere: [ 'field', 'literal' ],
  userf: [ 'field', 'literal' ],
  verba: [ 'field', 'literal' ],
  verbb: [ 'field', 'literal' ],
  verbc: [ 'field', 'literal' ],
  address: [ 'list', 'literal' ],
  annote: [ 'field', 'literal' ],
  archiveprefix: [ 'field', 'literal' ],
  journal: [ 'field', 'literal' ],
  key: [ 'field', 'literal' ],
  pdf: [ 'field', 'verbatim' ],
  primaryclass: [ 'field', 'literal' ],
  school: [ 'list', 'literal' ],
  numpages: [ 'field', 'integer' ],
  pmid: [ 'field', 'literal' ],
  pmcid: [ 'field', 'literal' ]
}
```
### Zotero References

##### Zotero Schema
https://github.com/zotero/zotero-schema/blob/master/schema.json

This project uses styles, locales, and more from the Citation Style Language Project. Found here -> [https://citationstyles.org/]
