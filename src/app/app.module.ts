﻿import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMaterialMultilevelMenuModule } from 'ng-material-multilevel-menu';
// used to create fake backend
import { fakeBackendProvider } from './_helpers';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { AppComponent }  from './app.component';
import { routing }        from './app.routing';
import { ChartModule } from 'angular-highcharts';
import { AuthGuard } from './_guards';
import { JwtInterceptor } from './_helpers';
import { AlertService, AuthenticationService, userService,problemService,LocationService, } from './_services';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FilterPipe} from './home/filter.pipe';
import { HomeComponent } from './home';
// import { SmartTableComponent } from './home/smart-table/smart-table.component';
import { LoginComponent } from './login';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FileSelectDirective } from 'ng2-file-upload';
import { MyFilterPipe } from './_pipes/search-filter.pipe';
import {NgxPaginationModule} from 'ngx-pagination';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AngularFontAwesomeModule } from 'angular-font-awesome';    
import {Routes, RouterModule } from '@angular/router';
import { appRoutes } from './app.routing';
import { WindowScrolling } from "./_services";
import { NumberDirective } from './numbers-only.directive';;
import { UserComponent } from './user/user.component'
import { complaintService } from './_services';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        routing,
        FormsModule,
        NgxSpinnerModule,
        FormsModule,
        NgbModule.forRoot(),
        NgxPaginationModule,
        Ng2SmartTableModule,    
        BrowserModule, 
        AngularFontAwesomeModule,
        NgMaterialMultilevelMenuModule,
        CommonModule,
        BrowserAnimationsModule, 
        ToastrModule.forRoot(),
        RouterModule.forRoot(appRoutes, {onSameUrlNavigation: 'reload'})
        ],
        declarations: [
            AppComponent,
            NumberDirective,
            HomeComponent,
            // SmartTableComponent,
            FilterPipe,
            LoginComponent,
            FileSelectDirective,
            MyFilterPipe
,
            UserComponent        ],
        providers: [
            AuthGuard,
            AlertService,
            AuthenticationService,
            WindowScrolling,
            LocationService,
            userService,
            complaintService,
            problemService,
            {
                provide: HTTP_INTERCEPTORS,
                useClass: JwtInterceptor,
                multi: true
            },
    
            // provider used to create fake backend
            fakeBackendProvider
        ],
        bootstrap: [AppComponent]
})

export class AppModule { }