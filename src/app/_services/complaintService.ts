import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {Router} from "@angular/router";
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class complaintService {
    constructor(private http: HttpClient,private router: Router, private spinner: NgxSpinnerService) { }
  

    getLocationComplaint(location:any){
        this.spinner.show()
        return this.http.post<any>('http://localhost:3006/getLocationComplaint', location)
        .pipe(map(res => {
            this.spinner.hide();
                  return res;
        }));
    }

    
    getUserComplaint(user:any){
        this.spinner.show()
        return this.http.post<any>('http://localhost:3006/getUserComplaint', user)
        .pipe(map(res => {
            this.spinner.hide();
                  return res;
        }));
    }

    insertComplaint(complaint: any) {
        this.spinner.show()
        return this.http.post<any>('http://localhost:3006/insertComplaint', {complaint})
            .pipe(map(res => {
                this.spinner.hide();
                return res;
        }));
    }
    editComplaint(complaint: any) {
        this.spinner.show()
        return this.http.post<any>('http://localhost:3006/editComplaint', {complaint})
            .pipe(map(res => {
                this.spinner.hide();
                return res;
        }));
    }
    editIncharge(complaint: any) {
        this.spinner.show()
        return this.http.post<any>('http://localhost:3006/editIncharge', {complaint})
            .pipe(map(res => {
                this.spinner.hide();
                return res;
        }));
    }
    deleteComplaint(complaint: any) {
        this.spinner.show()
        return this.http.post<any>('http://localhost:3006/deleteComplaint', {complaint})
            .pipe(map(res => {
                this.spinner.hide();
                return res;
            }));
    }
    
}
