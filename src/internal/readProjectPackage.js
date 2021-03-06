import { resolveUrl, urlToFileSystemPath, readFile } from "@jsenv/util"

export const readProjectPackage = async ({ projectDirectoryUrl }) => {
  const packageFileUrl = resolveUrl("./package.json", projectDirectoryUrl)

  let packageInProject
  try {
    const packageString = await readFile(packageFileUrl)
    try {
      packageInProject = JSON.parse(packageString)
    } catch (e) {
      if (e.name === "SyntaxError") {
        throw new Error(`syntax error while parsing project package.json
--- syntax error stack ---
${e.stack}
--- package.json path ---
${urlToFileSystemPath(packageFileUrl)}`)
      }
      throw e
    }
  } catch (e) {
    if (e.code === "ENOENT") {
      throw new Error(
        `cannot find project package.json
--- package.json path ---
${urlToFileSystemPath(packageFileUrl)}`,
      )
    }
    throw e
  }

  return packageInProject
}
