"use strict";
// this import should be first in order to load some required settings (like globals and reflect-metadata)
require("reflect-metadata");
require('rxjs/add/operator/map');
var application_1 = require("nativescript-angular/application");
var http_1 = require("nativescript-angular/http");
var app_component_1 = require("./app.component");
var app_routes_1 = require("./app.routes");
var database_service_1 = require("./services/database_service");
application_1.nativeScriptBootstrap(app_component_1.AppComponent, [
    database_service_1.DatabaseService,
    http_1.NS_HTTP_PROVIDERS,
    app_routes_1.APP_ROUTER_PROVIDERS
]);
