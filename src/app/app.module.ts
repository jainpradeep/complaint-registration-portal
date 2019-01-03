import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMaterialMultilevelMenuModule } from 'ng-material-multilevel-menu';
// used to create fake backend
import { fakeBackendProvider } from './_helpers';

import { AppComponent }  from './app.component';
import { routing }        from './app.routing';
import { ChartModule } from 'angular-highcharts';
import { AlertComponent } from './_directives';
import { AuthGuard } from './_guards';
import { JwtInterceptor } from './_helpers';
import { HindiDataService, AlertService, AuthenticationService, UserService,StatutoryClerance, LocationService, } from './_services';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FilterPipe} from './home/filter.pipe';
import { HomeComponent } from './home';
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
import { NumberDirective } from './numbers-only.directive';
import 'babel-polyfill'

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        routing,
        ChartModule,
        FormsModule,
        NgxSpinnerModule,
        FormsModule,
        NgbModule.forRoot(),
        NgxPaginationModule,
        AngularFontAwesomeModule,
        NgMaterialMultilevelMenuModule,
        BrowserAnimationsModule,
        NgxChartsModule,
        CommonModule,
        RouterModule.forRoot(appRoutes, {onSameUrlNavigation: 'reload'})
        ],
    declarations: [
        AppComponent,
        NumberDirective,
        AlertComponent,
        HomeComponent,
        FilterPipe,
        LoginComponent,
        FileSelectDirective,
        MyFilterPipe
    ],
    providers: [
        AuthGuard,
        HindiDataService,
        AlertService,
        AuthenticationService,
        WindowScrolling,
        LocationService,
        UserService,
        StatutoryClerance,
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