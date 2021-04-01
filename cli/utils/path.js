import { join } from 'path'

const lambdasDirectory = join(process.cwd(), 'lambdas')
const distributionDirectory = join(process.cwd(), 'distribution')
const packagesDirectory = join(process.cwd(), 'packages')

export const directories = {
  lambdas: lambdasDirectory,
  distribution: distributionDirectory,
  packages: packagesDirectory,
}

export const getLambdaDistributionDirectory = (lambdaName) => join(distributionDirectory, lambdaName)

export const getLambdaZipFile = (lambdaName) => join(packagesDirectory, `${lambdaName}-lambda.zip`)
