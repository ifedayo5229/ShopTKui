// Production settings. Angular substitutes this for environment.ts in a production build
// (fileReplacements in angular.json). Nothing should import this file directly.
export const environment = {
  production: true,

  // The deployed API. A localhost value here resolves to each visitor's own machine rather
  // than the server, so every request fails for everyone except whoever is sitting at the
  // box - which is exactly how it looks working locally and broken in production.
  //
  // Swap to https://api.yourdomain.com/api once DNS and certificates are in place, and
  // update the API's "cors" setting to match this origin.
  apiUrl: 'http://63.250.58.113:8080/api',

  // Base URL for documents and uploaded images, used as `${docApiUrl}api/...` and
  // `${docApiUrl}/uploads/...`, so the trailing slash matters.
  docApiUrl: 'http://63.250.58.113:8080/',

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
