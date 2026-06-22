import type { Bookmark, BookmarkSchema } from '@/types/bookmark';

export function getDuplicates(bookmarks: Bookmark[], param: 'title' | 'url'): Bookmark[] {
  const duplicates: Bookmark[] = [];
  const values = new Set();

  for (const bookmark of bookmarks) {
    if (values.has(bookmark[param])) {
      duplicates.push(bookmark);
    } else {
      values.add(bookmark[param]);
    }
  }
  return duplicates;
}

export function printByDomain(bookmarks: Bookmark[]): void {
  const domains = Map.groupBy(bookmarks, (b) => new URL(b.url).hostname || 'invalid-url');

  const domainsSorted = Array.from(domains.entries())
    .map(([domain, bookmarks]) => ({
      domain,
      count: bookmarks.length,
    }))
    .sort((a, b) => b.count - a.count);

  domainsSorted.forEach(({ domain, count }) => {
    console.log(`${domain} —— ${count}`);
  });
}

export function printByFolders(bookmarks: Bookmark[]): void {
  const folders = Map.groupBy(bookmarks, (b) => b.folder);

  const foldersWithCount = Array.from(folders.entries()).map(([folder, bookmarks]) => ({
    folder,
    count: bookmarks.length,
  }));

  foldersWithCount.forEach(({ folder, count }) => {
    console.log(`${folder} —— ${count}`);
  });
}

export function getDomains(bookmarks: Bookmark[]): BookmarkSchema[] {
  const domains = new Set(bookmarks.map((b) => new URL(b.url).hostname || b.url.split('/')[2]));

  return [...domains].map((d) => ({
    title: d || 'invalid-url',
    url: `https://${d}`,
    folder: 'domains',
  }));
}
