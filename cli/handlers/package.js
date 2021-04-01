import { computeFileChecksum } from '../utils/checksum'
import { getLambdaDistributionDirectory, getLambdaZipFile } from '../utils/path'
import { zipFiles } from '../utils/zip'

export default async ({ lambdaToPack }) => {
  const lambdaDirectory = getLambdaDistributionDirectory(lambdaToPack)
  const zipFile = getLambdaZipFile(lambdaToPack)

  console.log(`Packaging '${lambdaToPack}' lambda`)

  await zipFiles(lambdaDirectory, zipFile).then(() => {
    computeFileChecksum(zipFile).then((checksum) => console.log(`Archive's checksum is: ${checksum}`))
  })
}
