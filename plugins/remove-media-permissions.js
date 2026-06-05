const { withAndroidManifest } = require("@expo/config-plugins");

module.exports = function removeMediaPermissions(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults;

    manifest.manifest["uses-permission"] = (
      manifest.manifest["uses-permission"] || []
    ).filter((perm) => {
      const name = perm.$["android:name"];
      return ![
        "android.permission.READ_MEDIA_IMAGES",
        "android.permission.READ_MEDIA_VIDEO",
        "android.permission.READ_MEDIA_AUDIO",
        "android.permission.READ_MEDIA_VISUAL_USER_SELECTED",
        "android.permission.ACCESS_MEDIA_LOCATION",
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE",
      ].includes(name);
    });

    return config;
  });
};
