'use client';

import { createContext, useContext, ReactNode } from 'react';

type Dictionary = Record<string, any>;

const DictionaryContext = createContext<Dictionary>({});

export function DictionaryProvider({
  dictionary,
  children,
}: {
  dictionary: Dictionary;
  children: ReactNode;
}) {
  return (
    <DictionaryContext.Provider value={dictionary}>
      {children}
    </DictionaryContext.Provider>
  );
}

export function useDictionary() {
  return useContext(DictionaryContext);
}

export function useTranslations(namespace?: string) {
  const dict = useDictionary();
  
  return (key: string, params?: Record<string, any>) => {
    // If namespace is provided, prepend it to the key
    const fullKey = namespace ? `${namespace}.${key}` : key;
    const keys = fullKey.split('.');
    let value: any = dict;
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    if (typeof value === 'string' && params) {
      return value.replace(/{(\w+)}/g, (_, key) => params[key] || '');
    }
    
    return value || key;
  };
}
