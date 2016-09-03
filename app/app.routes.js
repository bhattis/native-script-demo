"use strict";
var router_1 = require("nativescript-angular/router");
var login_1 = require("./pages/login/login");
var dashboard_1 = require("./pages/dashboard/dashboard");
var auth_guard_1 = require("./auth.guard");
exports.routes = [
    { path: "", component: dashboard_1.DashboardPage, canActivate: [auth_guard_1.AuthGuard] },
    { path: "login", component: login_1.LoginPage }
];
exports.APP_ROUTER_PROVIDERS = [
    router_1.nsProvideRouter(exports.routes, { enableTracing: false }),
    auth_guard_1.AuthGuard
];
