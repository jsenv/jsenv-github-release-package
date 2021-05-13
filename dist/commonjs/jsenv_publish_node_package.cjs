'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var logger = require('@jsenv/logger');
var util = require('@jsenv/util');
var server = require('@jsenv/server');

const readProjectPackage = async ({
  projectDirectoryUrl
}) => {
  const packageFileUrl = util.resolveUrl("./package.json", projectDirectoryUrl);
  let packageInProject;

  try {
    const packageString = await util.readFile(packageFileUrl);

    try {
      packageInProject = JSON.parse(packageString);
    } catch (e) {
      if (e.name === "SyntaxError") {
        throw new Error(`syntax error while parsing project package.json
--- syntax error stack ---
${e.stack}
--- package.json path ---
${util.urlToFileSystemPath(packageFileUrl)}`);
      }

      throw e;
    }
  } catch (e) {
    if (e.code === "ENOENT") {
      throw new Error(`cannot find project package.json
--- package.json path ---
${util.urlToFileSystemPath(packageFileUrl)}`);
    }

    throw e;
  }

  return packageInProject;
};

// https://developer.github.com/v3/git/refs/#get-a-single-reference
const getGithubRelease = async ({
  githubToken,
  githubRepositoryOwner,
  githubRepositoryName,
  githubReleaseName
}) => {
  const requestUrl = `https://api.github.com/repos/${githubRepositoryOwner}/${githubRepositoryName}/git/ref/tags/${githubReleaseName}`;
  const response = await server.fetchUrl(requestUrl, {
    headers: {
      authorization: `token ${githubToken}`
    },
    method: "GET"
  });
  const responseStatus = response.status;

  if (responseStatus === 404) {
    return null;
  }

  if (responseStatus !== 200) {
    throw new Error(writeUnexpectedResponseStatus$1({
      requestUrl,
      responseStatus,
      responseText: await response.text()
    }));
  }

  const responseJson = await response.json();
  return responseJson;
};

const writeUnexpectedResponseStatus$1 = ({
  requestUrl,
  responseStatus,
  responseText
}) => `github api response status should be 200.
--- request url ----
${requestUrl}
--- response status ---
${responseStatus}
--- response text ---
${responseText}`;

// https://developer.github.com/v3/git/tags/
const createGithubRelease = async ({
  githubToken,
  githubRepositoryOwner,
  githubRepositoryName,
  githubSha,
  githubReleaseName
}) => {
  const requestUrl = `https://api.github.com/repos/${githubRepositoryOwner}/${githubRepositoryName}/git/refs`;
  const body = JSON.stringify({
    ref: `refs/tags/${githubReleaseName}`,
    sha: githubSha
  });
  const response = await server.fetchUrl(requestUrl, {
    headers: {
      "authorization": `token ${githubToken}`,
      "content-length": Buffer.byteLength(body)
    },
    method: "POST",
    body
  });
  const responseStatus = response.status;

  if (responseStatus !== 201) {
    throw new Error(writeUnexpectedResponseStatus({
      requestUrl,
      responseStatus,
      responseText: await response.text()
    }));
  }

  const responseJson = await response.json();
  return responseJson;
};

const writeUnexpectedResponseStatus = ({
  requestUrl,
  responseStatus,
  responseText
}) => `github api response status should be 201.
--- request url ----
${requestUrl}
--- response status ---
${responseStatus}
--- response text ---
${responseText}`;

const ensureGithubReleaseForPackage = async ({
  cancellationToken = util.createCancellationTokenForProcess(),
  logLevel,
  projectDirectoryUrl,
  updateProcessExitCode = true
}) => {
  return util.catchCancellation(async () => {
    const logger$1 = logger.createLogger({
      logLevel
    });
    logger$1.debug(`autoReleaseOnGithub(${JSON.stringify({
      projectDirectoryUrl,
      logLevel
    }, null, "  ")})`);
    projectDirectoryUrl = util.assertAndNormalizeDirectoryUrl(projectDirectoryUrl);
    const {
      githubToken,
      githubRepositoryOwner,
      githubRepositoryName,
      githubSha
    } = getOptionsFromGithubAction();
    logger$1.debug(`reading project package.json`);
    const {
      packageVersion
    } = await getOptionsFromProjectPackage({
      projectDirectoryUrl
    });
    cancellationToken.throwIfRequested();
    logger$1.debug(`${packageVersion} found in package.json`);
    logger$1.debug(`search release for ${packageVersion} on github`);
    const githubReleaseName = `v${packageVersion}`;
    const existingRelease = await getGithubRelease({
      githubToken,
      githubRepositoryOwner,
      githubRepositoryName,
      githubReleaseName
    });
    cancellationToken.throwIfRequested();

    if (existingRelease) {
      logger$1.info(`${packageVersion} already released at ${generateReleaseUrl({
        githubRepositoryOwner,
        githubRepositoryName,
        githubReleaseName
      })}`);
      return;
    }

    logger$1.info(`creating release for ${packageVersion}`);
    await createGithubRelease({
      githubToken,
      githubRepositoryOwner,
      githubRepositoryName,
      githubSha,
      githubReleaseName
    });
    logger$1.info(`release created at ${generateReleaseUrl({
      githubRepositoryOwner,
      githubRepositoryName,
      githubReleaseName
    })}`);
  }).catch(e => {
    if (updateProcessExitCode) {
      process.exitCode = 1;
    }

    throw e;
  });
};

const generateReleaseUrl = ({
  githubRepositoryOwner,
  githubRepositoryName,
  githubReleaseName
}) => {
  return `https://github.com/${githubRepositoryOwner}/${githubRepositoryName}/releases/tag/${githubReleaseName}`;
};

const getOptionsFromGithubAction = () => {
  const eventName = process.env.GITHUB_EVENT_NAME;

  if (!eventName) {
    throw new Error(`missing process.env.GITHUB_EVENT_NAME, we are not in a github action`);
  }

  if (eventName !== "push") {
    throw new Error(`getOptionsFromGithubAction must be called only in a push action`);
  }

  const githubRepository = process.env.GITHUB_REPOSITORY;

  if (!githubRepository) {
    throw new Error(`missing process.env.GITHUB_REPOSITORY`);
  }

  const [githubRepositoryOwner, githubRepositoryName] = githubRepository.split("/");
  const githubToken = process.env.GITHUB_TOKEN;

  if (!githubToken) {
    throw new Error(`missing process.env.GITHUB_TOKEN`);
  }

  const githubSha = process.env.GITHUB_SHA;

  if (!githubSha) {
    throw new Error(`missing process.env.GITHUB_SHA`);
  }

  return {
    githubRepositoryOwner,
    githubRepositoryName,
    githubToken,
    githubSha
  };
};

const getOptionsFromProjectPackage = async ({
  projectDirectoryUrl
}) => {
  const projectPackage = await readProjectPackage({
    projectDirectoryUrl
  });
  return {
    packageVersion: projectPackage.version
  };
};

exports.ensureGithubReleaseForPackage = ensureGithubReleaseForPackage;

//# sourceMappingURL=jsenv_publish_node_package.cjs.map