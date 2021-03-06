﻿import { Component,  ChangeDetectorRef} from '@angular/core';
import { LocationService } from '../_services';
import { userService } from '../_services';
import { problemService } from '../_services';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../_services';
 
import { NgbDate, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import { Router,NavigationEnd } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner'
import 'babel-polyfill'
import { throwError } from 'rxjs';
@Component({
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.css'],
    providers: [],
})

export class HomeComponent {
    locationList: any = [];

    treeView:any;
    currentView = "userView";
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
    settingsUsers : any;
    settingsProblem : any;
    lockedWindow : any;
    locationConfig : any = "";
    locationUsers : any = [];
    locationProblem : any = [];
    selectLocationSubTree: any = this.filteredLocationList[0];
    childView :any;
    config = {
        paddingAtStart: true,
        listBackgroundColor: `rgb(59,153,186)`,
        fontColor: `rgb(255,255,255)`,
        backgroundColor: `rgb(59,153,186)`,
        highlightOnSelect: true,
        selectedListFontColor: `teal`,
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
        icon : "fa fa-university fa-1x"
    }

    onSelect(event: any) {
        console.log(event);
    }

    setCurrentView = function(view:string){
        this.currentView = view;
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
            tag : selectedloc ? selectedloc.innerHTML : this.filteredLocationList[0].tag,
        };

        this.setTreeView(this.currentLocation.tag);
        if (this.initialiseMenu == true) {
            this.searchTreeLocationIndex(this.filteredLocationList[0], selectedloc ? selectedloc.innerHTML :  this.filteredLocationList[0].tag);
        }
        this.locationListFiltered = this.locationList.filter(function(loc:any){
            var filterLocation = (_this.selectedLocationElement != null)? (_this.selectedLocationElement.innerText === (loc.parent?loc.parent:null)) : false;
            return filterLocation;
        });
        this.initTableSettings()
        this.getLocationUsers(this.currentLocation.tag);
        this.getLocationProblem(this.currentLocation.tag);
        this.initialiseMenu = true;
    }
    
    setTreeView = function(location:any){
        this.locationService.checkLocationChild(location).subscribe(
            (data:any) => {
                this.treeView = data.location.length ? "BlankView" : "NormalView"
            },
            (error:any) => {})   
    }

    initTableSettings(){
    this.settingsUsers = {
        columns: {
            EMPNO: {
                title: 'Employee ID',
                editable: false
            },
            EMPNAME: {
                title: 'Employee NAME',
                editable: false
            },
            DESGN: {
                title: 'Designation',
                editable: false
            },            
            viewPermissionRoot: {
                title: 'View Permissions',
                editor: {
                        type: 'list',
                        config: {
                        selectText: 'Select',
                        list: this.locationList.map(function(loc:any){
                            loc.value = loc.tag;
                            loc.title = loc.tag;
                            return loc
                        })       
                    }
                }
            }
        },
        edit:{
             confirmSave:true
            },
        actions: {
            add: false,
            edit: true,
            delete: false,
            },
      };

      this.settingsProblem = {
        columns: {
          problem: {
            title: 'Problem',
          },
          description: {    
            title: 'Description'
          },
          priority: {
            title: 'Priority',
            editor: {
                type: 'list',
                config: {
                selectText: 'Select',
                   list: [
                    {value: 'High', title: 'High'},
                    {value: 'Medium', title: 'Medium'},
                    {value: 'Low', title: 'Low'},
                  ]    
               }
       }
          },
          siteEngineer: {
            title: 'Site engineer'
          },
          engineerInCharge: {
            title: 'Engineer In Charge'
          },
          hod: {
            title: 'HOD'
          },
          workOrderNo: {
            title: 'Work Order No'
          },
          workOrderDetails: {
            title: 'Work Order Details'
          }
        
    },
        add:{
            confirmCreate:true
        },
        edit:{
             confirmSave:true
            },
        delete :{
                confirmDelete: true
              }

      };
    }
    constructor(private chRef: ChangeDetectorRef, private modalService: NgbModal, private AuthenticationService: AuthenticationService,  calendar: NgbCalendar, private userService: userService,private locationService: LocationService,private problemService: problemService,private router: Router, private spinner: NgxSpinnerService) {
        this.ngOnInit();
    }

    ngOnInit(){
        document.body.style.background = 'none';
        this.spinner.show();
        this.getLocationTree();
        this.getLocationUsers(localStorage.getItem('location'));
        this.getLocationProblem(localStorage.getItem('location'));
        this.initTableSettings()
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
    
    getLocationUsers(location:any){
        var _this = this;
        this.userService.getLocationUsers({location : location }).subscribe(
            data => {
               this.locationUsers = data.location;
            },
            error => {})   
    }
    getLocationProblem(location:any){
        var _this = this;
        this.problemService.getLocationProblem({location : location}).subscribe(
            data => {
               this.locationProblem = data.locationProblem;
            },
            error => {})   
    }

    addUser(event:any) {
        var data = {"eid" : event.newData.EMPNO,
        "location" :this.currentLocation.tag,
        "viewPermissionRoot" : event.newData.viewPermissionRoot
                    };
        this.userService.insertUser(data
        ).subscribe(
            data => {
                event.confirm.resolve(event.newData);
                this.ngOnInit();
            },
            error => {
                if (error.error instanceof Error) {
                    console.log("Client-side error occured.");
                } else {
                    console.log("Server-side error occured.");
                }
            });
      }

      addProblem(event:any) {
        var data = {"eid" : localStorage.getItem('username'),
                    "problem" : event.newData.problem,
                    "description" : event.newData.description,
                    "priority" : event.newData.priority,
                    "siteEngineer" : Number(event.newData.siteEngineer),
                    "engineerInCharge" : Number(event.newData.engineerInCharge),
                    "hod" : Number(event.newData.hod),
                    "workOrderNo" : event.newData.workOrderNo,
                    "workOrderDetails" : event.newData.workOrderDetails,
                    "location" : this.currentLocation.tag};
        this.problemService.insertProblem(data
        ).subscribe(
            data => {
                event.confirm.resolve(event.newData);
                this.ngOnInit();
            },
            error => {
                if (error.error instanceof Error) {
                    console.log("Client-side error occured.");
                } else {
                    console.log("Server-side error occured.");
                }
            });
      }


      updateUser(event:any) {
          var data = {"eid" : event.newData.eid,
                    "location" :  localStorage.getItem('location'),
                    "viewPermissionRoot" : event.newData.viewPermissionRoot,
                    "_id" : event.newData._id
          }
          this.userService.editUser(data
            ).subscribe(
                data => {
                    event.confirm.resolve(event.newData);
                    this.ngOnInit();
                },
                error => {
                    if (error.error instanceof Error) {
                        console.log("Client-side error occured.");
                    } else {
                        console.log("Server-side error occured.");
                    }
                });
        }
        updateProblem(event:any) {
            var data = {"eid" : localStorage.getItem('username'),
            "problem" : event.newData.problem,
            "description" : event.newData.description,
            "priority" : event.newData.priority,
            "siteEngineer" : event.newData.siteEngineer,
            "engineerInCharge" : event.newData.engineerInCharge,
            "hod" : event.newData.hod,
            "workOrderNo" : event.newData.workOrderNo,
            "workOrderDetails" : event.newData.workOrderDetails,
            "location" : localStorage.getItem('location'),
                      "_id" : event.newData._id
            }
            this.problemService.editProblem(data
              ).subscribe(
                  data => {
                      event.confirm.resolve(event.newData);
                      this.ngOnInit();
                  },
                  error => {
                      if (error.error instanceof Error) {
                          console.log("Client-side error occured.");
                      } else {
                          console.log("Server-side error occured.");
                      }
                  });
          }
  
          deleteProblem(event:any) {
            var data = {"eid" : localStorage.getItem('username'),
            "problem" : event.data.problem,
            "description" : event.data.description,
            "priority" : event.data.priority,
            "siteEngineer" : event.data.siteEngineer,
            "engineerInCharge" : event.data.engineerInCharge,
            "hod" : event.data.hod,
            "workOrderNo" : event.data.workOrderNo,
            "workOrderDetails" : event.data.workOrderDetails,
            "location" : localStorage.getItem('location'),
            "_id" : event.data._id
            }
            this.problemService.deleteProblem(data
              ).subscribe(
                  data => {
                      event.confirm.resolve(event.data);
                      this.ngOnInit();
                  },
                  error => {
                      if (error.error instanceof Error) {
                          console.log("Client-side error occured.");
                      } else {
                          console.log("Server-side error occured.");
                      }
                  });
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
            this.selectLocation(null);
            this.setTreeView(this.appitems[0].tag)
            this.initTableSettings();
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
            "officer": "admin" + this.newLocation.tag.replace(/ /g,''),
            "key" : "ioc123",
            "faIcon": 'fa fa-university fa-1x'
        }).subscribe(
            data => {
               
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