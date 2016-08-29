import {RouterConfig}    from "@angular/router";
import {nsProvideRouter} from "nativescript-angular/router"
import {LoginPage}       from "./pages/login/login";

export const routes: RouterConfig = [
  { path: "", component: LoginPage }
];

export const APP_ROUTER_PROVIDERS = [
  nsProvideRouter(routes, {})
];