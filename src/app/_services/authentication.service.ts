﻿import { Injectable, Renderer2, RendererFactory2  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router} from "@angular/router";
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
@Injectable()
export class AuthenticationService {
    userMode = "";
    userName = "";
    private renderer: Renderer2;
    constructor(private toastr: ToastrService,rendererFactory: RendererFactory2,private http: HttpClient,private router: Router,private spinner: NgxSpinnerService) { 
        this.renderer = rendererFactory.createRenderer(null, null);
    }
    login(username: string, password: string) {
        this.spinner.show();
        return this.http.post<any>('http://10.14.151.91:3006/authenticate', { username: username, password: password })
        .pipe(map(res => {
            this.spinner.hide();
            if (res.msg == "success") {
                this.toastr.success('Welcome user: ' + username, "login Success",{
                    timeOut: 3000
                });
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(res.msg));
                localStorage.setItem('username', username);
                localStorage.setItem('location', res.location);
                localStorage.setItem('name', res.name);
                localStorage.setItem('viewPermissionRoot', res.viewPermissionRoot);
                this.userName  = username
            } 
            else{
                this.toastr.error('Please Try Again', 'Login Failure', {
                    timeOut: 3000
                });
            }
            return res;
        }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        localStorage.removeItem('username');
        localStorage.removeItem('location');
        localStorage.removeItem('viewPermissionRoot');
        this.renderer.setStyle(document.body, 'background-image', "url('Help-Desk-Support.jpg')");
        this.renderer.setStyle(document.body, 'background-size', "cover");
        this.renderer.setStyle(document.body, 'background-repeat', "no-repeat");
        this.router.navigate(['/login']);
    }
}