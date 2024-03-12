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
        <div>
            <table className='border-collapse border-spacing-2 border border-slate-400 divide-y divide-gray-200'>
                <thead>
                    <tr>
                        <th>Style Name</th>
                        <th>Select</th>
                    </tr>
                </thead>
                <tbody>
                    {styles.map((style) => (
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
        <div>
            <table className='border-collapse border-spacing-2 border border-slate-400 divide-y divide-gray-200'>
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