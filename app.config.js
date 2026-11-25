const fs = require('node:fs');
const path = require('node:path');

module.exports = ({ config }) => {
  const android = { ...(config.android || {}) };
  const localGoogleServices = path.resolve(__dirname, 'google-services.json');
  const googleServicesFile = process.env.GOOGLE_SERVICES_JSON
    || (fs.existsSync(localGoogleServices) ? './google-services.json' : undefined);

  if (googleServicesFile) android.googleServicesFile = googleServicesFile;
  if (process.env.ANDROID_PACKAGE_NAME) android.package = process.env.ANDROID_PACKAGE_NAME;

  return { ...config, android };
};
