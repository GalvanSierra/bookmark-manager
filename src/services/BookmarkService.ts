import type { Bookmark, BookmarkSchema, BookmarkUpdate, SearchOptions } from '@/types/bookmark';
import { randomUUIDv7 } from 'bun';

export class BookmarkService {
  private bookmarks = new Map<string, Bookmark>();
  private urlIndex = new Map<string, string>();

  public add(bookmarks: BookmarkSchema[]): Bookmark[] {
    const added: Bookmark[] = [];

    for (const bookmark of bookmarks) {
      if (this.urlIndex.has(bookmark.url)) {
        continue;
      }

      const newBookmark = this.createBookmark(bookmark);

      this.bookmarks.set(newBookmark.id, newBookmark);
      this.urlIndex.set(bookmark.url, newBookmark.id);

      added.push(newBookmark);
    }

    return added;
  }

  public searchBy(options: SearchOptions): Bookmark[] {
    const includeWords = [options.includeWords].flat();
    const searchIn = [options.searchIn ?? ['title', 'url']].flat();

    const {
      ignoreWords = [],
      caseSensitive = false,
      includeAllWords = false,
      exactMatch,
    } = options;
    const bookmarks = Array.from(this.bookmarks.values()).filter((bookmark) => {
      const searchText = [
        searchIn.includes('title') && bookmark.title,
        searchIn.includes('url') && bookmark.url,
        searchIn.includes('folder') && bookmark.folder,
      ]
        .filter(Boolean)
        .join(' ');

      return this.matchWithKeywords(
        searchText,
        includeWords,
        ignoreWords,
        caseSensitive,
        includeAllWords,
      );
    });

    if (exactMatch) {
      const searchTerms = Array.from(new Set(includeWords));
      return bookmarks.filter((bookmark) => searchTerms.includes(bookmark[exactMatch]));
    }

    return bookmarks;
  }

  public delete(bookmarks: BookmarkUpdate[]): Bookmark[] {
    const deleted: Bookmark[] = [];

    for (const { id } of bookmarks) {
      const exist = this.bookmarks.get(id);

      if (!exist) continue;

      this.bookmarks.delete(id);
      this.urlIndex.delete(exist.url);

      deleted.push(exist);
    }

    return deleted;
  }

  public list(): Bookmark[] {
    return [...this.bookmarks.values()];
  }

  private matchWithKeywords(
    searchText: string,
    includeWords: string[],
    ignoreWords: string[],
    caseSensitive: boolean,
    includeAllWords: boolean,
  ): boolean {
    const prepareText = (text: string) => (caseSensitive ? text : text.toLowerCase());

    const searchTextPrep = prepareText(searchText);
    const includeWordsPrep = includeWords.map(prepareText);
    const excludeWordsPrep = ignoreWords.map(prepareText);

    const hasIncludeWord = includeAllWords
      ? includeWordsPrep.every((word) => searchTextPrep.includes(word)) // AND lógico
      : includeWordsPrep.some((word) => searchTextPrep.includes(word)); // OR lógico

    const hasExcludeWord = excludeWordsPrep.some((word) => searchTextPrep.includes(word));

    return hasIncludeWord && !hasExcludeWord;
  }

  private createBookmark(bookmark: BookmarkSchema): Bookmark {
    return {
      ...bookmark,
      id: randomUUIDv7(),
    };
  }
}
