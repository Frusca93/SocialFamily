import { createContext } from 'react';

export const LanguageContext = createContext<{ lang: string, setLang: (l: string) => void }>({ lang: 'it', setLang: () => {} });
