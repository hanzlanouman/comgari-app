import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Sharing from "expo-sharing";
import { TDownloadResponse } from "./types";
import { getMimeTypeFromFileName, isIos } from "../helpers";

const FS = FileSystem as any;

const DOWNLOAD_FOLDER_URI_KEY = "comgari_download_folder_uri";

const isStorageAccessFrameworkAvailable = (): boolean => {
  return !!(
    FS.StorageAccessFramework &&
    typeof FS.StorageAccessFramework.requestDirectoryPermissionsAsync ===
      "function"
  );
};

const getStoredFolderUri = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(DOWNLOAD_FOLDER_URI_KEY);
  } catch {
    return null;
  }
};

const storeFolderUri = async (uri: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(DOWNLOAD_FOLDER_URI_KEY, uri);
  } catch (error) {
    console.error("Error storing folder URI:", error);
  }
};

const getFolderPermission = async (): Promise<string | null> => {
  if (!isStorageAccessFrameworkAvailable()) {
    return null;
  }

  const storedUri = await getStoredFolderUri();
  if (storedUri) {
    return storedUri;
  }

  const permissions =
    await FS.StorageAccessFramework.requestDirectoryPermissionsAsync();

  if (!permissions.granted) {
    return null;
  }

  await storeFolderUri(permissions.directoryUri);

  return permissions.directoryUri;
};

const saveToFolder = async (
  fileUri: string,
  filename: string,
  folderUri: string
): Promise<TDownloadResponse> => {
  try {
    const mimeType = getMimeTypeFromFileName(filename);

    const base64 = await FS.readAsStringAsync(fileUri, {
      encoding: FS.EncodingType.Base64,
    });

    const newUri = await FS.StorageAccessFramework.createFileAsync(
      folderUri,
      filename,
      mimeType
    );

    await FS.writeAsStringAsync(newUri, base64, {
      encoding: FS.EncodingType.Base64,
    });

    return {
      success: true,
      message: "File Downloaded Successfully.",
    };
  } catch (error: any) {
    console.error("Error saving file to folder:", error);
    return {
      success: false,
      message:
        error?.message ||
        "An error occurred while downloading the file. Please try again.",
    };
  }
};

const shareFile = async (
  uri: string,
  filename: string
): Promise<TDownloadResponse> => {
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, {
      mimeType: getMimeTypeFromFileName(filename),
      dialogTitle: "Save File",
    });

    return {
      success: true,
      message: "File Downloaded Successfully.",
    };
  } else {
    return {
      success: false,
      message: "Sharing is not available on this device.",
    };
  }
};

const Download = async (url: string): Promise<TDownloadResponse> => {
  try {
    const filename = `${Date.now()}_${url.split("/").pop()}`;
    const fileUri = `${FS.documentDirectory}${filename}`;

    const downloadResult = await FS.downloadAsync(url, fileUri);

    if (downloadResult.status !== 200) {
      throw new Error(`Download failed with status ${downloadResult.status}`);
    }

    if (isIos()) {
      return await shareFile(downloadResult.uri, filename);
    }

    if (isStorageAccessFrameworkAvailable()) {
      const folderUri = await getFolderPermission();

      if (folderUri) {
        return await saveToFolder(downloadResult.uri, filename, folderUri);
      }
    }

    return await shareFile(downloadResult.uri, filename);
  } catch (error: any) {
    console.error("Error downloading file:", error);
    return {
      success: false,
      message: error?.message || "Download Failed",
    };
  }
};

const MoveFile = async (uri: string): Promise<TDownloadResponse> => {
  try {
    const filename = `${Date.now()}_${uri.split("/").pop()}`;

    if (isIos()) {
      return await shareFile(uri, filename);
    }

    if (isStorageAccessFrameworkAvailable()) {
      const folderUri = await getFolderPermission();

      if (folderUri) {
        return await saveToFolder(uri, filename, folderUri);
      }
    }

    return await shareFile(uri, filename);
  } catch (error: any) {
    console.error("Error saving file:", error);
    return {
      success: false,
      message: error?.message || "Download Failed",
    };
  }
};

const clearDownloadFolder = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(DOWNLOAD_FOLDER_URI_KEY);
  } catch (error) {
    console.error("Error clearing download folder:", error);
  }
};

export { Download, MoveFile, clearDownloadFolder };
