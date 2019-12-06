'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var url$1 = require('url');
var fs = require('fs');

// eslint-disable-next-line consistent-return
var arrayWithHoles = (function (arr) {
  if (Array.isArray(arr)) return arr;
});

var iterableToArrayLimit = (function (arr, i) {
  // this is an expanded form of \`for...of\` that properly supports abrupt completions of
  // iterators etc. variable names have been minimised to reduce the size of this massive
  // helper. sometimes spec compliance is annoying :(
  //
  // _n = _iteratorNormalCompletion
  // _d = _didIteratorError
  // _e = _iteratorError
  // _i = _iterator
  // _s = _step
  if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
    return;
  }

  var _arr = [];
  var _n = true;
  var _d = false;

  var _e;

  var _i = arr[Symbol.iterator]();

  var _s;

  try {
    for (; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i.return !== null) _i.return();
    } finally {
      if (_d) throw _e;
    }
  } // eslint-disable-next-line consistent-return


  return _arr;
});

var nonIterableRest = (function () {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
});

var _slicedToArray = (function (arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || nonIterableRest();
});

var LOG_LEVEL_OFF = "off";
var LOG_LEVEL_DEBUG = "debug";
var LOG_LEVEL_INFO = "info";
var LOG_LEVEL_WARN = "warn";
var LOG_LEVEL_ERROR = "error";

var createLogger = function createLogger() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$logLevel = _ref.logLevel,
      logLevel = _ref$logLevel === void 0 ? LOG_LEVEL_INFO : _ref$logLevel;

  if (logLevel === LOG_LEVEL_DEBUG) {
    return {
      debug: debug,
      info: info,
      warn: warn,
      error: error
    };
  }

  if (logLevel === LOG_LEVEL_INFO) {
    return {
      debug: debugDisabled,
      info: info,
      warn: warn,
      error: error
    };
  }

  if (logLevel === LOG_LEVEL_WARN) {
    return {
      debug: debugDisabled,
      info: infoDisabled,
      warn: warn,
      error: error
    };
  }

  if (logLevel === LOG_LEVEL_ERROR) {
    return {
      debug: debugDisabled,
      info: infoDisabled,
      warn: warnDisabled,
      error: error
    };
  }

  if (logLevel === LOG_LEVEL_OFF) {
    return {
      debug: debugDisabled,
      info: infoDisabled,
      warn: warnDisabled,
      error: errorDisabled
    };
  }

  throw new Error(createUnexpectedLogLevelMessage({
    logLevel: logLevel
  }));
};

var createUnexpectedLogLevelMessage = function createUnexpectedLogLevelMessage(_ref2) {
  var logLevel = _ref2.logLevel;
  return "unexpected logLevel.\n--- logLevel ---\n".concat(logLevel, "\n--- allowed log levels ---\n").concat(LOG_LEVEL_OFF, "\n").concat(LOG_LEVEL_ERROR, "\n").concat(LOG_LEVEL_WARN, "\n").concat(LOG_LEVEL_INFO, "\n").concat(LOG_LEVEL_DEBUG, "\n");
};

var debug = console.debug;

var debugDisabled = function debugDisabled() {};

var info = console.info;

var infoDisabled = function infoDisabled() {};

var warn = console.warn;

var warnDisabled = function warnDisabled() {};

var error = console.error;

var errorDisabled = function errorDisabled() {};

var resolveUrl = function resolveUrl(value, baseUrl) {
  return String(new URL(value, baseUrl));
};
var filePathToUrl = function filePathToUrl(path) {
  return String(url$1.pathToFileURL(path));
};
var urlToFilePath = function urlToFilePath(url) {
  return url$1.fileURLToPath(url);
};
var hasScheme = function hasScheme(string) {
  return /^[a-zA-Z]{2,}:/.test(string);
};

function _await(value, then, direct) {
  if (direct) {
    return then ? then(value) : value;
  }

  if (!value || !value.then) {
    value = Promise.resolve(value);
  }

  return then ? value.then(then) : value;
}

function _catch(body, recover) {
  try {
    var result = body();
  } catch (e) {
    return recover(e);
  }

  if (result && result.then) {
    return result.then(void 0, recover);
  }

  return result;
}

function _continue(value, then) {
  return value && value.then ? value.then(then) : then(value);
}

function _async(f) {
  return function () {
    for (var args = [], i = 0; i < arguments.length; i++) {
      args[i] = arguments[i];
    }

    try {
      return Promise.resolve(f.apply(this, args));
    } catch (e) {
      return Promise.reject(e);
    }
  };
}

var readProjectPackage = _async(function (_ref) {
  var projectDirectoryUrl = _ref.projectDirectoryUrl;
  var packageFileUrl = resolveUrl("./package.json", projectDirectoryUrl);
  var packageFilePath = urlToFilePath(packageFileUrl);
  var packageInProject;
  return _continue(_catch(function () {
    return _await(new Promise(function (resolve, reject) {
      fs.readFile(packageFilePath, function (error, buffer) {
        if (error) {
          reject(error);
        } else {
          resolve(buffer);
        }
      });
    }), function (packageBuffer) {
      var packageString = String(packageBuffer);

      try {
        packageInProject = JSON.parse(packageString);
      } catch (e) {
        if (e.name === "SyntaxError") {
          throw new Error("syntax error while parsing project package.json\n--- syntax error stack ---\n".concat(e.stack, "\n--- package.json path ---\n").concat(packageFilePath));
        }

        throw e;
      }
    });
  }, function (e) {
    if (e.code === "ENOENT") {
      throw new Error("cannot find project package.json\n--- package.json path ---\n".concat(packageFilePath));
    }

    throw e;
  }), function (_result) {
    return  packageInProject;
  });
});

// eslint-disable-next-line import/no-unresolved
var nodeRequire = require;
var filenameContainsBackSlashes = __filename.indexOf("\\") > -1;
var url = filenameContainsBackSlashes ? "file://".concat(__filename.replace(/\\/g, "/")) : "file://".concat(__filename);

function _await$1(value, then, direct) {
  if (direct) {
    return then ? then(value) : value;
  }

  if (!value || !value.then) {
    value = Promise.resolve(value);
  }

  return then ? value.then(then) : value;
}

// https://developer.github.com/v3/git/refs/#get-a-single-reference
var fetch = nodeRequire("node-fetch");

function _invoke(body, then) {
  var result = body();

  if (result && result.then) {
    return result.then(then);
  }

  return then(result);
}

function _async$1(f) {
  return function () {
    for (var args = [], i = 0; i < arguments.length; i++) {
      args[i] = arguments[i];
    }

    try {
      return Promise.resolve(f.apply(this, args));
    } catch (e) {
      return Promise.reject(e);
    }
  };
}

var getGithubRelease = _async$1(function (_ref) {
  var githubToken = _ref.githubToken,
      githubRepositoryOwner = _ref.githubRepositoryOwner,
      githubRepositoryName = _ref.githubRepositoryName,
      githubReleaseName = _ref.githubReleaseName;
  var requestUrl = "https://api.github.com/repos/".concat(githubRepositoryOwner, "/").concat(githubRepositoryName, "/git/ref/tags/").concat(githubReleaseName);
  return _await$1(fetch(requestUrl, {
    headers: {
      authorization: "token ".concat(githubToken)
    },
    method: "GET"
  }), function (response) {
    var responseStatus = response.status;
    return responseStatus === 404 ? null : _invoke(function () {
      if (responseStatus !== 200) {
        return _await$1(response.text(), function (_response$text) {
          throw new Error(writeUnexpectedResponseStatus({
            requestUrl: requestUrl,
            responseStatus: responseStatus,
            responseText: _response$text
          }));
        });
      }
    }, function (_result) {
      return  _await$1(response.json());
    });
  });
});

var writeUnexpectedResponseStatus = function writeUnexpectedResponseStatus(_ref2) {
  var requestUrl = _ref2.requestUrl,
      responseStatus = _ref2.responseStatus,
      responseText = _ref2.responseText;
  return "github api response status should be 200.\n--- request url ----\n".concat(requestUrl, "\n--- response status ---\n").concat(responseStatus, "\n--- response text ---\n").concat(responseText);
};

function _await$2(value, then, direct) {
  if (direct) {
    return then ? then(value) : value;
  }

  if (!value || !value.then) {
    value = Promise.resolve(value);
  }

  return then ? value.then(then) : value;
}

// https://developer.github.com/v3/git/tags/
var fetch$1 = nodeRequire("node-fetch");

function _invoke$1(body, then) {
  var result = body();

  if (result && result.then) {
    return result.then(then);
  }

  return then(result);
}

function _async$2(f) {
  return function () {
    for (var args = [], i = 0; i < arguments.length; i++) {
      args[i] = arguments[i];
    }

    try {
      return Promise.resolve(f.apply(this, args));
    } catch (e) {
      return Promise.reject(e);
    }
  };
}

var createGithubRelease = _async$2(function (_ref) {
  var githubToken = _ref.githubToken,
      githubRepositoryOwner = _ref.githubRepositoryOwner,
      githubRepositoryName = _ref.githubRepositoryName,
      githubSha = _ref.githubSha,
      githubReleaseName = _ref.githubReleaseName;
  var requestUrl = "https://api.github.com/repos/".concat(githubRepositoryOwner, "/").concat(githubRepositoryName, "/git/refs");
  var body = JSON.stringify({
    ref: "refs/tags/".concat(githubReleaseName),
    sha: githubSha
  });
  return _await$2(fetch$1(requestUrl, {
    headers: {
      "authorization": "token ".concat(githubToken),
      "content-length": Buffer.byteLength(body)
    },
    method: "POST",
    body: body
  }), function (response) {
    var responseStatus = response.status;
    return _invoke$1(function () {
      if (responseStatus !== 201) {
        return _await$2(response.text(), function (_response$text) {
          throw new Error(writeUnexpectedResponseStatus$1({
            requestUrl: requestUrl,
            responseStatus: responseStatus,
            responseText: _response$text
          }));
        });
      }
    }, function (_result) {
      return  _await$2(response.json());
    });
  });
});

var writeUnexpectedResponseStatus$1 = function writeUnexpectedResponseStatus(_ref2) {
  var requestUrl = _ref2.requestUrl,
      responseStatus = _ref2.responseStatus,
      responseText = _ref2.responseText;
  return "github api response status should be 201.\n--- request url ----\n".concat(requestUrl, "\n--- response status ---\n").concat(responseStatus, "\n--- response text ---\n").concat(responseText);
};

function _await$3(value, then, direct) {
  if (direct) {
    return then ? then(value) : value;
  }

  if (!value || !value.then) {
    value = Promise.resolve(value);
  }

  return then ? value.then(then) : value;
}

function _async$3(f) {
  return function () {
    for (var args = [], i = 0; i < arguments.length; i++) {
      args[i] = arguments[i];
    }

    try {
      return Promise.resolve(f.apply(this, args));
    } catch (e) {
      return Promise.reject(e);
    }
  };
}

var ensureGithubReleaseForPackageVersion = _async$3(function (_ref) {
  var projectDirectoryUrl = _ref.projectDirectoryUrl,
      logLevel = _ref.logLevel;
  var logger = createLogger({
    logLevel: logLevel
  });
  logger.debug("autoReleaseOnGithub(".concat(JSON.stringify({
    projectDirectoryUrl: projectDirectoryUrl,
    logLevel: logLevel
  }, null, "  "), ")"));
  projectDirectoryUrl = normalizeProjectDirectoryUrl(projectDirectoryUrl);

  var _getOptionsFromGithub = getOptionsFromGithubAction(),
      githubToken = _getOptionsFromGithub.githubToken,
      githubRepositoryOwner = _getOptionsFromGithub.githubRepositoryOwner,
      githubRepositoryName = _getOptionsFromGithub.githubRepositoryName,
      githubSha = _getOptionsFromGithub.githubSha;

  logger.debug("reading project package.json");
  return _await$3(getOptionsFromProjectPackage({
    projectDirectoryUrl: projectDirectoryUrl
  }), function (_ref2) {
    var packageVersion = _ref2.packageVersion;
    logger.debug("".concat(packageVersion, " found in package.json"));
    logger.debug("search release for ".concat(packageVersion, " on github"));
    var githubReleaseName = "v".concat(packageVersion);
    return _await$3(getGithubRelease({
      githubToken: githubToken,
      githubRepositoryOwner: githubRepositoryOwner,
      githubRepositoryName: githubRepositoryName,
      githubReleaseName: githubReleaseName
    }), function (existingRelease) {
      if (existingRelease) {
        logger.info("".concat(packageVersion, " already released at ").concat(generateReleaseUrl({
          githubRepositoryOwner: githubRepositoryOwner,
          githubRepositoryName: githubRepositoryName,
          githubReleaseName: githubReleaseName
        })));
        return;
      }

      logger.info("creating release for ".concat(packageVersion));
      return _await$3(createGithubRelease({
        githubToken: githubToken,
        githubRepositoryOwner: githubRepositoryOwner,
        githubRepositoryName: githubRepositoryName,
        githubSha: githubSha,
        githubReleaseName: githubReleaseName
      }), function () {
        logger.info("release created at ".concat(generateReleaseUrl({
          githubRepositoryOwner: githubRepositoryOwner,
          githubRepositoryName: githubRepositoryName,
          githubReleaseName: githubReleaseName
        })));
      });
    });
  });
});

var normalizeProjectDirectoryUrl = function normalizeProjectDirectoryUrl(value) {
  if (value instanceof URL) {
    value = value.href;
  }

  if (typeof value === "string") {
    var url = hasScheme(value) ? value : filePathToUrl(value);

    if (!url.startsWith("file://")) {
      throw new Error("projectDirectoryUrl must starts with file://, received ".concat(value));
    }

    return ensureTrailingSlash(value);
  }

  throw new TypeError("projectDirectoryUrl must be a string or an url, received ".concat(value));
};

var ensureTrailingSlash = function ensureTrailingSlash(string) {
  return string.endsWith("/") ? string : "".concat(string, "/");
};

var generateReleaseUrl = function generateReleaseUrl(_ref3) {
  var githubRepositoryOwner = _ref3.githubRepositoryOwner,
      githubRepositoryName = _ref3.githubRepositoryName,
      githubReleaseName = _ref3.githubReleaseName;
  return "https://github.com/".concat(githubRepositoryOwner, "/").concat(githubRepositoryName, "/releases/tag/").concat(githubReleaseName);
};

var getOptionsFromGithubAction = function getOptionsFromGithubAction() {
  var eventName = process.env.GITHUB_EVENT_NAME;

  if (!eventName) {
    throw new Error("missing process.env.GITHUB_EVENT_NAME, we are not in a github action");
  }

  if (eventName !== "push") {
    throw new Error("getOptionsFromGithubAction must be called only in a push action");
  }

  var githubRepository = process.env.GITHUB_REPOSITORY;

  if (!githubRepository) {
    throw new Error("missing process.env.GITHUB_REPOSITORY");
  }

  var _githubRepository$spl = githubRepository.split("/"),
      _githubRepository$spl2 = _slicedToArray(_githubRepository$spl, 2),
      githubRepositoryOwner = _githubRepository$spl2[0],
      githubRepositoryName = _githubRepository$spl2[1];

  var githubToken = process.env.GITHUB_TOKEN;

  if (!githubToken) {
    throw new Error("missing process.env.GITHUB_TOKEN");
  }

  var githubSha = process.env.GITHUB_SHA;

  if (!githubSha) {
    throw new Error("missing process.env.GITHUB_SHA");
  }

  return {
    githubRepositoryOwner: githubRepositoryOwner,
    githubRepositoryName: githubRepositoryName,
    githubToken: githubToken,
    githubSha: githubSha
  };
};

var getOptionsFromProjectPackage = _async$3(function (_ref4) {
  var projectDirectoryUrl = _ref4.projectDirectoryUrl;
  return _await$3(readProjectPackage({
    projectDirectoryUrl: projectDirectoryUrl
  }), function (projectPackage) {
    return {
      packageVersion: projectPackage.version
    };
  });
});

exports.ensureGithubReleaseForPackageVersion = ensureGithubReleaseForPackageVersion;
//# sourceMappingURL=main.js.map
