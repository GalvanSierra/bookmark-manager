import { HtmlParser } from '@/parsers/HtmlParser';
import { JsonParser } from '@/parsers/JsonParser';
import type { IParserConfig } from '@/types/mangas';
import type { IBookmarkParser } from '@/types/parser';

export const DEFAULT_FOLDER = 'Marcadores';
export const HTML_TEMPLATE = `
<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
    <DT><H3 ADD_DATE="0" LAST_MODIFIED="0" PERSONAL_TOOLBAR_FOLDER="true">Marcadores</H3>
    <DL><p>
    </DL><p>
`;

export const PARSERS: Record<string, IBookmarkParser> = {
  '.html': new HtmlParser(),
  '.json': new JsonParser(),
};

export const CONFIG_BY_DOMAIN: Record<string, IParserConfig> = {
  'olympusxyz.com': {
    regexTitle: /^(?:Capítulo\s+\d+\s+de\s+)?(.+?)\s+|/,
    regexChapter: /Capítulo\s+(\d+)/,
  },

  'visorikigai.yomod.xyz': {
    regexTitle: /^(?:Capítulo\s+\d+\s+-\s+)?(.+?)\s+\|/,
    regexChapter: /Capítulo\s+(\d+)/,
  },
};
