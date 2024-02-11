import { createWriteStream, existsSync } from 'fs'
import { mkdir, unlink } from 'fs/promises'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createId } from '@paralleldrive/cuid2'
import { FileUpload } from 'graphql-upload-minimal'
import * as sharp from 'sharp'

@Injectable()
export class UploadsService {
  constructor(private config: ConfigService) {}

  async uploadFile(
    path: string,
    file: Promise<FileUpload>,
    size?: { width?: number; height?: number }
  ) {
    await mkdir(`uploads/${path}`, { recursive: true })

    const key = createId()
    const filePath = `uploads/${path}/${key}.webp`

    const { createReadStream } = await file
    const fileStream = createReadStream()

    const sharpStream = sharp()
      .resize({
        width: size?.width,
        height: size?.height,
        fit: 'cover'
      })
      .webp()

    fileStream.pipe(sharpStream).pipe(createWriteStream(filePath))

    return key
  }

  async deleteFile(path: string, key: string) {
    if (!this.checkFile(path, key)) return

    const filePath = `uploads/${path}/${key}.webp`
    await unlink(filePath)
  }

  checkFile(path: string, key: string) {
    const filePath = `uploads/${path}/${key}.webp`
    return existsSync(filePath)
  }

  fileUrl(path: string, key: string) {
    return `${this.config.getOrThrow('URL')}/cdn/${path}/${key}.webp`
  }
}
