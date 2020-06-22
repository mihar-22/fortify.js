const parser = require('git-log-parser'); // eslint-disable-line

// This hack allows us to use semantic-release for a monorepo.
// https://github.com/semantic-release/semantic-release/issues/193#issuecomment-578436666
parser.parse = (parse => (config, options) => {
  if (Array.isArray(config._)) {
    config._.push(options.cwd);
  } else if (config._) {
    config._ = [config._, options.cwd];
  } else {
    config._ = options.cwd;
  }
  return parse(config, options);
})(parser.parse);

module.exports = {
  tagFormat: `${process.env.npm_package_name}@\${version}`,
  verifyConditions: [
    '@semantic-release/changelog',
    '@semantic-release/npm',
    '@semantic-release/git',
    '@semantic-release/github'
  ],
  prepare: [
    {
      path: '@semantic-release/changelog',
      changelogTitle: '# Change Log\n\nAll notable changes to this project will be documented in this file.'
    },
    '@semantic-release/npm',
    {
      path: '@semantic-release/git',
      message: `chore(release): ${process.env.npm_package_name}@\${nextRelease.version} [skip ci]`
    }
  ],
  success: []
};
