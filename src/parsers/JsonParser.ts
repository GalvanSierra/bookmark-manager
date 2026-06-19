import { DEFAULT_FOLDER } from '@/config/constant';
import type { Bookmark, BookmarkSchema } from '@/types/bookmark';
import type { IBookmarkParser } from '@/types/parser';

/**
 * Parses bookmark data from a JSON string.
 * Expects an array of objects with `title`, `url`, `folder`, `dateAdded`, and `icon` properties.
 */
export class JsonParser implements IBookmarkParser {
  /**
   * Parses a JSON string into an array of `BookmarkSchema` objects.
, null, 2   *
   * @param content - Raw JSON string containing bookmark data
   * @returns An array of parsed bookmarks; returns an empty array if the input is not an array
   */
  parse(content: string): BookmarkSchema[] {
    const parsed = JSON.parse(content);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map((item) => {
      const url = URL.canParse(item.url) ? new URL(item.url).href : item.url;

      return {
        title: item.title,
        url,
        folder: item.folder || DEFAULT_FOLDER,
        dateAdded: item.dateAdded || '',
        icon: item.icon,
      };
    });
  }

  /**
   * Serializes an array of `Bookmark` objects into a JSON string.
   *
   * @param bookmarks - Array of `Bookmark` objects to serialize
   * @returns A JSON string representation of the input array
   */
  serialize(bookmarks: Bookmark[]): string {
    return JSON.stringify(
      bookmarks.map((b) => {
        const keyToRemove = 'id';

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [keyToRemove]: removedKey, ...newBookmark } = b;
        return newBookmark;
      }),
      null,
      2,
    );
  }
}
