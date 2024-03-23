import React from 'react';
import dbConnect from '@/utils/dbConnect';
import CSLStyleModel from '@/models/CSLStyle';
import CSLLocaleModel from '@/models/CSLLocale';
import { CslStyleView, CslLocaleView } from './StyleView';

export async function GetCslStyles() {

    await dbConnect();

    const result = await CSLStyleModel.find();
    const styles = result.map((doc) => {
        const style = JSON.parse(JSON.stringify(doc));
        return style;
    });

    

    return (
        <>
        <div className='px-4 py-2 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg text-white'>
            <table className=''>
                <thead>
                    <tr>
                        <th>Style Name</th>
                        <th>Select</th>
                    </tr>
                </thead>
                <tbody>
                    {styles.slice(0, 10).map((style) => (
                        <CslStyleView key={style._id} {...style}/>
                        ))}

                </tbody>
            </table>
        </div>

        </>
    )
}


export default async function GetLocales() {

    await dbConnect();

    const result = await CSLLocaleModel.find();
    const locales = result.map((doc) => {
        const locale = JSON.parse(JSON.stringify(doc));
        return locale;
    });

    

    return (
        <>
        <div className='px-4 py-2 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg text-white'>
            <table className=''>
                <thead>
                    <tr>
                        <th>Locale Name</th>
                        <th>Select</th>
                    </tr>
                </thead>
                <tbody>
                    {locales.map((locale) => (
                        <CslLocaleView key={locale._id} {...locale}/>
                        ))}

                </tbody>
            </table>
        </div>

        </>
    )
}