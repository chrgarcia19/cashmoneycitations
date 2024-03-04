'use server'

const fs = require('fs');

export async function getStyles() {
    try {
        const data = fs.readFileSync('/home/vyre/cmc/cashmoneycitations/cash-money-citations/src/app/[id]/view/locales-en-US.xml', 'utf8');
        return data;
    } catch(err) {
        console.error(err);
    }

      
}

export async function getCslStyle() {

    try {
     
        const data = fs.readFileSync("/home/vyre/cmc/cashmoneycitations/cash-money-citations/src/app/[id]/view/apa.csl", 'utf8');
        return data;
    } catch (error) {
        console.error(`Got an error trying to read the file`);
    }
}

// export async function cslCreation() {
//     const sys = {
//         retrieveLocale: function (lang: string){
//           const temp = getStyles();
//           return temp;

//         },
//         retrieveItem: async function(citationId: string) {
//           return cslJson2;
//         }
      
//       }
// }