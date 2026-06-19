import { PARSERS } from '@/config/constant';
import { BookmarkService } from '@/services/BookmarkService';
import type { BookmarkSchema } from '@/types/bookmark';
import type { IBookmarkParser } from '@/types/parser';
import { FileHandler } from '@/utils/FileHandler';
import { Logger } from '@/utils/Logger';
import { extname } from 'node:path';

export class BookmarkFacade {
  private logger = new Logger();
  private fileHandler = new FileHandler(this.logger);

  public async load(path: string): Promise<BookmarkService> {
    const service = new BookmarkService();
    const parser = this.getParser(path);

    const content = await this.fileHandler.read(path);
    const parsed = parser.parse(content);

    const created = service.add(parsed);
    this.logger.info(
      `Loaded ${created.length} bookmarks (${parsed.length - created.length} duplicates) from ${path}`,
    );

    return service;
  }

  public export(path: string, bookmarks: BookmarkSchema[]): void {
    const parser = this.getParser(path);
    const content = parser.serialize(bookmarks);
    this.fileHandler.write(path, content);
    this.logger.info(`Exported ${bookmarks.length} bookmarks to ${path}`);
  }

  private getParser(path: string): IBookmarkParser {
    const extension = extname(path);
    if (!PARSERS[extension]) throw new Error(`Unsupported file extension: ${extension}`);
    return PARSERS[extension];
  }
}
