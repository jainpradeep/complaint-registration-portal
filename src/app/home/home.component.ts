import { Component,  ChangeDetectorRef} from '@angular/core';
import { LocationService } from '../_services';
import { userService } from '../_services';
import { problemService } from '../_services';
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
    providers: [],
})

export class HomeComponent {
    locationList: any = [];

    
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
        this.settingsUsers = {
            columns: {
            eid: {
                title: 'EmployeeID'
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

          this.settingsProblem = {
            columns: {
              problem: {
                title: 'Problem'
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

        this.initialiseMenu = true;
    }

    
    constructor(private chRef: ChangeDetectorRef, private modalService: NgbModal, private AuthenticationService: AuthenticationService, private HindiDataService: HindiDataService, calendar: NgbCalendar, private userService: userService,private locationService: LocationService,private problemService: problemService,private router: Router, private spinner: NgxSpinnerService) {
        document.body.style.background = 'none';
        this.spinner.show();
        this.getLocationTree();
        this.getLocationUsers();
        this.getLocationProblem();
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
    
    getLocationUsers(){
        var _this = this;
        this.userService.getLocationUsers({location : localStorage.getItem('location')}).subscribe(
            data => {
               this.locationUsers = data.locationUsers;
            },
            error => {})   
    }
    getLocationProblem(){
        var _this = this;
        this.problemService.getLocationProblem({location : localStorage.getItem('location')}).subscribe(
            data => {
               this.locationProblem = data.locationProblem;
            },
            error => {})   
    }

    addUser(event:any) {
        var data = {"eid" : event.newData.eid,
        "location" : localStorage.getItem('location'),
        "viewPermissionRoot" : event.newData.viewPermissionRoot
                    };
        this.userService.insertUser(data
        ).subscribe(
            data => {
                event.confirm.resolve(event.newData);
                this.router.navigate(['']);
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
                    "siteEngineer" : event.newData.siteEngineer,
                    "engineerInCharge" : event.newData.engineerInCharge,
                    "hod" : event.newData.hod,
                    "workOrderNo" : event.newData.workOrderNo,
                    "workOrderDetails" : event.newData.workOrderDetails,
                    "location" : localStorage.getItem('location')};
        this.problemService.insertProblem(data
        ).subscribe(
            data => {
                event.confirm.resolve(event.newData);
                this.router.navigate(['']);
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
                    this.router.navigate(['']);
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
                      this.router.navigate(['']);
                  },
                  error => {
                      if (error.error instanceof Error) {
                          console.log("Client-side error occured.");
                      } else {
                          console.log("Server-side error occured.");
                      }
                  });
          }
    
        deleteUser(event:any) {
            var data = {"eid" : event.data.eid,
                      "location" :  localStorage.getItem('location'),
                      "viewPermissionRoot" : event.data.viewPermissionRoot,
                      "_id" : event.data._id
            }
            this.userService.deleteUser(data
              ).subscribe(
                  data => {
                      event.confirm.resolve(event.data);
                      this.router.navigate(['']);
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
                      this.router.navigate(['']);
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
            "officer": "admin" + this.newLocation.tag.replace(/ /g,''),
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