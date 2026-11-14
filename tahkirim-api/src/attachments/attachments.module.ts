import {
  Controller,
  Get,
  Injectable,
  Module,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import type { Response } from 'express';
import { createReadStream, existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname, join, resolve } from 'path';
import { Repository } from 'typeorm';
import { Attachment } from '../entities/attachment.entity';

export const UPLOAD_DIR = resolve(process.env.UPLOAD_DIR ?? 'uploads');
const MAX_BYTES = 20 * 1024 * 1024;

@Injectable()
export class AttachmentsService {
  constructor(@InjectRepository(Attachment) private readonly repo: Repository<Attachment>) {}

  save(file: Express.Multer.File) {
    return this.repo.save(
      this.repo.create({
        // multer reads names as latin1; restore UTF-8 so Hebrew file names survive
        // (browsers send a quote in a file name as %22)
        originalName: Buffer.from(file.originalname, 'latin1').toString('utf8').replace(/%22/g, '"'),
        mimeType: file.mimetype,
        size: file.size,
        storedName: file.filename,
      }),
    );
  }

  async find(id: string) {
    const a = await this.repo.findOneBy({ id });
    if (!a) throw new NotFoundException(`Attachment ${id} not found`);
    return a;
  }
}

@ApiTags('attachments – קבצים')
@Controller('attachments')
export class AttachmentsController {
  constructor(private readonly service: AttachmentsService) {}

  /**
   * Upload a file for a "text or file" field (מיקום, נ"צ, מקורות מידע).
   * Returns the attachment; send its `id` as locationFileId / coordinatesFileId / sourcesFileId.
   */
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: MAX_BYTES },
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          mkdirSync(UPLOAD_DIR, { recursive: true });
          cb(null, UPLOAD_DIR);
        },
        filename: (_req, file, cb) => cb(null, `${randomUUID()}${extname(file.originalname).toLowerCase()}`),
      }),
    }),
  )
  upload(@UploadedFile() file?: Express.Multer.File) {
    if (!file) throw new BadRequestException('Send the file in a multipart field named "file"');
    return this.service.save(file);
  }

  /** Download the file */
  @Get(':id')
  async download(@Param('id', ParseUUIDPipe) id: string, @Res({ passthrough: true }) res: Response) {
    const a = await this.service.find(id);
    const path = join(UPLOAD_DIR, a.storedName);
    if (!existsSync(path)) throw new NotFoundException('The file is missing from the uploads folder');
    res.set({
      'Content-Type': a.mimeType,
      'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(a.originalName)}`,
    });
    return new StreamableFile(createReadStream(path));
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([Attachment])],
  controllers: [AttachmentsController],
  providers: [AttachmentsService],
})
export class AttachmentsModule {}
