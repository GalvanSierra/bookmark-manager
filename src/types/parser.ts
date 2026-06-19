import type { BookmarkSchema } from './bookmark.ts';

export interface BookmarkParser {
  parse(content: string): BookmarkSchema[];
  serialize(bookmarks: BookmarkSchema[]): string;
}
