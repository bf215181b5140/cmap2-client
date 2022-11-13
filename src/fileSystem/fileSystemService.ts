import * as fs from "fs";
import {userDataPath} from "../electron";
import * as path from "path";

export class FileSystemService {
    static apiKey: string;
    static apiKeyFileName: string = 'apiKey.txt';

    static readApiKey() {
        fs.readFile(path.join(userDataPath, this.apiKeyFileName), (err: NodeJS.ErrnoException | null, data: Buffer) => {
            if (err) this.createApiKeyFile()
            if (data) this.apiKey = data.toString();
        });
        console.log(this.apiKey);
    }

    static createApiKeyFile() {
        fs.writeFile(path.join(userDataPath, this.apiKeyFileName), '', (err: NodeJS.ErrnoException | null) => {
            if (err) throw err;
        });
    }
}