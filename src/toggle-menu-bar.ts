import { showHUD, closeMainWindow } from "@raycast/api";
import { configExists, isHelperRunning, reloadHelper, toggleConfigValue, CONFIG_TOGGLES } from "./utils/config";

export default async function toggleMenuBar() {
  try {
    await closeMainWindow();

    if (!configExists()) {
      await showHUD("Config file not found. Please run Mac Mouse Fix at least once.");
      return;
    }

    const toggle = CONFIG_TOGGLES.menuBarItem;
    const { newState } = toggleConfigValue(toggle.key);
    const message = newState === "enabled" ? toggle.enabledMessage : toggle.disabledMessage;

    if (isHelperRunning()) {
      reloadHelper();

      await showHUD(message);
    } else {
      await showHUD(`${message} (start the app to apply changes)`);
    }
  } catch (error) {
    await showHUD(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
