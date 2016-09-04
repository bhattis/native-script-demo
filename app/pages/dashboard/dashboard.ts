import { Component, ElementRef, 
  OnInit, ViewChild }             from "@angular/core";
import { Router }                 from "@angular/router";
import { Page }                   from "ui/page";
import { TextField }              from "ui/text-field";
import { User }                   from "../../model/user";
import { setHintColor }           from "../shared/hint_util";
import { alert }                  from "../shared/dialog_util";
import { DatabaseService }        from "../../services/database_service";
import { connectionType, 
  getConnectionType }             from "connectivity";
import * as appSettings           from "application-settings";

@Component({
  selector:    "dashboard",
  templateUrl: "pages/dashboard/dashboard.html",
  styleUrls:   ["pages/dashboard/dashboard_common.css", "pages/dashboard/dashboard_component.css"]
})

export class DashboardPage {

  private user: User;

  constructor(private backend: DatabaseService,
    private router: Router) { 
      this.user = JSON.parse(appSettings.getString("loggedInUser"));
    }

  onLogout() {
    if (getConnectionType() === connectionType.none) {
      alert("MyApp requires an internet connection to log in.");
      return;
    }

    this.backend.logout().subscribe(
      response => { appSettings.clear(); },
      error => { 
        console.log("logout error: ", [error]);
        appSettings.clear();
      },
      () => { 
        appSettings.clear();
        this.router.navigate(["/login"]);
      }
    );
  }

  onShare() {
    console.log("Share action item tapped.");
  }

}