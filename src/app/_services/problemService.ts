import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {Router} from "@angular/router";
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class problemService {
    constructor(private http: HttpClient,private router: Router, private spinner: NgxSpinnerService) { }
  

    getLocationProblem(location:any){
        this.spinner.show()
        return this.http.post<any>('http://10.14.151.91:3006/getLocationProblem', location)
        .pipe(map(res => {
            this.spinner.hide();
                  return res;
        }));
    }
    insertProblem(problem: any) {
        this.spinner.show()
        return this.http.post<any>('http://10.14.151.91:3006/insertProblem', {problem})
            .pipe(map(res => {
                this.spinner.hide();
                return res;
        }));
    }
    editProblem(problem: any) {
        this.spinner.show()
        return this.http.post<any>('http://10.14.151.91:3006/editProblem', {problem})
            .pipe(map(res => {
                this.spinner.hide();
                return res;
        }));
    }
    deleteProblem(problem: any) {
        this.spinner.show()
        return this.http.post<any>('http://10.14.151.91:3006/deleteProblem', {problem})
            .pipe(map(res => {
                this.spinner.hide();
                return res;
            }));
    }
    
}
