import {RouterConfig}    from "@angular/router";
import {nsProvideRouter} from "nativescript-angular/router"
import {LoginPage}       from "./pages/login/login";
import {DasdboardPage}   from "./pages/dashboard/dashboard";
import {AuthGuard}       from "./auth.guard";

export const routes: RouterConfig = [
  { path: "", component: DasdboardPage, canActivate: [AuthGuard] },
  { path: "login", component: LoginPage }
];

export const APP_ROUTER_PROVIDERS = [
  nsProvideRouter(routes, { enableTracing: false  }),
  AuthGuard
];