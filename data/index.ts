import fs from "fs";
import path from "path";

const dataFolderPath = path.join(process.cwd(), "data");

export function getDataFilePath(fileName: string): string {
  return path.join(dataFolderPath, fileName);
}

export function loadDataFromFile(searchPrompt: string): any {
    const fileName = `${searchPrompt}.json`;
    const filePath = path.join(dataFolderPath, fileName);
  
    if (fs.existsSync(filePath)) {
      const jsonData = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(jsonData);
    }
  
    return null;
  }
  
  export function saveDataToFile(searchPrompt: string, data: any): void {
    if (!fs.existsSync(dataFolderPath)) {
      fs.mkdirSync(dataFolderPath);
    }
  
    const fileName = `${searchPrompt}.json`;
    const filePath = path.join(dataFolderPath, fileName);
    const jsonData = JSON.stringify(data, null, 2);
  
    fs.writeFileSync(filePath, jsonData);
  }
