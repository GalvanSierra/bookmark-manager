import type { Bookmark } from '@/types/bookmark';

export type MangaSerie = Bookmark & { serie: string; chapter?: never };

export type MangaChapter = Bookmark & { serie: string; chapter: number };

export type Manga = MangaSerie | MangaChapter;

export interface IParserConfig {
  regexTitle: RegExp;
  regexChapter: RegExp;
}
