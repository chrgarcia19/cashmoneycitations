"use client"

import { useState, useEffect } from 'react';

export interface Reference {
    id: string;
    selected?: boolean;
    // Add other properties as needed
  }
  
  export interface ReferenceContextType {
    references: Reference[];
    setReferences: (references: Reference[]) => void;
    addReference: (reference: Reference) => void;
    removeReference: (referenceId: string) => void;
    referenceIds: string[];
    setReferenceIds: (referenceIds: string[]) => void;
    selectedReferenceIds: string[];
    setSelectedReferenceIds: (selectedReferenceIds: string[]) => void;
  }

// useLocalStorageReferenceContext.ts
const useLocalStorageReferenceContext = (): ReferenceContextType => {
  const [references, setReferences] = useState<Reference[]>([]);
  const [referenceIds, setReferenceIds] = useState<string[]>([]);
  const [selectedReferenceIds, setSelectedReferenceIds] = useState<string[]>([]);

  useEffect(() => {
    const storedReferences = JSON.parse(localStorage.getItem('references') || '[]');
    setReferences(storedReferences);
    setReferenceIds(storedReferences.map((ref: Reference) => ref.id));
    setSelectedReferenceIds(storedReferences.filter((ref: Reference) => ref.selected).map((ref: Reference) => ref.id));
  }, []);

  const addReference = (reference: Reference) => {
    const newReferences = [...references, reference];
    setReferences(newReferences);
    localStorage.setItem('references', JSON.stringify(newReferences));
  };

  const removeReference = (referenceId: string) => {
    const newReferences = references.filter(ref => ref.id !== referenceId);
    setReferences(newReferences);
    localStorage.setItem('references', JSON.stringify(newReferences));
  };

  return { references, setReferences, addReference, removeReference, referenceIds, setReferenceIds, selectedReferenceIds, setSelectedReferenceIds };
};

export default useLocalStorageReferenceContext;
