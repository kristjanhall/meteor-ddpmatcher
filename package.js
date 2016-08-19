Package.describe({
  name: 'kristjanhall:ddpmatcher',
  version: '0.1.0',
  summary: '',
  git: '',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.4.0.1');
  api.use('ecmascript');
  api.mainModule('ddpmatcher.js', 'client');

  api.export('DDPMatcher');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('kristjanhall:ddpmatcher');
  api.mainModule('ddpmatcher-tests.js');
});
