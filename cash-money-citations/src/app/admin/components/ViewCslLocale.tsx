import React from 'react';
import dbConnect from '@/utils/dbConnect';
import CSLStyleModel from '@/models/CSLStyle';
import CSLLocale from '@/models/CSLLocale';
import UserView from './UserView';
import StyleView from './StyleView';

export default async function GetCslStyles() {

    await dbConnect();

    const result = await CSLStyleModel.find();
    const styles = result.map((doc) => {
        const user = JSON.parse(JSON.stringify(doc));
        return user;
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
                        <StyleView key={style._id} {...style}/>
                        ))}

                </tbody>
            </table>
        </div>

        </>
    )
}