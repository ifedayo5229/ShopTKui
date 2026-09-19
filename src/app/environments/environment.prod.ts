// Production settings. Angular substitutes this for environment.ts in a production build
// (fileReplacements in angular.json). Nothing should import this file directly.
export const environment = {
  production: true,

  // The deployed API. A localhost value here resolves to each visitor's own machine rather
  // than the server, so every request fails for everyone except whoever is sitting at the
  // box - which is exactly how it looks working locally and broken in production.
  //
  // HTTPS, not the raw IP over plain HTTP: the site is served over HTTPS, and a browser
  // blocks plain-HTTP calls from an HTTPS page as mixed content. The app would load and
  // every request would fail silently.
  apiUrl: 'https://api.shoptk.org/api',

  // Base URL for documents and uploaded images, used as `${docApiUrl}api/...` and
  // `${docApiUrl}/uploads/...`, so the trailing slash matters.
  docApiUrl: 'https://api.shoptk.org/',

  // Public keys only. Secret keys stay on the backend.
  payment: {
    paystack: {
      publicKey: 'pk_test_3d4338c102806f032c97a3d585b325c6e09811aa',
      enabled: true
    },
    flutterwave: {
      publicKey: 'FLWPUBK_TEST-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      enabled: true
    },
    stripe: {
      publicKey: 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      enabled: false
    }
  }
};
