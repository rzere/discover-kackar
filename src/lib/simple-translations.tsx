'use client';

import React, { createContext, useContext } from 'react';

const TranslationContext = createContext<any>({});

export function TranslationProvider({ 
  children, 
  messages 
}: { 
  children: React.ReactNode;
  messages: any;
}) {
  return (
    <TranslationContext.Provider value={messages}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslations(namespace?: string) {
  const messages = useContext(TranslationContext);
  
  return (key: string) => {
    if (namespace) {
      return messages?.[namespace]?.[key] || key;
    }
    return messages?.[key] || key;
  };
}