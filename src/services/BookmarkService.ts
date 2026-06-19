import type { Bookmark, BookmarkSchema, BookmarkUpdate } from '@/types/bookmark';
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

  private createBookmark(bookmark: BookmarkSchema): Bookmark {
    return {
      ...bookmark,
      id: randomUUIDv7(),
    };
  }
}
