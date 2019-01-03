import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class StatutoryClerance {
    constructor(private http: HttpClient) { 
     }
     insertStatutoryClearence(newStatutoryClearance:any) {
        return this.http.post<any>('http://10.10.100.24:3006/insertStatutoryClearence', newStatutoryClearance )
            .pipe(map(res => {
                if (res.msg = "success") {
                    console.log("httpCallsuccess")
                }
                return res;
            }));

    }
    getStatutoryClearanceData(){
        return this.http.post<any>('http://10.10.100.24:3006/getStatutoryClearence', {} )
        .pipe(map(res => {
            if (res.msg = "success") {
                return res;
            }
            return res;
        }));
    }

    deleteStatutoryClearence(statutoryClearanceObj:any){
        return this.http.post<any>('http://10.10.100.24:3006/deleteStatutoryClearence', statutoryClearanceObj )
        .pipe(map(res => {
            if (res.msg = "success") {
                return res;
            }
            return res;
        }));
    }
    
    editStatutoryClearence(statutoryClearanceObj:any){
        return this.http.post<any>('http://10.10.100.24:3006/editStatutoryClearence', statutoryClearanceObj )
        .pipe(map(res => {
            if (res.msg = "success") {
                return res;
            }
            return res;
        }));
    }

    sendReminderEmail(statutoryClearanceObj:any){
        return this.http.post<any>('http://10.10.100.24:3006/sendReminderEmail', statutoryClearanceObj )
        .pipe(map(res => {
            if (res.msg = "success") {
                return res;
            }
            return res;
        }));
    }
}