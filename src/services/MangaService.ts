import { CONFIG_BY_DOMAIN } from '@/config/constant';
import type { Bookmark } from '@/types/bookmark';
import type { MangaChapter, MangaSerie } from '@/types/mangas';

export class MangaService {
  public parser(bookmarks: Bookmark[]): {
    series: MangaSerie[];
    chapters: MangaChapter[];
    others: Bookmark[];
  } {
    const byDomain = Map.groupBy(bookmarks, (manga) => this.getHostname(manga.url));

    const series: MangaSerie[] = [];
    const chapters: MangaChapter[] = [];
    const others: Bookmark[] = [];

    for (const [domain, domainBookmarks] of byDomain.entries()) {
      const config = CONFIG_BY_DOMAIN[domain];

      if (!config) {
        domainBookmarks.forEach((b) => others.push(b));
        continue;
      }

      for (const bookmark of domainBookmarks) {
        const serieMatch = bookmark.title.match(config.regexTitle);
        if (!serieMatch?.[1]) continue;

        const chapterMatch = bookmark.title.match(config.regexChapter);

        if (chapterMatch?.[1]) {
          chapters.push({
            ...bookmark,
            serie: serieMatch[1],
            chapter: parseFloat(chapterMatch[1]),
          });
        } else {
          series.push({ ...bookmark, serie: serieMatch[1] });
        }
      }
    }

    return { series, chapters, others };
  }

  pickMostRecent(chapters: MangaChapter[]): {
    mangasToKeep: MangaChapter[];
    mangasToDelete: MangaChapter[];
  } {
    const bySerie = Map.groupBy(chapters, (m) => m.serie);

    const mangasToKeep: MangaChapter[] = [];
    const mangasToDelete: MangaChapter[] = [];

    for (const serieChapters of bySerie.values()) {
      const sorted = [...serieChapters].sort((a, b) => b.chapter - a.chapter);
      const [newest, ...rest] = sorted;
      mangasToKeep.push(newest as MangaChapter);
      mangasToDelete.push(...rest);
    }

    return { mangasToKeep, mangasToDelete };
  }

  getSeriesWithChapters(
    series: MangaSerie[],
    chapters: MangaChapter[],
  ): {
    toKeep: MangaSerie[];
    toDelete: MangaSerie[];
  } {
    const toKeep: MangaSerie[] = [];
    const toDelete: MangaSerie[] = [];

    const setTitleChapters = new Set(chapters.map((s) => s.serie));

    for (const serie of series) {
      if (setTitleChapters.has(serie.serie)) {
        toDelete.push(serie);
      } else {
        toKeep.push(serie);
      }
    }

    return { toKeep, toDelete };
  }

  orderChaptersBySeries(chapters: MangaChapter[], sort: 'asc' | 'desc' = 'desc'): MangaChapter[] {
    return [...chapters].sort((a, b) => {
      const serieCmp = a.serie.localeCompare(b.serie);

      if (serieCmp !== 0) {
        return serieCmp;
      }

      return sort === 'asc' ? a.chapter - b.chapter : b.chapter - a.chapter;
    });
  }

  private getHostname(url: string): string {
    try {
      return new URL(url).hostname;
    } catch {
      return 'invalid-url';
    }
  }
}
