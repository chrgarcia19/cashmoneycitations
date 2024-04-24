import React, { createContext, useState, useContext } from 'react';
import TestRefTable from './ReferenceTable';
import { CSLBibInterface } from '@/models/CSLBibTex';

const ReferenceContext = createContext('');

export function ReferenceProvider({ children }: any) {
    const [references, setReferences] = useState<CSLBibInterface[]>([]);

    const addReference = (reference: any) => {
        setReferences([...references, reference]);
    };

    const removeReference = (referenceId: any) => {
        setReferences(references.filter((ref) => ref.id !== referenceId));
    };
  
    return (
      <ReferenceContext.Provider value={{ references, addReference, removeReference }as any}>
        {children}
      </ReferenceContext.Provider>
    );
}