exports.ActiveDirectory = require('activedirectory');
exports.config = { url: 'ldap://dcmjpl.ds.indianoil.in',
               baseDN: 'DC=DS,DC=INDIANOIL,DC=IN',
               username: 'IOC\\00509060',
               password: 'Valleyforge42' }

exports.locationConfig = appitems = [{
                label: "Indian Oil",
                faIcon: 'fa fa-sitemap fa-1x',
                tag : "Indian Oil",
                officer: "0030000",
                externalRedirect: true,
                items: [{
                    label: "Piplines",
                    faIcon: 'fa fa-sitemap fa-1x',
                    tag : "Piplines",
                    officer: "0040000",
                    items: [{
                        label: "NRPL",
                        faIcon: 'fa fa-sitemap fa-1x',
                        tag : "NRPL",
                        officer: "0050000",
                        items: [{
                            label: "NRPL Bijwasan",
                            faIcon: 'fa fa-sitemap fa-1x',
                            tag : "NRPL Bijwasan",
                            officer: "0093853",
                            items: [{
                                label: "NRPL Mathura",
                                tag : "NRPL Mathura",
                                faIcon: 'fa fa-sitemap fa-1x',
                                officer: "00509263",
                                items:[]
                            }, {
                                label: "NRPL Tundla",
                                faIcon: 'fa fa-sitemap fa-1x',
                                tag : "NRPL Tundla",
                                officer: "00505169",
                                items:[]
                            }, {
                                label: "NRPL Meerut",
                                faIcon: 'fa fa-sitemap fa-1x',
                                tag : "NRPL Meerut",
                                officer: "00505118",
                                items:[]
                            }, {
                                label: "NRPL Tikrikalan",
                                faIcon: 'fa fa-sitemap fa-1x',
                                tag : "NRPL Tikrikalan",
                                officer: "00095365",
                                items:[]
                            }, {
                                label: "NRPL Bharatpur",
                                faIcon: 'fa fa-sitemap fa-1x',
                                tag : "NRPL Bharatpur",
                                officer: "",
                                items:[]
                            }, {
                                label: "NRPL Bijwasan IS Department",
                                faIcon: 'fa fa-sitemap fa-1x',
                                tag : "NRPL Bijwasan IS Department",
                                officer: "00509060",
                                items:[]
                            }
                        ]
                        }, {
                            label: "NRPL IS Department",
                            faIcon: 'fa fa-sitemap fa-1x',
                            tag : "NRPL IS Department",
                            officer: "00094089",
                            items:[]
                        }, {
                            label: "NRPL Ambala",
                            faIcon: 'fa fa-sitemap fa-1x',
                            tag : "NRPL Ambala",
                            officer: "00300001",
                            items:[]
                        }, {
                            label: "NRPL Bhatinda",
                            faIcon: 'fa fa-sitemap fa-1x',
                            tag : "NRPL Bhatinda",
                            officer: "00300001",
                            items:[]
                        }, {
                            label: "NRPL Cohand",
                            faIcon: 'fa fa-sitemap fa-1x',
                            tag : "NRPL Cohand",
                            officer: "0030007",
                            items:[]
                        }, {
                            label: "NRPL Rewadi",
                            faIcon: 'fa fa-sitemap fa-1x',
                            tag : "NRPL Rewadi",
                            officer: "0030008",
                            items:[]
                        }, {
                            label: "Rewadi",
                            faIcon: 'fa fa-sitemap fa-1x',
                            tag : "NRPL Rewadi",
                            officer: "0030009",
                            items:[]
                        },{
                            label: "Najibabad",
                            faIcon: 'fa fa-sitemap fa-1x',
                            tag : "NRPL Najibabad",
                            officer: "00300010",
                            items:[]
                        }]
                    }, {
                        label: "PLHO",
                        faIcon: 'fa fa-sitemap fa-1x',
                        tag : "PLHO",
                        officer: "0020001",
                        items:[]
                    }, {
                        label: "WRPL",
                        faIcon: 'fa fa-sitemap fa-1x',
                        tag : "WRPL",
                        officer: "0020002",
                        items:[]
                    }, {
                        label: "ERPL",
                        faIcon: 'fa fa-sitemap fa-1x',
                        tag : "ERPL",
                        officer: "0020003",
                        items:[] 
                    }, {
                        label: "SERPL",
                        faIcon: 'fa fa-sitemap fa-1x',
                        tag : "SERPL",
                        officer: "0020004",
                        items:[] 
                    }, {
                        label: "SRPL",
                        faIcon: 'fa fa-sitemap fa-1x',
                        tag : "SRPL",
                        officer: "0020005",
                        items:[]
                    }]
                }, {
                    label: "Refinery",
                    faIcon: 'fa fa-sitemap fa-1x',
                    tag : "Refinery",
                    officer: "0040001",
                    items:[]
                }]
            }]

exports.ad = new exports.ActiveDirectory(exports.config); 