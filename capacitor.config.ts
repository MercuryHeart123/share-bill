import type { CapacitorConfig } from "@capacitor/cli";
import { KeyboardResize } from "@capacitor/keyboard";
const config: CapacitorConfig = {
  appId: "io.ionic.starter",
  appName: "photo-gallery",
  webDir: "dist",
  plugins: {
    Keyboard: {
      resize: KeyboardResize.Ionic,
    },
  },
};

export default config;
