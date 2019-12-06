const { ensureGithubReleaseForPackageVersion } = require("@jsenv/github-release-package")
const { projectDirectoryUrl } = require("../jsenv.config.js")

ensureGithubReleaseForPackageVersion({
  projectDirectoryUrl,
})
