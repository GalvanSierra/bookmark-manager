import type { Bookmark, BookmarkSchema } from '@/types/bookmark';
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

  public list(): Bookmark[] {
    return [...this.bookmarks.values()];
  }

  private createBookmark(bookmark: BookmarkSchema): Bookmark {
    return {
      ...bookmark,
      id: randomUUIDv7(),
    };
  }
}
