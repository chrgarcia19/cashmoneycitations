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

## CSL

### CSL Types
- article
  - A self-contained work made widely available but not published in a journal or other publication;
  - Use for preprints, working papers, and similar works posted on a platform where some level of persistence or stewardship is expected (e.g. arXiv or other preprint repositories, working paper series);
  - For unpublished works not made widely available or only hosted on personal websites, use manuscript
- article-journal
  - An article published in an academic journal
- article-magazine
  - An article published in a non-academic magazine
- article-newspaper
  - An article published in a newspaper
- bill
  - A proposed piece of legislation
- book
  - A book or similar work;
  - Can be an authored book or an edited collection of self-contained chapters;
  - Can be a physical book or an ebook;
  - The format for an ebook may be specified using medium;
  - Can be a single-volume work, a multivolume work, or one volume of a multivolume work;
  - If a container-title is present, the item is interpreted as a book republished in a collection or anthology;
  - Also used for whole conference proceedings volumes or exhibition catalogs by specifying event and related variables
- broadcast
  - A recorded work broadcast over an electronic medium (e.g. a radio broadcast, a television show, a podcast);
  - The type of broadcast may be specified using genre;
  - If container-title is present, the item is interpreted as an episode contained within a larger broadcast series (e.g. an episode in a television show or an episode of a podcast)
- chapter
  - A part of a book cited separately from the book as a whole (e.g. a chapter in an edited book);
  - Also used for introductions, forewords, and similar supplemental components of a book
- classic
  - A classical or ancient work, sometimes cited using a common abbreviation
- collection
  - An archival collection in a museum or other institution
- dataset
  - A data set or a similar collection of (mostly) raw data
- document
  - A catch-all category for items not belonging to other types;
  - Use a more specific type when appropriate
- entry
  - An entry in a database, directory, or catalog;
  - For entries in a dictionary, use entry-dictionary;
  - For entries in an encyclopedia, use entry-encyclopedia
- entry-dictionary
  - An entry in a dictionary
- entry-encyclopedia
  - An entry in an encyclopedia or similar reference work
- event
  - An organized event (e.g., an exhibition or conference);
  - Use for direct citations to the event, rather than to works contained within an event (e.g. a presentation in a conference, a graphic in an exhibition) or based on an event (e.g. a paper-conference published in a proceedings, an exhibition catalog)
- figure
  - A illustration or representation of data, typically as part of a journal article or other larger work;
  - May be in any format (e.g. image, video, audio recording, 3D model);
  - The format of the item can be specified using medium
- graphic
  - A still visual work;
  - Can be used for artwork or other works (e.g. journalistic or historical photographs);
  - Can be used for any still visual work (e.g. photographs, drawings, paintings, sculptures, clothing);
  - The format of the item can be specified using medium
- hearing
  - A hearing by a government committee or transcript thereof
- interview
  - An interview of a person;
  - Also used for a recording or transcript of an interview; author is interpreted as the interviewee
- legal_case
  - A legal case
- legislation
  - A law or resolution enacted by a governing body
- manuscript
  - An unpublished manuscript;
  - Use for both modern unpublished works and classical manuscripts;
  - For working papers, preprints, and similar works posted to a repository, use article
- map
  - A geographic map
- motion_picture
  - A video or visual recording;
  - If a container-title is present, the item is interpreted as a part contained within a larger compilation of recordings (e.g. a part of a multipart documentary))
- musical_score
  - The printed score for a piece of music;
  - For a live performance of the music, use performance;
  - For recordings of the music, use song (for audio recordings) or motion_picture (for video recordings)
- pamphlet
  - A fragment, historical document, or other unusually-published or ephemeral work (e.g. a sales brochure)
- paper-conference
  - A paper formally published in conference proceedings;
  - For papers presented at a conference, but not published in a proceedings, use speech
- patent
  - A patent for an invention
- performance
  - A live performance of an artistic work;
  - For non-artistic presentations, use speech;
  - For recordings of a performance, use song or motion_picture
- periodical
  - A full issue or run of issues in a periodical publication (e.g. a special issue of a journal)
- personal_communication
  - Personal communications between multiple parties;
  - May be unpublished (e.g. private correspondence between two researchers) or collected/published (e.g. a letter published in a collection)
- post
  - A post on a online forum, social media platform, or similar platform;
  - Also used for comments posted to online items
- post-weblog
  - A blog post
- regulation
  - An administrative order from any level of government
- report
  - A technical report, government report, white paper, brief, or similar work distributed by an institution;
  - Also used for manuals and similar technical documentation (e.g. a software, instrument, or test manual);
  - If a container-title is present, the item is interpreted as a chapter contained within a larger report
- review
  - A review of an item other than a book (e.g. a film review, posted peer review of an article);
  - If reviewed-title is absent, title is taken to be the title of the reviewed item
- review-book
  - A review of a book;
  - If reviewed-title is absent, title is taken to be the title of the reviewed book
- software
  - A computer program, app, or other piece of software
- song
  - An audio recording;
  - Can be used for any audio recording (not only music);
  - If a container-title is present, the item is interpreted as a track contained within a larger album or compilation of recordings
- speech
  - A speech or other presentation (e.g. a paper, talk, poster, or symposium at a conference);
  - Use genre to specify the type of presentation;
  - Use event to indicate the event where the presentation was made (e.g. the conference name);
  - Use container-title if the presentation is part of a larger session (e.g. a paper in a symposium);
  - For papers published in conference proceedings, use paper-conference;
  - For artistic performances, use performance
- standard
  - A technical standard or similar set of rules or norms
- thesis
  - A thesis written to satisfy requirements for a degree;
  - Use genre to specify the type of thesis
- treaty
  - A treaty agreement among political authorities
- webpage
  - A website or page on a website;
  - Intended for sources which are intrinsically online; use a more specific type when appropriate (e.g. article-journal, post-weblog, report, entry);
  - If a container-title is present, the item is interpreted as a page contained within a larger website

### CSL Fields
##### Descriptions for the fields can be found at the following link:
https://docs.citationstyles.org/en/stable/specification.html#standard-variables

abstract
annote
archive
archive_collection
archive_location
archive-place
authority
call-number
citation-key
citation-label
collection-title
container-title
container-title-short
dimensions
division
DOI
event
event-title
event-place
genre
ISBN
ISSN
jurisdiction
keyword
language
license
medium
note
original-publisher
original-publisher-place
original-title
part-title
PMCID
PMID
publisher
publisher-place
references
reviewed-genre
reviewed-title
scale
source
status
title
title-short
URL
volume-title
year-suffix
chapter-number
citation-number
collection-number
edition
first-reference-note-number
issue
locator
number
number-of-pages
number-of-volumes
page
page-first
part-number
printing-number
section
supplement-number
version
volume
accessed
available-date
event-date
issued
original-date
submitted
author
chair
collection-editor
compiler
composer
container-author
contributor
curator
director
editor
editorial-director
editor-translator
executive-producer
guest
host
illustrator
interviewer
narrator
organizer
original-author
performer
producer
recipient
reviewed-author
script-writer
series-creator
translator


### Zotero References

#### Difference between CSL & BibLaTex
https://tex.stackexchange.com/questions/434946/citation-style-language-vs-biblatex-vs-possibly-other-citing-systems

##### Zotero Schema
https://github.com/zotero/zotero-schema/blob/master/schema.json

This project uses styles, locales, and more from the Citation Style Language Project. Found here -> [https://citationstyles.org/]
