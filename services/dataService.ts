
import type { AppData } from '../types';

export const exportData = (data: AppData) => {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(data, null, 2)
  )}`;
  const link = document.createElement("a");
  link.href = jsonString;
  const date = new Date().toISOString().slice(0, 10);
  link.download = `timetable_backup_${date}.json`;
  link.click();
};

export const importData = (file: File): Promise<AppData> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = event => {
      try {
        if (event.target && typeof event.target.result === 'string') {
          const result = JSON.parse(event.target.result);
          // Basic validation
          if (result.subjects && result.instructors && result.settings) {
            resolve(result as AppData);
          } else {
            reject(new Error("Invalid data format in JSON file."));
          }
        } else {
          reject(new Error("Failed to read file."));
        }
      } catch (error) {
        reject(new Error("Error parsing JSON file."));
      }
    };
    fileReader.onerror = error => {
      reject(error);
    };
    fileReader.readAsText(file);
  });
};
