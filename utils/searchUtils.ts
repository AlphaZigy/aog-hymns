// Search utilities for hymns
import { Hymn, SearchOptions, SearchSuggestion } from '../types';

export const searchUtils = {
  // Normalize text for better matching
  normalizeText: (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s]/g, '') // Remove special characters
      .replace(/\s+/g, ' '); // Normalize whitespace
  },

  // Enhanced search with different strategies
  searchHymns: (hymns: Hymn[], query: string, options: SearchOptions = {}): Hymn[] => {
    const {
      searchTitle = true,
      searchNumber = true,
      searchContent = false,
      exactMatch = false,
      fuzzyMatch = false
    } = options;

    if (!query || !query.trim()) {
      return hymns;
    }

    const normalizedQuery = searchUtils.normalizeText(query);
    const queryWords = normalizedQuery.split(' ').filter((word: string) => word.length > 0);

    return hymns.filter((hymn: Hymn) => {
      const matches: boolean[] = [];

      // Search in title
      if (searchTitle) {
        const normalizedTitle = searchUtils.normalizeText(hymn.title);
        if (exactMatch) {
          matches.push(normalizedTitle === normalizedQuery);
        } else {
          matches.push(
            normalizedTitle.includes(normalizedQuery) ||
            queryWords.some((word: string) => normalizedTitle.includes(word))
          );
        }
      }

      // Search in number
      if (searchNumber) {
        const normalizedNumber = searchUtils.normalizeText(hymn.number);
        matches.push(normalizedNumber.includes(normalizedQuery));
      }

      // Search in content
      if (searchContent) {
        const normalizedContent = searchUtils.normalizeText(hymn.hymn);
        if (exactMatch) {
          matches.push(normalizedContent.includes(normalizedQuery));
        } else {
          matches.push(
            normalizedContent.includes(normalizedQuery) ||
            queryWords.some((word: string) => normalizedContent.includes(word))
          );
        }
      }

      // Early return for performance
      return matches.some((match: boolean) => match);
    });
  },

  // Get search suggestions based on popular searches
  getSearchSuggestions: (query: string, hymns: Hymn[]): string[] => {
    if (!query || query.length < 2) return [];

    const suggestions = new Set<string>();
    const normalizedQuery = query.toLowerCase();
    const maxSuggestions = 5;

    // Use for...of loop for better performance and early exit
    for (const hymn of hymns) {
      if (suggestions.size >= maxSuggestions) break;

      // Extract words from title
      const titleWords = hymn.title.toLowerCase().split(/\s+/);
      for (const word of titleWords) {
        if (word.startsWith(normalizedQuery) && word !== normalizedQuery && word.length > 1) {
          suggestions.add(word);
          if (suggestions.size >= maxSuggestions) break;
        }
      }

      // Add hymn numbers that start with query
      if (hymn.number.toLowerCase().startsWith(normalizedQuery)) {
        suggestions.add(hymn.number);
      }
    }

    return Array.from(suggestions).slice(0, maxSuggestions);
  },

  // New: Advanced search with scoring for better relevance
  searchWithScoring: (hymns: Hymn[], query: string, options: SearchOptions = {}): Hymn[] => {
    if (!query || !query.trim()) {
      return hymns;
    }

    const {
      searchTitle = true,
      searchNumber = true,
      searchContent = false
    } = options;

    const normalizedQuery = searchUtils.normalizeText(query);
    const queryWords = normalizedQuery.split(' ').filter((word: string) => word.length > 0);

    const scoredHymns = hymns.map((hymn: Hymn) => {
      let score = 0;

      if (searchNumber) {
        const normalizedNumber = searchUtils.normalizeText(hymn.number);
        if (normalizedNumber === normalizedQuery) {
          score += 100; // Exact hymn number match gets highest score
        } else if (normalizedNumber.startsWith(normalizedQuery)) {
          score += 50;
        }
      }

      if (searchTitle) {
        const normalizedTitle = searchUtils.normalizeText(hymn.title);
        if (normalizedTitle === normalizedQuery) {
          score += 80; // Exact title match
        } else if (normalizedTitle.includes(normalizedQuery)) {
          score += 40; // Full query in title
        } else {
          // Word matches in title
          const titleScore = queryWords.reduce((acc: number, word: string) => {
            if (normalizedTitle.includes(word)) {
              return acc + (10 / queryWords.length);
            }
            return acc;
          }, 0);
          score += titleScore;
        }
      }

      if (searchContent) {
        const normalizedContent = searchUtils.normalizeText(hymn.hymn);
        if (normalizedContent.includes(normalizedQuery)) {
          score += 20; // Full query in content
        } else {
          // Word matches in content
          const contentScore = queryWords.reduce((acc: number, word: string) => {
            if (normalizedContent.includes(word)) {
              return acc + (5 / queryWords.length);
            }
            return acc;
          }, 0);
          score += contentScore;
        }
      }

      return { hymn, score };
    }).filter(item => item.score > 0);

    // Sort by score (highest first) and return hymns
    return scoredHymns
      .sort((a, b) => b.score - a.score)
      .map(item => item.hymn);
  },

  // New: Get advanced search suggestions with types
  getAdvancedSuggestions: (query: string, hymns: Hymn[]): SearchSuggestion[] => {
    if (!query || query.length < 2) return [];

    const suggestions: SearchSuggestion[] = [];
    const normalizedQuery = query.toLowerCase();
    const maxSuggestions = 8;

    // Number suggestions (highest priority)
    for (const hymn of hymns) {
      if (suggestions.length >= maxSuggestions) break;
      
      if (hymn.number.toLowerCase().startsWith(normalizedQuery)) {
        suggestions.push({
          text: hymn.number,
          type: 'number'
        });
      }
    }

    // Title word suggestions
    const titleWords = new Set<string>();
    for (const hymn of hymns) {
      if (suggestions.length >= maxSuggestions) break;
      
      const words = hymn.title.toLowerCase().split(/\s+/);
      for (const word of words) {
        if (word.startsWith(normalizedQuery) && 
            word !== normalizedQuery && 
            word.length > 2 && 
            !titleWords.has(word)) {
          titleWords.add(word);
          suggestions.push({
            text: word,
            type: 'title'
          });
          if (suggestions.length >= maxSuggestions) break;
        }
      }
    }

    return suggestions.slice(0, maxSuggestions);
  }
};
