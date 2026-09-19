// Development settings.
//
// Angular swaps this file for environment.prod.ts at build time via the fileReplacements
// entry in angular.json's production configuration. Always import from this file - importing
// environment.prod.ts directly bypasses the swap, which is how half the app previously ended
// up reading a different config from the other half.
export const environment = {
  production: false,

  // Local API over IIS Express. The deployed origin lives in environment.prod.ts.
  apiUrl: 'https://localhost:44318/api',

  // Base URL for documents and uploaded images, used as `${docApiUrl}api/...` and
  // `${docApiUrl}/uploads/...`, so the trailing slash matters.
  docApiUrl: 'https://localhost:44318/',

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
