email 	= require("emailjs");
exports.server  = email.server.connect({
    user:    "nrplisadmin", 
    password:"Isdec$18", 
    host:    "plhoarray.ds.indianoil.in",
    tls: {ciphers: "SSLv3"}
 });