// Type definitions for the hymns application

export interface Hymn {
  title: string;
  number: string;
  hymn: string;
  key?: string;   // Make key optional and use union types to handle inconsistencies
  Key?: string;   // Capitalized version found in data
  kry?: string;   // Typo version found in data
}

export interface SearchOptions {
  searchTitle?: boolean;
  searchNumber?: boolean;
  searchContent?: boolean;
  exactMatch?: boolean;
  fuzzyMatch?: boolean;
}

export interface SearchResult {
  hymns: Hymn[];
  totalResults: number;
  query: string;
}

export interface SearchSuggestion {
  text: string;
  type: 'title' | 'number' | 'content';
}
