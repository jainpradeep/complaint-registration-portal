import { Component } from '@angular/core';
import {HindiDataService}  from './_services';

@Component({
    selector: 'app',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.css'],
    providers: [HindiDataService]
})

export class AppComponent {
}