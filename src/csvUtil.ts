
import { finished } from 'stream/promises';
import { FormatterOptionsArgs, Row, writeToStream } from '@fast-csv/format';

export class csvUtil {
  public static async readCsv(filePath: string, readOptions: {}): Promise<any[]> {
    const fastCsv = require("fast-csv");
    const fs = require("fs");
    
    const data: any[] = [];
    const inputDataStream = fs.createReadStream(filePath);
    const csvStream = fastCsv.parseStream(inputDataStream, readOptions);
    
    csvStream
        .on("error", (error: any) => {
          console.log(error);
        })
        .on("data", (row: any) => {
          data.push(row);
        })
        .on("end", (rowCount: number) => {
          console.log('rows found from input CSV: ', rowCount);
        });
        
     await finished(csvStream);
     return data;   
  }

  public static async writeCsv(filePath: string, data: Row[], writeOptions: {}): Promise<void> {
    const fastCsv = require("fast-csv");
    const fs = require("fs");

    const writableStream = fs.createWriteStream(filePath);
    
    return new Promise((res, rej) => {
      fastCsv.writeToStream(writableStream, data, writeOptions)
          .on('error', (err: Error) => rej(err))
          .on('finish', () => { 
            res(); 
            console.log('Output CSV file written successfully');
          });
    });
  }
}