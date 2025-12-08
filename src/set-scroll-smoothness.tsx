import { List, Action, ActionPanel, showHUD, closeMainWindow } from "@raycast/api";
import {
  configExists,
  isHelperRunning,
  restartHelper,
  setConfigValue,
  getConfigValue,
  SCROLL_SMOOTHNESS_KEY,
  SCROLL_SMOOTHNESS_LEVELS,
  ScrollSmoothness,
} from "./utils/config";

export default function SetScrollSmoothness() {
  if (!configExists()) {
    showHUD("Config file not found. Please run Mac Mouse Fix at least once.");
    return null;
  }

  const currentValue = getConfigValue(SCROLL_SMOOTHNESS_KEY);

  async function handleSelection(value: ScrollSmoothness) {
    await closeMainWindow();

    setConfigValue(SCROLL_SMOOTHNESS_KEY, value);

    if (isHelperRunning()) {
      restartHelper();

      await showHUD(`Scroll smoothness: ${value}`);
    } else {
      await showHUD(`Scroll smoothness: ${value} (start the app to apply changes)`);
    }
  }

  return (
    <List>
      {SCROLL_SMOOTHNESS_LEVELS.map((level) => (
        <List.Item
          key={level}
          title={level}
          accessories={[{ text: currentValue === level ? "Current" : "" }]}
          actions={
            <ActionPanel>
              <Action title="Select" onAction={() => handleSelection(level)} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
