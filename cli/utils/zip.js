import { createWriteStream } from 'fs'

import archiver from 'archiver'

export const zipFiles = async (directory, archivePath) => {
  if (!directory) throw new Error('The directory is mandatory')
  if (!archivePath) throw new Error('The archive file path is mandatory')

  const options = { cwd: directory }

  return new Promise((resolve, reject) => {
    const zip = archiver.create('zip', { zlib: { level: 9 } })
    zip.pipe(createWriteStream(archivePath))

    zip.on('error', reject)
    zip.on('finish', resolve)

    zip.glob('**', options)

    zip.finalize()
  })
}
