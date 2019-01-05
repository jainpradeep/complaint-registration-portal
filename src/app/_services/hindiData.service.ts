import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { WindowScrolling } from "./window-scrolling";

@Injectable()
export class HindiDataService {
    data:any;
    summary:any;
    private windowScrolling: WindowScrolling;
    constructor(private http: HttpClient,private spinner: NgxSpinnerService, windowScrolling: WindowScrolling) { 
        this.windowScrolling = windowScrolling;
    }
     insertRecord(hindiStatusReport:any) {
         this.windowScrolling.disable(); this.spinner.show(); 
        return this.http.post<any>('http://localhost:3006/insertHindiReport', hindiStatusReport)
            .pipe(map(res => {
                this.spinner.hide();  this.windowScrolling.enable();  
                if (res.msg == "success") {
                    console.log("httpCallsuccess")
                }
                return res; 
            }));
 }
    getRecords(filters: any){
         this.windowScrolling.disable(); this.spinner.show(); 
        return this.http.post<any>('http://localhost:3006/getHindiData', 
        filters )
        .pipe(map(res => {
            this.spinner.hide();  this.windowScrolling.enable();  
            if (res.msg == "success") {
                return res;
            }
        }));
    }

    deleteHindiReport(record:any){
         this.windowScrolling.disable(); this.spinner.show(); 
        return this.http.post<any>('http://localhost:3006/deleteHindiData', record )
        .pipe(map(res => {
            this.spinner.hide();  this.windowScrolling.enable();  
            if (res.msg == "success") {
                return res;
            }
            return res;
        }));
    }

    editHindiReport(record:any){
         this.windowScrolling.disable(); this.spinner.show(); 
         record = {
            hLettersSent: record.hLettersSent,
            eLettersSent: record.eLettersSent,
            hCommentsSent: record.hLettersSent,
            eCommentsSent:record.eCommentsSent ,
            hLettersRecieved:record.hLettersRecieved ,
            eLettersRecieved: record.eLettersRecieved,
            tag: record.tag,
            fromDate: record.fromDate,
            toDate:record.toDate,
            _id:record._id
        }
         
        return this.http.post<any>('http://localhost:3006/editHindiData', record )
        .pipe(map(res => {
            this.spinner.hide();  this.windowScrolling.enable();  
            if (res.msg == "success") {
                return res;
            }
            return res;
        }));
    }
}
