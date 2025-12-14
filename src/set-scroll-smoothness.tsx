import { List, Action, ActionPanel, Icon, Color, showHUD } from "@raycast/api";
import { useState } from "react";
import {
  configExists,
  isHelperRunning,
  reloadHelper,
  setConfigValue,
  getConfigValue,
  SCROLL_SMOOTHNESS_KEY,
  SCROLL_SMOOTHNESS_LEVELS,
  ScrollSmoothness,
} from "./utils/config";

const SMOOTHNESS_CONFIG: Record<ScrollSmoothness, { icon: Icon; color: Color; title: string; subtitle: string }> = {
  off: {
    icon: Icon.XMarkCircle,
    color: Color.Red,
    title: "Off",
    subtitle: "No scroll smoothing applied",
  },
  regular: {
    icon: Icon.Circle,
    color: Color.Blue,
    title: "Regular",
    subtitle: "Balanced smoothness for everyday use",
  },
  high: {
    icon: Icon.CheckCircle,
    color: Color.Green,
    title: "High",
    subtitle: "Maximum smoothness for fluid scrolling",
  },
};

export default function SetScrollSmoothness() {
  if (!configExists()) {
    showHUD("Config file not found. Please run Mac Mouse Fix at least once.");
    return null;
  }

  const [currentValue, setCurrentValue] = useState<ScrollSmoothness>(
    getConfigValue(SCROLL_SMOOTHNESS_KEY) as ScrollSmoothness,
  );

  function handleSelection(value: ScrollSmoothness) {
    // Optimistically update the UI
    setCurrentValue(value);

    // Then perform the actual update
    setConfigValue(SCROLL_SMOOTHNESS_KEY, value);

    if (isHelperRunning()) {
      reloadHelper();
    }
  }

  return (
    <List>
      {SCROLL_SMOOTHNESS_LEVELS.map((level) => {
        const config = SMOOTHNESS_CONFIG[level];
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
