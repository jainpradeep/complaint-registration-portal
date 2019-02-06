import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {Router} from "@angular/router";
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
@Injectable()
export class complaintService {
    constructor(private toastr: ToastrService,private http: HttpClient,private router: Router, private spinner: NgxSpinnerService) { }
  

    getLocationComplaint(location:any){
        this.spinner.show()
        return this.http.post<any>('http://10.14.151.91:3006/getLocationComplaint', location)
        .pipe(map(res => {
            this.spinner.hide();
            return res;
        }));
    }

    getLocationProblemComplaints(data:any){
        this.spinner.show()
        return this.http.post<any>('http://10.14.151.91:3006/getLocationProblemComplaint', data)
        .pipe(map(res => {
            this.spinner.hide();
            return res;
        }));
    }

    
    getUserComplaint(user:any){
        this.spinner.show()
        return this.http.post<any>('http://10.14.151.91:3006/getUserComplaint', user)
        .pipe(map(res => {
            this.spinner.hide();
            return res;
        }));
    }

    insertComplaint(complaint: any) {
        this.spinner.show()
        return this.http.post<any>('http://10.14.151.91:3006/insertComplaint', {complaint})
            .pipe(map(res => {
                if (res.msg == "success") {
                    this.toastr.success('Success!' ,"",{
                        timeOut: 3000
                    });
                } 
                else{
                    this.toastr.error('Please Try Again', 'Server Failure', {
                        timeOut: 3000
                    });
                }
                this.spinner.hide();
                return res;
        }));
    }
    editComplaint(complaint: any) {
        this.spinner.show()
        return this.http.post<any>('http://10.14.151.91:3006/editComplaint', {complaint})
            .pipe(map(res => {
                if (res.msg == "success") {
                    this.toastr.success('Success!' ,"",{
                        timeOut: 3000
                    });
                } 
                else{
                    this.toastr.error('Please Try Again', 'Server Failure', {
                        timeOut: 3000
                    });
                }
                this.spinner.hide();
                return res;
        }));
    }
    deleteComplaint(complaint: any) {
        this.spinner.show()
        return this.http.post<any>('http://10.14.151.91:3006/deleteComplaints', {complaint})
            .pipe(map(res => {
                if (res.msg == "success") {
                    this.toastr.success('Success!' ,"",{
                        timeOut: 3000
                    });
                } 
                else{
                    this.toastr.error('Please Try Again', 'Server Failure', {
                        timeOut: 3000
                    });
                }
                this.spinner.hide();
                return res;
            }));
    }
    
}
