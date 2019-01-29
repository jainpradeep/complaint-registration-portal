import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService, AuthenticationService, LocationService } from '../_services';

@Component({templateUrl: 'login.component.html',
styleUrls: ['login.component.css']})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    loginError = false;
    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private locationService : LocationService,
        private alertService: AlertService) {
            // document.body.style.background = 'Help-Desk-Support.jpg';
            // document.body.style.backgroundSize = 'cover';
            }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
        this.authenticationService.logout();
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;
        this.loginError = false;
        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this.authenticationService.login(this.f.username.value, this.f.password.value)
            .pipe(first())
            .subscribe(
                data => {
                    if(data.msg == "success"){
                        this.loginError = false;
                        this.router.navigate([data.type === "admin" ? "" : "user"]);
//                        this.router.navigate([this.returnUrl]);
                        document.body.style.background = 'none';
                    }
                    else
                       this.loginError = true;
            },
                error => {
                    this.loading = false;
                });
    }
}
