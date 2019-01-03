import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { first } from 'rxjs/operators';
import { NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { User } from '../_models';
import { UserService, LocationService } from '../_services';
import { StatutoryClerance } from '../_services';
import {  FileUploader, FileSelectDirective } from 'ng2-file-upload/ng2-file-upload';
import { Pipe, PipeTransform } from '@angular/core';
import { DEFAULT_INTERPOLATION_CONFIG } from '@angular/compiler';
import { formatDate } from '@angular/common';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../_services';
import {HindiDataService}  from '../_services';
import {NgbDate, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import {AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import {Router,NavigationEnd } from '@angular/router';
import { Chart } from 'angular-highcharts';
import { NgxSpinnerService } from 'ngx-spinner'
import 'babel-polyfill'

@Component({
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.css'],
    providers: [HindiDataService],
})

export class HomeComponent implements OnInit {
    stations: any    = [];
    adminMode: boolean;
    items: any;
    navigationSubscription:any;
    modalHeading: string = ""
    closeResult: string;
    appitems: any = [];
    selectedLocationElement:any;
    filteredLocationList: any = [];
    currentEntryMode = "";
    flattenedLocationList: any[] = [];
    newEntry: any;
    hoveredDate: NgbDate;
    todayDate = new Date();
    maxDate = {year:this.todayDate.getFullYear(), month:this.todayDate.getMonth()+1, day: this.todayDate.getDate()};
    startDate :any
    endDate :any

    
    searchDateRange = {};
    fromDate: NgbDate;
    currentLocation : any;
    newEditLocation : any = {
        parent : "",
        employee : "",
        tag:"",
        officerEmail: "",
        coordinatorEmail:"",
        frequency : ""
    }
    toDate: NgbDate;
    selectedDateDuration: 15;
    clickedItems: any = [];
    locationList: any = [];
    tempTotalHLettersSent: any[] = [];
    tempTotalELettersSent: any[] = [];
    tempTotalHEmailsSent: any[] = [];
    tempTotalHCommentsSent: any[] = [];
    tempTotalECommentsSent: any[] = [];
    tempTotalHLettersRecieved: any[] = [];
    tempTotalELettersRecieved: any[] = [];
    tempTotalHCorrespondenceSent: any[] = [];
    totalHLettersSent: any[] = [];
    totalELettersSent: any[] = [];
    totalHEmailsSent: any[] = [];
    totalHCommentsSent: any[] = [];
    totalECommentsSent: any[] = [];
    totalHLettersRecieved: any[] = [];
    totalELettersRecieved: any[] = [];
    totalHCorrespondenceSent: any[] = [];
    flattenedSummaryList: any = [];
    //Chart options
    subtreeSelected:boolean=false;
    addRecordsAllowed : boolean  =false;
    single : any[];  
    flattenedPieSummaryList : any;
    chart1 : any;
    chart2 : any;
    chart3 : any;
    chart4 : any;
    chartOptions : any;
    chart5 : any;
    chart6 : any;
    chart7 : any;
    chart8 : any;
    chart9 : any;
    duplicateFound = false;
    view: any[] = [200, 250];
    frequency: any[] = [15, 30];
    
  
    // options
    showXAxis = true;
    showYAxis = true;
    gradient = false;
    showLegend = false;
    showXAxisLabel = true;
    xAxisLabel = '';
    showYAxisLabel = true;
    yAxisLabel = '';
    locationConfig : any = "";
    showSummary : boolean = false;
    colorScheme = {
      domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA','#FF7F50','#FF6347','#FF4500','#7E57C2','#F4511E','#8D6E63']
    };
  
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
        parent : "",//this.selectLocationSubTree? this.selectLocationSubTree.tag : this.filteredLocationList[0].tag,
        officer:"",
        label: "",
        officerEmail: "",
        coordinatorEmail : "",
        frequency:""
    }

    initNewLocation(){
        this.newLocation = {
            tag : "",
            parent : this.selectLocationSubTree? this.selectLocationSubTree.tag : this.filteredLocationList[0].tag,
            officer:"",
            label: "",
            officerEmail: "",
            coordinatorEmail : "",
            frequency : ""
        }
    
    }

    inititateNewRecord() {
        this.newEntry = {
            hLettersSent: "",
            eLettersSent: "",
            hEmailsSent: "",
            hCommentsSent: "",
            eCommentsSent: "",
            hLettersRecieved: "",
            eLettersRecieved: "",
            hCorrespondenceSent: "",
            tag: this.selectLocationSubTree? this.selectLocationSubTree.tag : this.filteredLocationList[0].tag,
            fromDate: "",
            toDate: ""
        }
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

    flattenSummary = function(list: any) {
        var __this = this;
        list.summary.tag = list.tag;
        __this.flattenedSummaryList.push({
            tag: list.tag,
            summary: list.summary
        })
        list.items.map(function(ob: any) {
            __this.flattenSummary(ob)
        })
        return __this.flattenedSummaryList;
    }

    selectLocation(selectedloc: any) {
        this.selectedLocationElement = selectedloc;
        this.currentLocation  =  {
            tag : selectedloc ? selectedloc.innerHTML : this.selectLocationSubTree.tag,
        };
        if (this.initialiseMenu == true) {
            this.searchTreeLocationIndex(this.filteredLocationList[0], selectedloc ? selectedloc.innerHTML : this.selectLocationSubTree.tag);
            this.getLocationHindiRecords(this.clickedItems);
        }
        this.initialiseMenu = true;
    }

    
    constructor(private _statutoryClerance: StatutoryClerance, private chRef: ChangeDetectorRef, private modalService: NgbModal, private AuthenticationService: AuthenticationService, private HindiDataService: HindiDataService, calendar: NgbCalendar, private locationService: LocationService,private router: Router, private spinner: NgxSpinnerService) {
        document.body.style.background = 'none';
            this.spinner.show();
        this.navigationSubscription = this.router.events.subscribe((e: any) => {
            if (e instanceof NavigationEnd) {
              this.initialiseInvites();
            }
          });


        let current = new Date();
        this.searchDateRange = {
            endDate: this.todayDate,
            startDate: new Date(current.setDate(current.getDate() - 31))
        }
        this.fromDate = calendar.getNext(calendar.getToday(), 'd', 15);
        this.toDate = calendar.getToday();
        this.initialiseMenu = false;
        this.getLocationTree();
    }

     initialiseInvites() {
   // Set default values and re-fetch any data you need.
    }
        ngOnDestroy() {
            // avoid memory leaks here by cleaning up after ourselves. If we  
            // don't then we will continue to run our initialiseInvites()   
            // method on every navigationEnd event.
            if (this.navigationSubscription) {  
            this.navigationSubscription.unsubscribe();
            }
        }

    getLocationTree(){
        this.locationService.getLocationHierarchy().subscribe(
            data => {
               // this.addRecordsAllowed = data.addRecordsAllowed;
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
            this.locationService.setFilteredLocationTree(this.filteredLocationList);
            this.inititateNewRecord();
            this.initNewLocation();
            this.getLocationHindiRecords(this.filteredLocationList[0])
        },
        error => {});
    }

    filterFlattenSummary(list: any) {
        let __this = this
        list = list.filter(function(location: any) {
            return (location.tag == __this.selectLocationSubTree.tag && __this.selectLocationSubTree.items.length == 0) || __this.selectLocationSubTree.items.some(function(loc: any) {
                return loc.tag == location.tag;
            }) //|| __this.selectLocationSubTree.tag == location.tag;
        })
        this.tempTotalELettersRecieved = [];
        this.tempTotalELettersSent = [];
        this.tempTotalHCommentsSent = [];
        this.tempTotalECommentsSent = [];
        this.tempTotalHLettersRecieved = [];
        this.tempTotalHLettersSent = [];
        list.map(function(location:any){
            __this.tempTotalHLettersSent.push({
                "name":location.tag,
                "data" :[Number(location.summary.hiraricalTotalHLettersSent)]
            }) 
            __this.tempTotalECommentsSent.push({
                "name":location.tag,
                "data" :[Number(location.summary.hiraricalTotalECommentsSent)]
            })
            __this.tempTotalELettersRecieved.push({
                "name":location.tag,
                "data" :[Number(location.summary.hiraricalTotalELettersRecieved)]
            })
            __this.tempTotalHLettersRecieved.push({
                "name":location.tag,
                "data" :[Number(location.summary.hiraricalTotalHLettersRecieved)]
            })            
            __this.tempTotalELettersSent.push({
                "name":location.tag,
                "data" :[Number(location.summary.hiraricalTotalELettersSent)]
            })
            __this.tempTotalHCommentsSent.push({
                "name":location.tag,
                "data" :[Number(location.summary.hiraricalTotalHCommentsSent)]
            })
            return location;
        })
        this.totalHCommentsSent = this.tempTotalHCommentsSent;       
        this.totalHLettersSent = this.tempTotalHLettersSent;
        this.totalHLettersRecieved = this.tempTotalHLettersRecieved;
        this.totalECommentsSent = this.tempTotalECommentsSent;
        this.totalELettersRecieved = this.tempTotalELettersRecieved;
        this.totalELettersSent = this.tempTotalELettersSent;
        
        return list
    }

    getLocationHindiRecords(filteredLocationList: any) {
        this.flattenedSummaryList = [];
        this.showSummary = false;
        //this.flattenedLocationList = [];
        this.HindiDataService.getRecords({
            tags: this.flattenList(filteredLocationList),
            searchDateRange: this.searchDateRange
        }).subscribe(data => {
                this.HindiDataService.data = data.allRecords;
                this.HindiDataService.summary = data.summary || [];
                let __this = this;

                this.HindiDataService.summary.map(function(locationSummary: any) {
                     __this.filteredLocationList.map(function recursivePush(locationData: any) {
                        if (locationData.tag == locationSummary.tag) {
                            locationData.summary = locationSummary;
                         } else {
                            if (locationData.summary == undefined) {
                                locationData.summary = {};
                            }
                        }
                        console.log(locationData)
                        if (locationData.items.length > 0) {
                            locationData.items.map(function(location: any) {
                                recursivePush(location)
                                return location
                            })
                        }
                        return locationData;
                    })
                    return locationSummary
                })
                console.log(this.HindiDataService.summary)
                
                
                
                function resetHiraricalTotalHLettersSentSum(loc: any) {
                        loc.summary.hiraricalTotalHLettersSent = loc.items.reduce(function(r: any, a: any) {
                            resetHiraricalTotalHLettersSentSum(a);
                        return 0;
                    }, 0)
                }
                function resetHiraricalTotalELettersSentSum(loc: any) {
                    loc.summary.hiraricalTotalELettersSent = loc.items.reduce(function(r: any, a: any) {
                        resetHiraricalTotalELettersSentSum(a);
                    return 0;
                }, 0)
            }


                function resetHiraricalTotalHCommentsSentSum(loc: any) {
                    loc.summary.hiraricalTotalHCommentsSent = loc.items.reduce(function(r: any, a: any) {
                        resetHiraricalTotalHCommentsSentSum(a);
                    return 0;
                }, 0)
            }
                    function resetHiraricalTotalECommentsSentSum(loc: any) {
                        loc.summary.hiraricalTotalECommentsSent = loc.items.reduce(function(r: any, a: any) {
                            resetHiraricalTotalECommentsSentSum(a);
                        return 0;
                    }, 0)
                }
                function resetHiraricalTotalHLettersRecievedSum(loc: any) {
                    loc.summary.hiraricalTotalHLettersRecieved = loc.items.reduce(function(r: any, a: any) {
                        resetHiraricalTotalHLettersRecievedSum(a);
                    return 0;
                }, 0)
            }
                function  resetHiraricalTotalELettersRecievedSum(loc: any) {
                    loc.summary.hiraricalTotalELettersRecieved = loc.items.reduce(function(r: any, a: any) {
                        resetHiraricalTotalELettersRecievedSum(a);
                    return 0;
                }, 0)
                }

                
                function hiraricalTotalHLettersSentSum(loc: any) {
                    loc.summary.hiraricalTotalHLettersSent = (loc.summary === undefined ? 
                                      0 : (loc.summary.hiraricalTotalHLettersSent !== undefined ? 
                                            loc.summary.hiraricalTotalHLettersSent : 0)  + 
                                          (loc.summary.totalHLettersSent !== undefined ? 
                                                Number(loc.summary.totalHLettersSent)  : 0)  + 
                                              loc.items.reduce(function(r: any, a: any) {
                                                hiraricalTotalHLettersSentSum(a);
                    return r + (a.summary.hiraricalTotalHLettersSent || 0);
                }, 0))
            }
                function hiraricalTotalELettersSentSum(loc: any) {
                    loc.summary.hiraricalTotalELettersSent = (loc.summary === undefined ? 
                        0 : (loc.summary.hiraricalTotalELettersSent !== undefined  ?
                            loc.summary.hiraricalTotalELettersSent : 0)  +
                            (loc.summary.totalELettersSent !== undefined  ?  
                                   Number(loc.summary.totalELettersSent) : 0 ) + 
                                    loc.items.reduce(function(r: any, a: any) {
                                        hiraricalTotalELettersSentSum(a);
                return r + (a.summary.hiraricalTotalELettersSent || 0);
                }, 0))
                             
            }   

            function hiraricalTotalHCommentsSentSum(loc: any) {
                loc.summary.hiraricalTotalHCommentsSent = loc.summary === undefined ? 
                                0 : (loc.summary.hiraricalTotalHCommentsSent  !== undefined  ? 
                            loc.summary.hiraricalTotalHCommentsSent : 0) + 
                            (loc.summary.totalHCommentsSent !== undefined  ?
                                        Number(loc.summary.totalHCommentsSent) : 0 )+ 
                                        loc.items.reduce(function(r: any, a: any) {
                                            hiraricalTotalHCommentsSentSum(a);
                return r + (a.summary.hiraricalTotalHCommentsSent || 0);
                }, 0)                                
            }  
            
            function hiraricalTotalECommentsSentSum(loc: any) {
                loc.summary.hiraricalTotalECommentsSent= (loc.summary === undefined ? 
                    0 : (loc.summary.hiraricalTotalECommentsSent  !== undefined ? 
                                loc.summary.hiraricalTotalECommentsSent  : 0) +
                                (loc.summary.totalECommentsSent !== undefined ? 
                                        Number(loc.summary.totalECommentsSent) : 0) +
                                       loc.items.reduce(function(r: any, a: any) {
                                        hiraricalTotalECommentsSentSum(a);
                return r + (a.summary.hiraricalTotalECommentsSent || 0);
                }, 0))                              
            }  
            function hiraricalTotalHLettersRecievedSum(loc: any) {
                loc.summary.hiraricalTotalHLettersRecieved = (loc.summary === undefined  ?
                                    0 : (loc.summary.hiraricalTotalHLettersRecieved  !== undefined ?
                                    loc.summary.hiraricalTotalHLettersRecieved : 0) +                                           
                                    (loc.summary.totalHLettersRecieved !== undefined ?
                                        Number(loc.summary.totalHLettersRecieved) : 0) +
                                        loc.items.reduce(function(r: any, a: any) {
                                            hiraricalTotalHLettersRecievedSum(a);
                return r + (a.summary.hiraricalTotalHLettersRecieved || 0);
                }, 0))                         
            }        
            
            function hiraricalTotalELettersRecievedSum(loc: any) {
                loc.summary.hiraricalTotalELettersRecieved =  (loc.summary === undefined ?
                    0 : (loc.summary.hiraricalTotalELettersRecieved  !== undefined ? 
                    loc.summary.hiraricalTotalELettersRecieved : 0) +
                       (loc.summary.totalELettersRecieved !== undefined  ? 
                           Number(loc.summary.totalELettersRecieved)  : 0) +
                                                    loc.items.reduce(function(r: any, a: any) {
                                                        hiraricalTotalELettersRecievedSum(a);
                        return r + (a.summary.hiraricalTotalELettersRecieved || 0);
                        }, 0)
                    )                    
            } 
                   
             
                console.log(this.HindiDataService.summary)
                if (this.selectLocationSubTree==undefined || this.subtreeSelected==false)
                    this.selectLocationSubTree = JSON.parse(JSON.stringify(this.filteredLocationList[0]));
                    resetHiraricalTotalHLettersSentSum(this.selectLocationSubTree)
                    resetHiraricalTotalELettersSentSum(this.selectLocationSubTree)
                    resetHiraricalTotalHCommentsSentSum(this.selectLocationSubTree)
                    resetHiraricalTotalECommentsSentSum(this.selectLocationSubTree)
                    resetHiraricalTotalHLettersRecievedSum(this.selectLocationSubTree)
                    resetHiraricalTotalELettersRecievedSum(this.selectLocationSubTree)


                    hiraricalTotalHLettersSentSum(this.selectLocationSubTree)
                    hiraricalTotalELettersSentSum(this.selectLocationSubTree)
                    hiraricalTotalHCommentsSentSum(this.selectLocationSubTree)
                    hiraricalTotalECommentsSentSum(this.selectLocationSubTree)
                    hiraricalTotalHLettersRecievedSum(this.selectLocationSubTree)
                    hiraricalTotalELettersRecievedSum(this.selectLocationSubTree)


                this.flattenedSummaryList = [];
                this.flattenSummary(this.selectLocationSubTree)
                this.flattenedSummaryList = this.filterFlattenSummary(this.flattenedSummaryList);
                this.flattenedPieSummaryList = this.flattenedSummaryList.reduce(function(pieData:any,location:any){
                    pieData.sentLettersEmailsSummary = {
                        totalHSent : pieData.sentLettersEmailsSummary.totalHSent + location.summary.hiraricalTotalHLettersSent,
                        totalESent : pieData.sentLettersEmailsSummary.totalESent + location.summary.hiraricalTotalELettersSent
                    }
                    pieData.recievedLettersEmailsSummary = {
                        totalHRecieved : pieData.recievedLettersEmailsSummary.totalHRecieved + location.summary.hiraricalTotalHLettersRecieved,
                        totalERecieved : pieData.recievedLettersEmailsSummary.totalERecieved + location.summary.hiraricalTotalELettersRecieved
                    }
                    pieData.sentCommentsSummary = {
                        totalHCSent : pieData.sentCommentsSummary.totalHCSent + location.summary.hiraricalTotalHCommentsSent,
                        totalECSent : pieData.sentCommentsSummary.totalECSent + location.summary.hiraricalTotalECommentsSent                      
                    }
                if(pieData.sentLettersEmailsSummary.totalHSent > 0 || pieData.sentLettersEmailsSummary.totalESent > 0 ||
                    pieData.recievedLettersEmailsSummary.totalHRecieved > 0 || pieData.recievedLettersEmailsSummary.totalERecieved > 0 ||
                    pieData.sentCommentsSummary.totalHCSent > 0 || pieData.sentCommentsSummary.totalECSent > 0)
                    __this.showSummary = true;

                return pieData
                },{
                    sentLettersEmailsSummary : {
                        totalHSent : 0,
                        totalESent : 0,
                    },
                    recievedLettersEmailsSummary : {
                        totalHRecieved : 0,
                        totalERecieved : 0,
                    },
                    sentCommentsSummary : {
                        totalHCSent : 0,
                        totalECSent : 0,
                    }
                })
                this.spinner.hide();
                this.flattenedPieSummaryList.sentLettersEmailsSummary.hindiLetterSentPercentage = this.flattenedPieSummaryList.sentLettersEmailsSummary.totalHSent/(this.flattenedPieSummaryList.sentLettersEmailsSummary.totalHSent + this.flattenedPieSummaryList.sentLettersEmailsSummary.totalESent)*100;
                this.flattenedPieSummaryList.sentLettersEmailsSummary.hindiLetterRecievedPercentage = this.flattenedPieSummaryList.recievedLettersEmailsSummary.totalHRecieved/(this.flattenedPieSummaryList.recievedLettersEmailsSummary.totalHRecieved + this.flattenedPieSummaryList.recievedLettersEmailsSummary.totalERecieved)*100;
                this.flattenedPieSummaryList.sentLettersEmailsSummary.hindiCommentsSentPercentage = this.flattenedPieSummaryList.sentCommentsSummary.totalHCSent/(this.flattenedPieSummaryList.sentCommentsSummary.totalHCSent + this.flattenedPieSummaryList.sentCommentsSummary.totalECSent)*100;

                this.chart1 = new Chart({
                    chart: {
                      type: 'pie',
                    },
                    title: {
                      text: 'विभाग द्वारा भेजे गए पत्रों/ई-मेलों - ' + this.flattenedPieSummaryList.sentLettersEmailsSummary.hindiLetterSentPercentage.toFixed(2) + '% हिंदी'
                    },
                    credits: {
                      enabled: false
                    },
                    series: [
                      {
                        name: 'विभाग द्वारा भेजे गए पत्रों/ई-मेलों - ' + this.flattenedPieSummaryList.sentLettersEmailsSummary.hindiLetterSentPercentage.toFixed(2) + '% हिंदी' ,
                        data: [['हिंदी',   this.flattenedPieSummaryList.sentLettersEmailsSummary.totalHSent], ['अंग्रेजी',      this.flattenedPieSummaryList.sentLettersEmailsSummary.totalESent] ]
                      }
                    ]
                  });
            
                  this.chart2 = new Chart({
                    chart: {
                      type: 'pie',
                    },
                    title: {
                      text: 'विभाग द्वारा लिखी जा रही टिप्‍पणियों - ' + this.flattenedPieSummaryList.sentLettersEmailsSummary.hindiLetterRecievedPercentage.toFixed(2) + '% हिंदी' ,
                    },
                    credits: {
                      enabled: false
                    },
                    series: [
                      {
                        name: 'विभाग द्वारा लिखी जा रही टिप्‍पणियों - ' + this.flattenedPieSummaryList.sentLettersEmailsSummary.hindiLetterRecievedPercentage.toFixed(2) + '% हिंदी' ,
                        data: [['हिंदी',   this.flattenedPieSummaryList.recievedLettersEmailsSummary.totalHRecieved], ['अंग्रेजी',       this.flattenedPieSummaryList.recievedLettersEmailsSummary.totalERecieved] ]
                      }
                    ]
                  });
            
                  this.chart3 = new Chart({
                    chart: {
                      type: 'pie',
                    },
                    title: {
                      text: 'विभाग में प्राप्त पत्र - ' + this.flattenedPieSummaryList.sentLettersEmailsSummary.hindiCommentsSentPercentage.toFixed(2) + '% हिंदी' 
                    },
                    credits: {
                      enabled: false
                    },
                    series: [
                      {
                        name: 'विभाग में प्राप्त पत्र - ' + this.flattenedPieSummaryList.sentLettersEmailsSummary.hindiCommentsSentPercentage.toFixed(2) + '% हिंदी' ,
                        data: [['हिंदी',   this.flattenedPieSummaryList.sentCommentsSummary.totalHCSent], ['अंग्रेजी',     this.flattenedPieSummaryList.sentCommentsSummary.totalECSent] ]
                   }
                    ]
                  });

   
                this.chart4 = new Chart({
                    chart: {
                        type: 'column', height: 300,
                    },
                    legend:{
                        enabled : false
                    },
                    title: {
                        text: ''
                    },
                    credits: {
                        enabled: false
                    },
                    xAxis: {
                        categories: [
                            '',
                        ],
                        crosshair: true
                    },
                    yAxis: {
                        min: 0,        
                        title: {
                            text: ''
                        }
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
                        footerFormat: '</table>',
                        shared: true,
                        useHTML: true
                    },
                    plotOptions: {
                        column: {
                            pointPadding: 0.2,
                            borderWidth: 0
                        }
                    },
                    series: []
                });
                this.chart4.options.title.text = "विभाग द्वारा हिन्दी में भेजे गए पत्रों/ई-मेलों की कुल संख्‍या";
                this.chart4.options.series = this.totalHLettersSent

                this.chart5 = new Chart({
                    chart: {
                        type: 'column',height: 300,
                    },
                    title: {
                        text: ''
                    },
                    legend:{
                        enabled : false,
                    },
                    credits: {
                        enabled: false
                    },
                    xAxis: {
                        categories: [
                            '',
                        ],
                        crosshair: true
                    },
                    yAxis: {
                        min: 0,        
                        title: {
                            text: ''
                        }
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
                        footerFormat: '</table>',
                        shared: true,
                        useHTML: true
                    },
                    plotOptions: {
                        column: {
                            pointPadding: 0.2,
                            borderWidth: 0
                        }
                    },
                    series: []
                });
                this.chart5.options.title.text = "विभाग द्वारा लिखी जा रही हिन्‍दी टिप्‍पणियों की  कुल संख्‍या";
                this.chart5.options.series = this.totalHCommentsSent

                this.chart6 = new Chart({
                    chart: {
                        type: 'column', height: 300,
                    },
                    title: {
                        text: ''
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'top',
                        y: 50,
                        navigation: {
                            enabled: false
                        },
                        adjustChartSize: true,
                    },
                    credits: {
                        enabled: false
                    },
                    xAxis: {
                        categories: [
                            '',
                        ],
                        crosshair: true
                    },
                    yAxis: {
                        min: 0,        
                        title: {
                            text: ''
                        }
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
                        footerFormat: '</table>',
                        shared: true,
                        useHTML: true
                    },
                    plotOptions: {
                        column: {
                            pointPadding: 0.2,
                            borderWidth: 0
                        }
                    },
                    series: []
                });
                this.chart6.options.title.text= "अंग्रेजी में भेजे गए पत्रों/ई-मेलों की कुल संख्‍या ";
                this.chart6.options.series = this.totalHLettersRecieved


                this.chart7 = new Chart({
                    chart: {
                        type: 'column', height: 300,
                    },
                    legend:{
                        enabled : false,
                    },
                    title: {
                        text: ''
                    },
                    credits: {
                        enabled: false
                    },
                    xAxis: {
                        categories: [
                            '',
                        ],
                        crosshair: true
                    },
                    yAxis: {
                        min: 0,        
                        title: {
                            text: ''
                        }
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
                        footerFormat: '</table>',
                        shared: true,
                        useHTML: true
                    },
                    plotOptions: {
                        column: {
                            pointPadding: 0.2,
                            borderWidth: 0
                        }
                    },
                    series: []
                });
                this.chart7.options.title.text= "अंग्रेजी में भेजे गए पत्रों/ई-मेलों की कुल संख्‍या ";
                this.chart7.options.series = this.totalELettersSent

                this.chart8 = new Chart({
                    chart: {
                        type: 'column',height: 300,
                    },
                    title: {
                        text: ''
                    },
                    legend:{
                        enabled : false,
                    },
                    credits: {
                        enabled: false
                    },
                    xAxis: {
                        categories: [
                            '',
                        ],
                        crosshair: true
                    },
                    yAxis: {
                        min: 0,        
                        title: {
                            text: ''
                        }
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
                        footerFormat: '</table>',
                        shared: true,
                        useHTML: true
                    },
                    plotOptions: {
                        column: {
                            pointPadding: 0.2,
                            borderWidth: 0
                        }
                    },
                    series: []
                });
                this.chart8.options.title.text = "विभाग द्वारा लिखी जा रही अंग्रेजी टिप्‍पणियों की कुल संख्‍या";
                this.chart8.options.series = this.tempTotalECommentsSent

                this.chart9 = new Chart({
                    chart: {
                        type: 'column', height: 300,
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'top',
                        y: 50,
                        navigation: {
                            enabled: false
                        },
                        adjustChartSize: true,
                    },
                    title: {
                        text: ''
                    },
                    credits: {
                        enabled: false
                    },
                    xAxis: {
                        categories: [
                            '',
                        ],
                        crosshair: true
                    },
                    yAxis: {
                        min: 0,        
                        title: {
                            text: ''
                        }
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
                        footerFormat: '</table>',
                        shared: true,
                        useHTML: true
                    },
                    plotOptions: {
                        column: {
                            pointPadding: 0.2,
                            borderWidth: 0
                        }
                    },
                    series: []
                });
                this.chart9.options.title.text = "विभाग में अंग्रेजी में प्राप्‍त कुल पत्र/ई-मेलों";
                this.chart9.options.series = this.totalELettersRecieved
                this.selectedDateDuration = this.selectLocationSubTree.frequency;

                
                this.locationList = this.flattenedSummaryList.reduce(function(locationList:any[], location:any){
                    locationList.push({
                        tag : location.tag
                    })
                    return locationList
                },[])
              //  if(this.locationList[0].tag!=this.HindiDataService.summary[0].tag)
                this.locationList.push({tag:this.selectLocationSubTree.tag});
                console.log(this.locationList)
            },
            error => {});
    }

    ngOnInit() {

    }

    logOut() {
        this.AuthenticationService.logout();

    }

    sendEntry(callbackClose:any) {
        if (this.currentEntryMode == 'add') {
            this.saveNewEntry(callbackClose);
        } else if (this.currentEntryMode == 'edit') {
            this.saveEditHindiReport();
        }
    }

    saveNewEntry(callbackClose:any) {
        let __this = this;
        __this.duplicateFound = false;
        this.newEntry.fromDate = new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day);
        this.newEntry.toDate = new Date(this.toDate.year, this.toDate.month - 1, this.toDate.day);
        this.newEntry.officerEmail = this.selectLocationSubTree.officerEmail;
        this.newEntry.coordinatorEmail = this.selectLocationSubTree.coordinatorEmail;
        this.HindiDataService.insertRecord(this.newEntry)
            .subscribe(
                data => {
                    if(data.msg=="success"){
                       this.getLocationTree();
                        callbackClose('saveClick')
                    }
                    else{
                        __this.duplicateFound = true;
                    }
                },
                error => {});
    }

    setDateRange(days: any) {
        let current = new Date();
        this.subtreeSelected = false;
        this.initialiseMenu = true;
        this.searchDateRange = {
            endDate: new Date(),
            startDate: new Date(current.setDate(current.getDate() - days - (this.todayDate.getDate() >= 15 ? 15 : 0)))
        }
        this.selectedDateDuration = days;
        this.selectLocation(this.selectedLocationElement);
    }

    setCustumDateRange(){
        let current = new Date();
        this.subtreeSelected = false;
        this.initialiseMenu = true;
        this.searchDateRange = {
            endDate: new Date(this.endDate.year, this.endDate.month - 1, this.endDate.day),
            startDate:  new Date(this.startDate.year, this.startDate.month - 1, this.startDate.day)
        }
        this.selectLocation(this.selectedLocationElement);        
    }

    saveEditHindiReport() {
        this.newEntry.fromDate = new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day);
        this.newEntry.toDate = new Date(this.toDate.year, this.toDate.month - 1, this.toDate.day);
        this.HindiDataService.editHindiReport(this.newEntry)
            .subscribe(
                data => {
                   this.getLocationTree();
                },
                error => {});
    }

    deleteHindiReport(selectedReport: any) {
        this.HindiDataService.deleteHindiReport(selectedReport)
        .subscribe(
            (data:any) => {
               this.getLocationTree();
            },
            (error:any) => {});
    }

    editHindiReport(entry: any) {
        this.newEntry = entry;
    }

    open(content: any) {
        this.modalService.open(content).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
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
        console.log("saveLocationCalled");
        this.locationService.insertLocation({
            "tag" : this.newLocation.tag,
            "parent":this.newLocation.parent,
            "officer":this.newLocation.employee,
            "label": this.newLocation.tag,
            "officerEmail" : this.newLocation.officerEmail,
            "frequency" : this.newLocation.frequency,
            "coordinatorEmail": this.newLocation.coordinatorEmail,
            "faIcon": 'fa fa-sitemap fa-1x'
        }).subscribe(
            data => {
                console.log("Location Saved");
                this.getLocationTree();
            },
            error => {
                console.log("Location save error");
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