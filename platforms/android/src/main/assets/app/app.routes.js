"use strict";
var router_1 = require("nativescript-angular/router");
var login_1 = require("./pages/login/login");
exports.routes = [
    { path: "", component: login_1.LoginPage }
];
exports.APP_ROUTER_PROVIDERS = [
    router_1.nsProvideRouter(exports.routes, {})
];
