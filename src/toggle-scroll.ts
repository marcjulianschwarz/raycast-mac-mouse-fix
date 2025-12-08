import { showHUD, closeMainWindow } from "@raycast/api";
import { configExists, isHelperRunning, restartHelper, toggleConfigValue, CONFIG_TOGGLES } from "./utils/config";

export default async function toggleScroll() {
  try {
    await closeMainWindow();

    if (!configExists()) {
      await showHUD("Config file not found. Please run Mac Mouse Fix at least once.");
      return;
    }

    const toggle = CONFIG_TOGGLES.scroll;
    const { newState } = toggleConfigValue(toggle.key);
    const message = newState === "enabled" ? toggle.enabledMessage : toggle.disabledMessage;

    if (isHelperRunning()) {
      restartHelper();

      await showHUD(message);
    } else {
      await showHUD(`${message} (start the app to apply changes)`);
    }
  } catch (error) {
    await showHUD(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
