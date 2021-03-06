import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {Router} from "@angular/router";
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class LocationService {
    locationConfig = "";
    filteredLocationTree = {};
    locationList:any[] = [];
    addRecordsAllowed : boolean = false;
    constructor(private http: HttpClient,private router: Router, private spinner: NgxSpinnerService) { }
    insertLocation(location: any) {
        this.spinner.show()
        return this.http.post<any>('http://10.14.151.91:3006/insertLocationHierarchy', {location})
            .pipe(map(res => {
                this.spinner.hide();
                localStorage.setItem('locationConfig', JSON.stringify(res.data));
                this.locationConfig = res.data;
       //         this.setAddRecordsAllowed(res.addRecordsAllowed);
                return res;
            }));
    }
   
    getLocationProblems(location:any) {
        this.spinner.show()
        return this.http.post<any>('http://10.14.151.91:3006/getLocationProblems', location)
            .pipe(map(res => {
                this.spinner.hide();
                return res;
            }));
    }

    getLocationHierarchy() {
        this.spinner.show()

        return this.http.post<any>('http://10.14.151.91:3006/getLocationHierarchy', {})
            .pipe(map(res => {
                this.spinner.hide();
                localStorage.setItem('locationConfig', JSON.stringify(res.locationConfig));
                this.locationConfig = res.locationConfig;
                this.locationList = res.locationList;
         //        this.setAddRecordsAllowed(res.addRecordsAllowed);
                return res;
            }));
    }

    checkLocationChild(location:any){
        this.spinner.show()
        return this.http.post<any>('http://10.14.151.91:3006/checkLocationChild', {location})
        .pipe(map(res => {
            this.spinner.hide();
                  return res;
        }));
    }

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
                this.spinner.hide();
                return res;
        }));
    }
    editUser(user: any) {
        this.spinner.show()
        return this.http.post<any>('http://10.14.151.91:3006/editUser', {user})
            .pipe(map(res => {
                this.spinner.hide();
                return res;
        }));
    }
    deleteUser(user: any) {
        this.spinner.show()
        return this.http.post<any>('http://10.14.151.91:3006/deleteUser', {user})
            .pipe(map(res => {
                this.spinner.hide();
                return res;
            }));
    }
    deleteLocation(location: any) {
        this.spinner.show()
        return this.http.post<any>('http://10.14.151.91:3006/deleteLocation', {location})
            .pipe(map(res => {
                this.spinner.hide();
                return res;
            }));
    }
    editLocation(location: any) {
        this.spinner.show()
        return this.http.post<any>('http://10.14.151.91:3006/editLocation', {location})
            .pipe(map(res => {
                this.spinner.hide();
                return res;
            }));
    }
    setFilteredLocationTree(data:any) {
        this.filteredLocationTree = data;
    }

    getFilteredLocationTree()  : Observable<any> {
        return of(this.filteredLocationTree);
    }

    setLocationConfig(data:any) {
        this.locationConfig = data;
    }

    getLocationConfig()  : Observable<any> {
        return of(this.locationConfig);
    }

    setAddRecordsAllowed(data:any) {
        this.addRecordsAllowed = data;
    }

    getAddRecordsAllowed()  : Observable<any> {
        return of(this.addRecordsAllowed);
    }

    getLocationList()  : Observable<any> {
        return of(this.locationList);
    }
}
