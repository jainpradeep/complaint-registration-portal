import { Injectable, Renderer2, RendererFactory2  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router} from "@angular/router";
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class AuthenticationService {
    userMode = "";
    userName = "";
    private renderer: Renderer2;
    constructor(rendererFactory: RendererFactory2,private http: HttpClient,private router: Router,private spinner: NgxSpinnerService) { 
        this.renderer = rendererFactory.createRenderer(null, null);
    }
    login(username: string, password: string) {
        this.spinner.show();
        return this.http.post<any>('http://localhost:3006/authenticate', { username: username, password: password })
        .pipe(map(res => {
            this.spinner.hide();
            if (res.msg == "success") {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(res.msg));
                localStorage.setItem('username', username);
                localStorage.setItem('location', res.location);
                localStorage.setItem('viewPermissionRoot', res.viewPermissionRoot);
                this.userName  = username
            } 
            return res;
        }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.renderer.setStyle(document.body, 'background-image', "url('hdb3.jpg')");
        this.renderer.setStyle(document.body, 'background-size', "cover");
        this.renderer.setStyle(document.body, 'background-repeat', "no-repeat");
        this.renderer.setStyle(document.body, 'background-position', "center");
        this.router.navigate(['/login']);
    }
}