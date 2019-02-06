import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {Router} from "@angular/router";
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
@Injectable()
export class userService {
    constructor(private toastr: ToastrService, private http: HttpClient,private router: Router, private spinner: NgxSpinnerService) { }
    getLocationUsers(location:any){
        this.spinner.show()
        return this.http.post<any>('http://10.14.151.91:3006/getLocationUsers', location)
        .pipe(map(res => {
            this.spinner.hide();
            return res;
        }));
    }
    insertUser(user: any) {
        this.spinner.show()
        return this.http.post<any>('http://10.14.151.91:3006/insertUser', {user})
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
    editUser(user: any) {
        this.spinner.show()
        return this.http.post<any>('http://10.14.151.91:3006/editUser', {user})
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
    deleteUser(user: any) {
        this.spinner.show()
        return this.http.post<any>('http://10.14.151.91:3006/deleteUser', {user})
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
