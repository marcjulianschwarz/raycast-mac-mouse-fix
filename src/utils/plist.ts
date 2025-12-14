import { execSync } from "child_process";
import { homedir } from "os";
import { existsSync } from "fs";

const CONFIG_FILE = `${homedir()}/Library/Application Support/com.nuebling.mac-mouse-fix/config.plist`;
const PLIST_BUDDY = "/usr/libexec/PlistBuddy";

export function configExists(): boolean {
  return existsSync(CONFIG_FILE);
}

export function readPlistValue(key: string): string {
  try {
    const result = execSync(`"${PLIST_BUDDY}" -c "Print :${key}" "${CONFIG_FILE}"`, {
      encoding: "utf-8",
    });
    return result.trim();
  } catch (error) {
    console.log(error);
    throw new Error(`Could not read ${key} from config file`);
  }
}

export function setPlistValue(key: string, value: string): void {
  try {
    execSync(`"${PLIST_BUDDY}" -c "Set :${key} ${value}" "${CONFIG_FILE}"`, {
      stdio: "ignore",
    });
  } catch (error) {
    console.log(error);
    throw new Error(`Could not set ${key} in config file`);
  }
}
