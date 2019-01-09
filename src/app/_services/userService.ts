import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {Router} from "@angular/router";
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class userService {
    constructor(private http: HttpClient,private router: Router, private spinner: NgxSpinnerService) { }
  

    getLocationUsers(location:any){
        this.spinner.show()
        return this.http.post<any>('http://localhost:3006/getLocationUsers', location)
        .pipe(map(res => {
            this.spinner.hide();
                  return res;
        }));
    }
    insertUser(user: any) {
        this.spinner.show()
        return this.http.post<any>('http://localhost:3006/insertUser', {user})
            .pipe(map(res => {
                this.spinner.hide();
                return res;
        }));
    }
    editUser(user: any) {
        this.spinner.show()
        return this.http.post<any>('http://localhost:3006/editUser', {user})
            .pipe(map(res => {
                this.spinner.hide();
                return res;
        }));
    }
    deleteUser(user: any) {
        this.spinner.show()
        return this.http.post<any>('http://localhost:3006/deleteUser', {user})
            .pipe(map(res => {
                this.spinner.hide();
                return res;
            }));
    }
    
}
