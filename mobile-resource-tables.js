
// https://docs.meteor.com/api/mobile-config.html#App-icons
const ICON_RESOURCE_TABLE = {
  app_store: '1024x1024',
  iphone_2x: '120x120',
  iphone_3x: '180x180',
  ipad_2x: '152x152',
  ipad_pro: '167x167',
  ios_settings_2x: '58x58',
  ios_settings_3x: '87x87',
  ios_spotlight_2x: '80x80',
  ios_spotlight_3x: '120x120',
  ios_notification_2x: '40x40',
  ios_notification_3x: '60x60',
  ipad: '76x76',
  ios_settings: '29x29',
  ios_spotlight: '40x40',
  ios_notification: '20x20',
  iphone_legacy: '57x57',
  iphone_legacy_2x: '114x114',
  ipad_spotlight_legacy: '50x50',
  ipad_spotlight_legacy_2x: '100x100',
  ipad_app_legacy: '72x72',
  ipad_app_legacy_2x: '144x144',
  android_mdpi: '48x48',
  android_hdpi: '72x72',
  android_xhdpi: '96x96',
  android_xxhdpi: '144x144',
  android_xxxhdpi: '192x192'
}

// https://docs.meteor.com/api/mobile-config.html#App-launchScreens
const LAUNCH_SCREEN_RESOURCE_TABLE = {
  iphone5: '640x1136',
  iphone6: '750x1334',
  iphone6p_portrait: '1242x2208',
  iphone6p_landscape: '2208x1242',
  iphoneX_portrait: '1125x2436',
  iphoneX_landscape: '2436x1125',
  ipad_portrait_2x: '1536x2048',
  ipad_landscape_2x: '2048x1536',
  iphone: '320x480',
  iphone_2x: '640x960',
  ipad_portrait: '768x1024',
  ipad_landscape: '1024x768',
  android_mdpi_portrait: '320x480',
  android_mdpi_landscape: '480x320',
  android_hdpi_portrait: '480x800',
  android_hdpi_landscape: '800x480',
  android_xhdpi_portrait: '720x1280',
  android_xhdpi_landscape: '1280x720',
  android_xxhdpi_portrait: '960x1600',
  android_xxhdpi_landscape: '1600x960',
  android_xxxhdpi_portrait: '1280x1920',
  android_xxxhdpi_landscape: '1920x1280'
}

module.exports = {
  ICON_RESOURCE_TABLE,
  LAUNCH_SCREEN_RESOURCE_TABLE
}
