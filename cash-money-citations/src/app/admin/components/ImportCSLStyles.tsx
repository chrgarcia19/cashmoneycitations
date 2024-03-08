'use client'

import React, { useState } from 'react';

function ImportCSLStyles({handleCslSubmit}: any) {
    const [cslDirectory, setCslDirectory] = useState('');

    function handleInputChange(e: any) {
        setCslDirectory(e.target.value);
    }

    function handleSubmit(e: any) {
        handleCslSubmit(cslDirectory);
    }

    return (
        <>
            <form action={handleSubmit}>
                <input
                    placeholder='Relative Path to CSL Style Directory'
                    value={cslDirectory}
                    onChange={handleInputChange}
                />
                <button type='submit'>Import CSL Styles</button>
            </form>
        </>
    )
}

export default ImportCSLStyles;