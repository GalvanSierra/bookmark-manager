import type { BookmarkSchema } from './bookmark.ts';

export interface IBookmarkParser {
  parse(content: string): BookmarkSchema[];
  serialize(bookmarks: BookmarkSchema[]): string;
}
