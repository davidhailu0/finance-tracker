import 'server-only';

const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  am: () => import('./dictionaries/am.json').then((module) => module.default),
  om: () => import('./dictionaries/om.json').then((module) => module.default),
  ti: () => import('./dictionaries/ti.json').then((module) => module.default),
  so: () => import('./dictionaries/so.json').then((module) => module.default),
};

export type Locale = keyof typeof dictionaries;

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries;

export const getDictionary = async (locale: Locale) => dictionaries[locale]();
