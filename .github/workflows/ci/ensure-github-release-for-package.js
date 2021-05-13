import { ensureGithubReleaseForPackage } from "@jsenv/github-release-package"

ensureGithubReleaseForPackage({
  logLevel: "debug",
  projectDirectoryUrl: new URL("../../../", import.meta.url),
})
