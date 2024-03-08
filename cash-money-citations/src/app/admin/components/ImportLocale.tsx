'use client'

import React, { useState } from 'react';

function ImportLocale({handleLocaleSubmit}: any) {
    const [localeDirectory, setLocaleDirectory] = useState('');

    function handleInputChange(e: any) {
        setLocaleDirectory(e.target.value);
    }

    function handleSubmit(e: any) {
        handleLocaleSubmit(localeDirectory);
    }

    return (
        <>
            <form action={handleSubmit}>
                <input
                    placeholder='Relative Path to Locale Directory'
                    value={localeDirectory}
                    onChange={handleInputChange}
                />
                <button type='submit'>Import Locales (Languages)</button>
            </form>
        </>
    )
}

export default ImportLocale;