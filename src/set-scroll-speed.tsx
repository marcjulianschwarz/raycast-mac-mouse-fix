import { List, Action, ActionPanel, showHUD, closeMainWindow } from "@raycast/api";
import {
  configExists,
  isHelperRunning,
  restartHelper,
  setConfigValue,
  getConfigValue,
  SCROLL_SPEED_KEY,
  SCROLL_SPEED_LEVELS,
  ScrollSpeed,
} from "./utils/config";

export default function SetScrollSpeed() {
  if (!configExists()) {
    showHUD("Config file not found. Please run Mac Mouse Fix at least once.");
    return null;
  }

  const currentValue = getConfigValue(SCROLL_SPEED_KEY);

  async function handleSelection(value: ScrollSpeed) {
    await closeMainWindow();

    setConfigValue(SCROLL_SPEED_KEY, value);

    if (isHelperRunning()) {
      restartHelper();

      await showHUD(`Scroll speed: ${value}`);
    } else {
      await showHUD(`Scroll speed: ${value} (start the app to apply changes)`);
    }
  }

  return (
    <List>
      {SCROLL_SPEED_LEVELS.map((level) => (
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
