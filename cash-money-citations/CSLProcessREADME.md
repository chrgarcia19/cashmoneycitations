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

This project uses styles, locales, and more from the Citation Style Language Project. Found here -> [https://citationstyles.org/]
