import { List, Action, ActionPanel, Icon, Color, showHUD } from "@raycast/api";
import { useState } from "react";
import {
  configExists,
  isHelperRunning,
  reloadHelper,
  setConfigValue,
  getConfigValue,
  SCROLL_SPEED_KEY,
  SCROLL_SPEED_LEVELS,
  ScrollSpeed,
} from "./utils/config";

const SPEED_CONFIG: Record<ScrollSpeed, { icon: Icon; color: Color; title: string; subtitle: string }> = {
  system: {
    icon: Icon.ComputerChip,
    color: Color.Purple,
    title: "System",
    subtitle: "Use macOS default scroll speed",
  },
  low: {
    icon: Icon.ChevronDown,
    color: Color.Blue,
    title: "Low",
    subtitle: "Slower scrolling for precise control",
  },
  medium: {
    icon: Icon.Circle,
    color: Color.Orange,
    title: "Medium",
    subtitle: "Balanced scroll speed",
  },
  high: {
    icon: Icon.ChevronUp,
    color: Color.Red,
    title: "High",
    subtitle: "Faster scrolling for quick navigation",
  },
};

export default function SetScrollSpeed() {
  if (!configExists()) {
    showHUD("Config file not found. Please run Mac Mouse Fix at least once.");
    return null;
  }

  const [currentValue, setCurrentValue] = useState<ScrollSpeed>(getConfigValue(SCROLL_SPEED_KEY) as ScrollSpeed);

  function handleSelection(value: ScrollSpeed) {
    // Optimistically update the UI
    setCurrentValue(value);

    // Then perform the actual update
    setConfigValue(SCROLL_SPEED_KEY, value);

    if (isHelperRunning()) {
      reloadHelper();
    }
  }

  return (
    <List>
      {SCROLL_SPEED_LEVELS.map((level) => {
        const config = SPEED_CONFIG[level];
        const isCurrent = currentValue === level;

        return (
          <List.Item
            key={level}
            icon={{ source: config.icon, tintColor: config.color }}
            title={config.title}
            subtitle={config.subtitle}
            accessories={[
              {
                icon: isCurrent ? { source: Icon.Checkmark, tintColor: Color.Green } : undefined,
                text: isCurrent ? "Current" : undefined,
              },
            ]}
            actions={
              <ActionPanel>
                <Action title={`Set to ${config.title}`} onAction={() => handleSelection(level)} />
              </ActionPanel>
            }
          />
        );
      })}
    </List>
  );
}
