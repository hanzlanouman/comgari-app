import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";

const FS = FileSystem as any;

const LOG_FILE_URI = `${FS.documentDirectory}comgari-debug.log`;
const MAX_LOG_SIZE_BYTES = 200 * 1024;

const appendLine = async (line: string): Promise<void> => {
  try {
    const info = await FS.getInfoAsync(LOG_FILE_URI);
    let existing = info.exists ? await FS.readAsStringAsync(LOG_FILE_URI) : "";

    if (info.exists && info.size > MAX_LOG_SIZE_BYTES) {
      existing = existing.slice(existing.length / 2);
    }

    await FS.writeAsStringAsync(LOG_FILE_URI, `${existing}${line}\n`);
  } catch (error) {
    console.error("logger: failed to write log line", error);
  }
};

export const logEvent = (tag: string, data?: unknown): void => {
  const timestamp = new Date().toISOString();
  const dataStr =
    data !== undefined
      ? (() => {
          try {
            return ` ${JSON.stringify(data)}`;
          } catch {
            return ` ${String(data)}`;
          }
        })()
      : "";
  const line = `[${timestamp}] [${Platform.OS}] ${tag}${dataStr}`;

  console.log(line);
  appendLine(line);
};

export const exportLogs = async (): Promise<void> => {
  try {
    const info = await FS.getInfoAsync(LOG_FILE_URI);
    if (!info.exists) {
      console.warn("logger: no log file to export");
      return;
    }
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(LOG_FILE_URI, {
        mimeType: "text/plain",
        dialogTitle: "Export Comgari Debug Log",
      });
    } else {
      console.warn("logger: sharing is not available on this device");
    }
  } catch (error) {
    console.error("logger: failed to export logs", error);
  }
};

export const clearLogs = async (): Promise<void> => {
  try {
    const info = await FS.getInfoAsync(LOG_FILE_URI);
    if (info.exists) {
      await FS.deleteAsync(LOG_FILE_URI);
    }
  } catch (error) {
    console.error("logger: failed to clear logs", error);
  }
};
