const { withAndroidManifest } = require("@expo/config-plugins");

// These permissions are not used by this app:
// - Media/storage: app uses Android 13+ system photo picker (no permission needed)
// - Camera: app only picks from library, never launches camera
// - Record audio: app plays video but never records audio or video
const BLOCKED_PERMISSIONS = [
  "android.permission.READ_MEDIA_IMAGES",
  "android.permission.READ_MEDIA_VIDEO",
  "android.permission.READ_MEDIA_AUDIO",
  "android.permission.READ_MEDIA_VISUAL_USER_SELECTED",
  "android.permission.ACCESS_MEDIA_LOCATION",
  "android.permission.READ_EXTERNAL_STORAGE",
  "android.permission.WRITE_EXTERNAL_STORAGE",
  "android.permission.CAMERA",
  "android.permission.RECORD_AUDIO",
];

function filterPermissions(perms) {
  return (perms || []).filter(
    (perm) => !BLOCKED_PERMISSIONS.includes(perm.$["android:name"])
  );
}

module.exports = function removeUnusedPermissions(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;

    // Filter both element types — newer Android/Expo uses uses-permission-sdk-23
    // for permissions introduced after a specific API level (e.g. READ_MEDIA_IMAGES @ API 33)
    manifest["uses-permission"] = filterPermissions(manifest["uses-permission"]);
    manifest["uses-permission-sdk-23"] = filterPermissions(manifest["uses-permission-sdk-23"]);

    return config;
  });
};
