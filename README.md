# Cash Money Citations


Cash Money Citations is a project aimed at maintaining unique lists of references, that can be exported in a variety of formats. The formats include:
- BibLaTeX
- BibTeX
- CSL-JSON
- 2595+ Citation Styles (Bibliography Format)


This project incorporates GitHub & Google OAuth alongside credential login for user/session management.

**Note**: Cash Money Citations currently does not support a production build. This is due to a Type Error present in citation.js during the runtime of the production build. 

## Special Thanks To...
- The Citation Style Language (CSL) Project
    - *Website:* https://citationstyles.org/
    - *GitHub:* https://github.com/citation-style-language
- The Citation.js Project
    - *Citation.js Website:* https://citation.js.org/
    - *Citation.js GitHub:* https://github.com/citation-js
- Lars Willighagen from the Citation.js project
    - *Lars Willighagen's Website:* https://larsgw.github.io/#/


## Documentation
- If you are interested in the inner workings of Cash Money Citations, please view the documentation in the docs/ directory. This directory contains the following information:
    - *CSLProcessREADME.md:* This document details the entire CSL process with elements such as CSL Fields, CSL Types, Schemas, and more. 
    - *OAuthREADME.md:* This document details how to configure the .env.local file on your server running Cash Money Citations. 
    - *RELEASE_NOTES.md:* This document details the changes, upcoming additions, and bugs included in each release of Cash Money Citations.


## Features


#### Grouping
- Ability to group references and export entire groups as BibLaTeX,BibTeX, CSL-JSON or as a bibliography.
#### Tagging
- Ability to filter/sort references based on a user defined tag.
#### Guest Access
- Ability for users to test the application as a guest which stores everything in localstorage instead of the database.
#### Multiple Reference Export
- Ability to select multiple references and export to BibLaTeX, BibTeX, CSL-JSON or as a bibliography.
#### Dynamic Citation Creation
- Ability to dynamically change CSL (citation style) while creating a bibliography.
#### External Input Sources
- DOI
- ISBN
- ISSN
- Music


#### Input Validation


## Admin Features


#### Dashboard


#### Logging


#### Importation of CSL styles and locales


#### User management


#### Database statistics and collection viewing


#### Global Data Management





