import { Component,  ChangeDetectorRef, ViewContainerRef} from '@angular/core';
import { LocationService } from '../_services';
import { userService } from '../_services';
import { problemService } from '../_services';
import { complaintService } from '../_services';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../_services';
 
import { NgbDate, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import { Router,NavigationEnd } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner'
import 'babel-polyfill'
import { callbackify } from 'util';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['../home/home.component.css']
})
export class UserComponent{
  locationList: any = [];
    locationMap: any;
    problemLocationMap : any[]=[]
    currentView = "complaintView";
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
    locationProblems : any[] = [];
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
    settingsViewer : any;
    settingsIncharge : any;
    settingsComplaint : any;
    lockedWindow : any;
    locationConfig : any = "";
    locationUsers : any = [];
    locationProblem : any[] = [];
    selectLocationSubTree: any = this.filteredLocationList[0];
    userComplaints : any[]=[];
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

    userSubMenu : any;
    initialiseMenu: boolean = true; 
    newLocation :any = {
        tag : "",
        parent : "",
        officer:"",
        label: "",
        key: "ioc123",
        icon : "fa fa-university fa-1x"
    }

    userTypes = [{name: "siteEngineer"},{name: "engineerInCharge"},{name:"hod"}];

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

    searchTree = function(item: any, location: any) {
        this.items = item
        this.locationsearchTree(item, location)
        return [this.items]
    }

    locationsearchTree = function(item: any, location: any) {
        var __this = this;
        if (item.tag == location || (typeof item.tag === 'string' && item.tag.includes(location))) {
            this.items = item
        } else {
            item.items.map(function(ob: any) {
                __this.locationsearchTree(ob, location)
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

    // deleteLocation = function(location: any){
    //     this.locationService.deleteLocation(location).subscribe(
    //             (data:any) => {
    //                this.getLocationTree();

    //             },
    //             (error:any) => {});
    // }

    selectLocation(selectedloc: any) {
        var _this = this;
        this.selectedLocationElement = selectedloc;
        this.currentLocation  =  {
            tag : selectedloc ? selectedloc.innerText : this.selectLocationSubTree.tag,
        };
        this.setcomplaintsFilter(selectedloc)
        if (this.initialiseMenu == true) {
            this.searchTreeLocationIndex(this.filteredLocationList[0], selectedloc ? selectedloc.innerText : this.selectLocationSubTree.tag);
        }
        this.locationListFiltered = this.locationList.filter(function(loc:any){
            var filterLocation = (_this.selectedLocationElement != null)? (_this.selectedLocationElement.innerText === (loc.parent?loc.parent:null)) : false;
           
        
            return filterLocation;
        });

        this.initTableSettings()
        this.initialiseMenu = true;
    }


    initTableSettings = function(){
        this.settingsComplaint = {
            columns: {
              complaintID : {
                  title : "Complaint ID",
                  editable : false,
                  addable:false
              },    
              problem: {
                title: 'Problem',
                editor: {
                  type: 'list',
                  config: {
                  selectText: 'Select',
                     list: this.locationProblems.map(function(loc:any){
                                  loc.value = loc.problem;
                                  loc.title = loc.problem;
                                  return loc
                              })       
                          }
                      }
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
              createdDate: {
                  title: 'Created Date',
                  editable : false,
                  addable:false,
                  sort: true,
                  sortDirection : 'desc'
                },
              lastUpdated: {
                 title: 'Last Updated',
                 editable : false,
                 addable:false
                },
              status: {
                title: 'Status',
                editable : false,
                addable: false
              },
              remarks: {
                title: 'Remarks',
                editable : false,
                addable: false
              },
        }, 
            add:{
                confirmCreate:true,
                // addButtonContent : "<button class = 'addNew'><i id = ''> </i></button>"
            },
            edit:{
                 confirmSave:true
                },
            delete :{
                    confirmDelete: true
                  }
    
          };
  
  
          this.settingsIncharge = {
            columns: {
              eid: {
                title: 'EmployeeID',
                editable : false
              },
              name:{
                title:"Name",
                editable : false
            },  
            
              complaintID : {
                title : "Complaint ID",
                editable : false
            },  
              problem: {
                title: 'Problem',
                editable : false
              },
              description: {
                title: 'Description',
                editable : false
              },           
              createdDate: {
                  title: 'Created Date',
                  editable : false,
                  sort: true,
                  sortDirection : 'desc'
                },
              lastUpdated: {
                 title: 'Last Updated',
                 editable : false
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
              status: {
                title: 'Status',
                editor: {
                  type: 'list',
                  config: {
                  selectText: 'Select',
                     list: [
                      {value: 'In Process', title: 'In Process'},
                      {value: 'Completed', title: 'Completed'},
                      {value: 'Submitted', title: 'Submitted`'},
                      {value: 'Closed', title: 'Closed'}
                    ]    
                 }
         }
              },
              remarks: {
                title: 'Remarks'
              },
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
  
          this.settingsViewer = {
            columns: {
              eid: {
                title: 'EmployeeID'
              },
              name:{
                  title:"Name"
              },
              complaintID : {
                title : "Complaint ID",
              },  
              problem: {
                title: 'Problem'
              },
              description: {
                title: 'Description'
              },           
              createdDate: {
                  title: 'Created Date',
                  sort: true,
                  sortDirection : 'desc'
                },
              lastUpdated: {
                 title: 'Last Updated'
                },
              priority: {
                title: 'Priority'
              },
              status: {
                title: 'Status'
              },
              remarks: {
                title: 'Remarks'
              },
        },
        actions: {
          add: false,
          edit: false,
          delete: false,
        },
          };
    }

    setcomplaintsFilter = function(location:any){
      if(location.innerText.indexOf(":")!=-1){
        this.currentView = "blankView";
     }
      else if(location.innerText.indexOf(",")!=-1){
        this.currentView = "inchargeView";
        this.problemLocationMap = location.innerText.split(/\s*,\s*/);
        this.getLocationProblemComplaints();
      }
      else if(location.innerText === "My Complaints"){
        this.currentView = "complaintView";
        this.username = location.innerText;
        this.getUserComplaints();
      }
      else {
        this.currentView = "viewerView";
        this.locationMap = location.innerText
        this.getLocationComplaints();
       }      
    }

    addNewComplaint = function(event: Event){
        var element = document.getElementsByClassName('ng2-smart-action-add-add')[0];

    }
  
    constructor(private chRef: ChangeDetectorRef,private toastr: ToastrService, private modalService: NgbModal, private AuthenticationService: AuthenticationService, calendar: NgbCalendar, private userService: userService,private locationService: LocationService,private problemService: problemService,private complaintService: complaintService,private router: Router, private spinner: NgxSpinnerService) {
        document.body.style.background = 'none';
        this.spinner.show();
        this.getLocationProblems();
        this.getLocationTree();
   //     this.getLocationUsers();
        this.getUserComplaints();     
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

    getLocationProblems(){
        var _this = this;
        this.locationService.getLocationProblems({location : localStorage.getItem('location')} ).subscribe(
            data => {
                this.locationProblems = data.locationProblems;
                this.initTableSettings()
            },
            error => {})
        }

        
    // getInchargeComplaints(){
    //     var _this = this;
    //     this.complaintService.getInchargeComplaint({user : localStorage.getItem('username')}).subscribe(
    //         data => {
    //             this.userComplaints = data.complaints;
    //         },
    //         error => {})   
    // }   

        
    getUserComplaints(){
        var _this = this;
        this.complaintService.getUserComplaint({user : localStorage.getItem('username')}).subscribe(
            data => {
                this.userComplaints = data.complaints;
            },
            error => {})   
    }        

    
    getLocationProblemComplaints(){
        var _this = this;
        this.complaintService.getLocationProblemComplaints({location : _this.problemLocationMap[1],problem : _this.problemLocationMap[0]}).subscribe(
            data => {
                this.userComplaints = data.complaints;
            },
            error => {})   
    }

    getLocationComplaints(){
        var _this = this;
        this.complaintService.getLocationComplaint({location : _this.locationMap}).subscribe(
            data => {
                this.userComplaints = data.complaints;
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
    
    getUserSubTree(callback:any){
        var _this = this;
        this.problemService.getLocationProblem({location : localStorage.getItem('location')}).subscribe(
            data => {
              _this.locationProblem = <any []>data.locationProblem;
              _this.userSubMenu = _this.userTypes.reduce(function(filteredSubMenu:any, userType:any){
                _this.locationProblem.map(function(problem:any){
                  if(problem[userType.name] == Number(localStorage.getItem('username'))){
                    if(!userType.userTypeFound){
                      userType.userTypeFound = true;
                      filteredSubMenu.push({                
                        tag: userType.name,
                        parent: "",
                        label : userType.name + " :",
                        problem : "NA",
                        location : "NA",
                        officer : "",
                        key: "",
                        faIcon: "",
                        items : []})
                     }
                      filteredSubMenu.map(function(menuItem:any){
                        if(menuItem.tag == userType.name){
                          menuItem.items.push({
                            tag: problem.problem,
                            parent: "",
                            label :  problem.problem + ", " + problem.location,
                            officer : "",
                            key: "",
                            faIcon: "",
                            items : []
                          })
                        }
                      })                     
                    }
                  return problem  
                })
                return filteredSubMenu;
              },[])  
              callback();
              },
            error => {})   
    }
    addComplaint(event:any) {
      var data = {   
        "eid" : localStorage.getItem('username'),
        "name": localStorage.getItem('name'),
        "createdDate" : (new Date()).toLocaleString(),
        "lastUpdated" : (new Date()).toLocaleString(),
        "location": localStorage.getItem('location'),
        "problem" : event.newData.problem,
        "description" : event.newData.description,
        "priority" : event.newData.priority,
        "status" : "Submitted",
        "remarks" : "",
        "history" : <any>[]     
    };
      this.complaintService.insertComplaint(data
      ).subscribe(
          data => {
              event.confirm.resolve(event.newData);
              this.getUserComplaints();
          },
          error => {
              if (error.error instanceof Error) {
                  console.log("Client-side error occured.");
              } else {
                  console.log("Server-side error occured.");
              }
          });
    }


    updateComplaint(event:any) {
      var data = {"eid" : event.newData.eid,
      "name": event.newData.name,
        "problem" : event.newData.problem,
        "createdDate" : event.newData.createdDate,
        "lastUpdated" : (new Date()).toLocaleString(),
        "location" : event.newData.location,
        "description" : event.newData.description,
        "priority" : event.newData.priority,
        "status" : event.newData.status,
        "remarks" :event.newData.remarks,
        "history" : <any>[],   
        "_id" : event.newData._id,
        "complaintID" : event.newData.complaintID
      }
      this.complaintService.editComplaint(data
        ).subscribe(
            data => {
                event.confirm.resolve(event.newData);
                this.setcomplaintsFilter({innerText : this.currentLocation.tag})
            },
            error => {
                if (error.error instanceof Error) {
                    console.log("Client-side error occured.");
                } else {
                    console.log("Server-side error occured.");
                }
            });
    }
  
    deleteComplaint(event:any) {
        var data = {"eid" : event.data.eid,
                  "problem" : event.data.problem,
                "name" : event.data.name,
                  "description" : event.data.description,
                  "priority" : event.data.priority,
                  "status" : "submitted",
                  "remarks" : "",
                  "history" : <any>[],
                  "_id" : event.data._id
        }
        this.complaintService.deleteComplaint(data
          ).subscribe(
              data => {
                  event.confirm.resolve(event.data);
                  this.setcomplaintsFilter({innerText : this.currentLocation.tag})
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
        this.filteredLocationList = []
        this.appitems = [];
        this.locationConfig = [];
        this.locationService.getLocationConfig().subscribe(data => {
            this.locationConfig = data
            var viewPermissionRoot = localStorage.getItem('viewPermissionRoot');
            if(viewPermissionRoot != "null")
              this.appitems = this.searchTree(this.locationConfig[0], localStorage.getItem('viewPermissionRoot'))
            else{
             this.appitems = null;
            }
            var _this = this;
            this.getUserSubTree(function(){
              _this.filteredLocationList = _this.appitems = [
                {tag: "My Complaints",
                parent: "",
                label : "My Complaints",
                officer : "",
                key: "",
                faIcon: "",
                items : _this.userSubMenu
              },_this.checkHierarchy()]
            });
        
        },
        error => {});
    }

    logOut() {
        this.AuthenticationService.logout();
    }

    checkHierarchy()
        {
            return this.appitems ? {              
            tag: "View Hierarchy",
            parent: "",
            label : "View Hierarchy :",
            officer : "",
            key: "",
            faIcon: "",
            items : this.appitems
        }: null}

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
    showSuccess() {
        this.toastr.success('Hello world!', 'Toastr fun!');
      }

}
