import { Injectable }          from "@angular/core";
import { Router, CanActivate } from "@angular/router";
import * as appSettings        from "application-settings";

@Injectable()
export class AuthGuard implements CanActivate {
  
  constructor(private router: Router) {  }

  canActivate() {
    this.userToken = appSettings.getString("userToken");
    this.objectId = appSettings.getString("objectId");
    if (this.userToken) {
      return true;
    }
    else {
      this.router.navigate(["/login"]);
      return false;
    }
  }
}