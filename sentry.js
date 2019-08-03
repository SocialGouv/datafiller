// sentry for the server

const Sentry = require("@sentry/node");
const SentryIntegrations = require("@sentry/integrations");

module.exports = (release = process.env.SENTRY_RELEASE) => {
  const sentryOptions = {
    dsn: process.env.SENTRY_DSN,
    release,
    maxBreadcrumbs: 50,
    attachStacktrace: true
  };

  // When we're developing locally
  if (process.env.NODE_ENV !== "production") {
    /* eslint-disable-next-line global-require */
    const sentryTestkit = require("sentry-testkit");
    const { sentryTransport } = sentryTestkit();

    // Don't actually send the errors to Sentry
    sentryOptions.transport = sentryTransport;

    // Instead, dump the errors to the console
    sentryOptions.integrations = [
      new SentryIntegrations.Debug({
        // Trigger DevTools debugger instead of using console.log
        debugger: false
      })
    ];
  }

  Sentry.init(sentryOptions);

  return {
    Sentry,
    captureException: (err, ctx) => {
      Sentry.configureScope(scope => {
        if (err.message) {
          // De-duplication currently doesn't work correctly for SSR / browser errors
          // so we force deduplication by error message if it is present
          scope.setFingerprint([err.message]);
        }

        if (err.statusCode) {
          scope.setExtra("statusCode", err.statusCode);
        }

        if (ctx) {
          const { req, res, errorInfo } = ctx;

          if (res && res.statusCode) {
            scope.setExtra("statusCode", res.statusCode);
          }

          scope.setTag("ssr", true);
          scope.setExtra("url", req.url);
          scope.setExtra("method", req.method);
          scope.setExtra("headers", req.headers);
          scope.setExtra("params", req.params);
          scope.setExtra("query", req.query);

          // On server-side we take session cookie directly from request
          if (req.cookies.sid) {
            scope.setUser({ id: req.cookies.sid });
          }

          if (errorInfo) {
            Object.keys(errorInfo).forEach(key =>
              scope.setExtra(key, errorInfo[key])
            );
          }
        }
      });

      return Sentry.captureException(err);
    }
  };
};
