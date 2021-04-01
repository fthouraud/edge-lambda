import { createHash } from 'crypto'
import { createReadStream, existsSync } from 'fs'

const encodingOptions = { encoding: 'utf-8' }

export const computeFileChecksum = async (absolutePath) => {
  if (!absolutePath) throw new Error('An absolute path is required')
  if (!existsSync(absolutePath)) throw new Error(`This file does not seem to exist: ${absolutePath}`)

  return new Promise((resolve, reject) => {
    const md5Hash = createHash('md5', encodingOptions)
    const stream = createReadStream(absolutePath, encodingOptions)

    stream.on('error', reject)
    stream.on('data', (data) => md5Hash.update(data.toString()))
    stream.on('close', () => resolve(md5Hash.digest('hex').toString()))
  })
}
