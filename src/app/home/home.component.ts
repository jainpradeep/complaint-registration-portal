import { Component,  ChangeDetectorRef} from '@angular/core';
import { LocationService } from '../_services';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../_services';
import { HindiDataService}  from '../_services';
import { NgbDate, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import { Router,NavigationEnd } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner'
import 'babel-polyfill'
@Component({
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.css'],
    providers: [HindiDataService],
})

export class HomeComponent {
    items: any;
    navigationSubscription:any;
    closeResult: string;
    appitems: any = [];
    selectedLocationElement:any;
    filteredLocationList: any = [];
    flattenedLocationList: any[] = [];
    hoveredDate: NgbDate;
    todayDate = new Date();
    startDate :any
    fromDate: NgbDate;
    currentLocation : any;
    newEditLocation : any = {
        parent : "",
        employee : "",
        tag:"",
        officerEmail: "",
        coordinatorEmail:"",
    }
    toDate: NgbDate;
    clickedItems: any = [];
    locationListFiltered: any = [];
    lockedWindow : any;
    locationList: any = [];
    locationConfig : any = "";
   
    selectLocationSubTree: any = this.filteredLocationList[0];
   
    config = {
        paddingAtStart: true,
        listBackgroundColor: `rgb(94,45,121)`,
        fontColor: `rgb(255,255,255)`,
        backgroundColor: `rgb(94,45,121)`,
        highlightOnSelect: true,
        selectedListFontColor: `purple`,
        interfaceWithRoute: false,
        collapseOnSelect: true
    };
    initialiseMenu: boolean = true; 
    newLocation :any = {
        tag : "",
        parent : "",
        officer:"",
        label: "",
        key: "ioc123    ",
        icon : "fa fa-sitemap fa-1x"
    }

    onSelect(event: any) {
        console.log(event);
    }

    initEditLocation(){
        this.newEditLocation = {
            tag : this.selectLocationSubTree.tag,
            parent: this.selectLocationSubTree.parent,
            employee:this.selectLocationSubTree.officer,
            officerEmail:this.selectLocationSubTree.officerEmail,
            coordinatorEmail: this.selectLocationSubTree.coordinatorEmail,
            frequency : this.selectLocationSubTree.frequency
        }
    }

    searchTree = function(item: any, username: any) {
        this.items = item
        this.locationsearchTree(item, username)
        return [this.items]
    }

    locationsearchTree = function(item: any, username: any) {
        var __this = this;
        if (item.officer == username || (typeof item.officer === 'string' && item.officer.includes(username))) {
            this.items = item
        } else {
            item.items.map(function(ob: any) {
                __this.locationsearchTree(ob, username)
            })
        }
    }

    searchTreeLocationIndex = function(item: any, tag: any) {
        this.locationsearchTreeIndex(item, tag)
        console.log(this.clickedItems)
        return [this.clickedItems]
    }

    locationsearchTreeIndex = function(item: any, tag: any) {
        var __this = this;
        if (item.tag != tag) {
            item.items.map(function(ob: any) {
                __this.locationsearchTreeIndex(ob, tag)
            })
        } else {
            this.selectLocationSubTree = item;
            this.subtreeSelected = true;
            this.selectLocationSubTree.summary = {};
            this.clickedItems = item
            return
        }
    }

    flattenList = function(list: any) {
        var __this = this;
        __this.flattenedLocationList.push(list.tag)
        list.items.map(function(ob: any) {
            __this.flattenList(ob)
        })
        return __this.flattenedLocationList;
    }

    deleteLocation = function(location: any){
        this.locationService.deleteLocation(location).subscribe(
                (data:any) => {
                   this.getLocationTree();

                },
                (error:any) => {});
    }

    selectLocation(selectedloc: any) {
        var _this = this;
        this.selectedLocationElement = selectedloc;
        this.currentLocation  =  {
            tag : selectedloc ? selectedloc.innerHTML : this.selectLocationSubTree.tag,
        };
        if (this.initialiseMenu == true) {
            this.searchTreeLocationIndex(this.filteredLocationList[0], selectedloc ? selectedloc.innerHTML : this.selectLocationSubTree.tag);
            // this.getLocationHindiRecords(this.clickedItems);
        }
        this.locationListFiltered = this.locationList.filter(function(loc:any){
            var filterLocation = (_this.selectedLocationElement != null)? (_this.selectedLocationElement.innerText === (loc.parent?loc.parent:null)) : false;
            console.log(loc.tag +  " " + filterLocation);
            return filterLocation;
        });
        this.initialiseMenu = true;
    }

    
    constructor(private chRef: ChangeDetectorRef, private modalService: NgbModal, private AuthenticationService: AuthenticationService, private HindiDataService: HindiDataService, calendar: NgbCalendar, private locationService: LocationService,private router: Router, private spinner: NgxSpinnerService) {
        document.body.style.background = 'none';
        this.spinner.show();
        this.getLocationTree();
    }

    getLocationTree(){
        var _this = this;
        this.locationService.getLocationHierarchy().subscribe(
            data => {
                this.locationList = data.locationList;
               this.getContent();
            },
            error => {})
        }
    
    getUpdatededLocationTree(){
        this.locationService.getLocationHierarchy().subscribe(
            data => {
                
                this.getContent();
            },
            error => {})
        }

    getContent() {
        this.flattenedLocationList = [];
        this.locationService.getLocationConfig().subscribe(data => {
            this.locationConfig = data
            this.filteredLocationList = this.appitems = this.searchTree(this.locationConfig[0], localStorage.getItem('username'))
            // this.locationService.setFilteredLocationTree(this.filteredLocationList);
        },
        error => {});
    }

    logOut() {
        this.AuthenticationService.logout();
    }


    open(content: any) {
        this.lockedWindow = this.modalService.open(content);
        this.lockedWindow.result.then((result:any) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason:any) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

    editLocation(){
        this.locationService.editLocation(this.newEditLocation).subscribe(
            (data:any) => {
               this.getLocationTree();
            },
            (error:any) => {});
    }

    saveNewLocation(){
        this.locationService.insertLocation({
            "tag" : this.newLocation.tag,
            "parent": this.selectedLocationElement.innerText,
            "label": this.newLocation.tag,
            "officer": "admin" + this.newLocation.tag.trim(),
            "key" : "ioc123",
            "faIcon": 'fa fa-sitemap fa-1x'
        }).subscribe(
            data => {
                console.log("Location Saved" + data);
                this.getLocationTree();
            },
            error => {
                console.log("Location save error" + error);
            });
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    onDateSelection(date: NgbDate) {
        if (!this.fromDate && !this.toDate) {
            this.fromDate = date;
        } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
            this.toDate = date;
        } else {
            this.toDate = null;
            this.fromDate = date;
        }
    }

    isHovered(date: NgbDate) {
        return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
    }

    isInside(date: NgbDate) {
        return date.after(this.fromDate) && date.before(this.toDate);
    }

    isRange(date: NgbDate) {
        return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
    }

}