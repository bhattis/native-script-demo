import { Injectable }      from "@angular/core";
import { 
  HTTP_PROVIDERS,
  Http,
  Request,
  RequestMethod,
  Headers }                from "@angular/http";
import { Observable }      from "data/observable";
import * as appSettings    from "application-settings";

@Injectable()
export class DatabaseService {

  private userToken: string;
  private _apiUrl = "https://api.backendless.com/v1/";
  
  private _custom_header = {
    "application-id": "1DC6D0A0-648B-CBE7-FFB9-6904A1C64600",
    "secret-key": "D408B0CD-1CCF-DA41-FF49-72908CE75A00",
    "Content-Type": "application/json",
    "application-type": "REST"
  };

  constructor(private http: Http) {

  }

  register(user) {
    let regUrl = this._apiUrl + "users/register";
    return this.http.post(
      regUrl,
      JSON.stringify(user),
      { headers: this._custom_header }
    )
  }

  login(user) {
    let loginUrl = this._apiUrl + "users/login";
    return this.http.post(
      loginUrl,
      JSON.stringify({ login: user.email, password: user.password }),
      { headers: this._custom_header }
    ).map(res => res.json());
  }

  logout() {
    this.userToken = appSettings.getString("userToken");
    if(this.userToken) {
      let logoutUrl = this._apiUrl + "users/logout";
      var logout_header = this._custom_header;
      logout_header["user-token"] = this.userToken;
      return this.http.get(
        logoutUrl,
        { headers: logout_header }
      )
    } else {
      return false
    }
  }

  reset_password(email) {
    let resetPasswordUrl = this._apiUrl + "users/restorepassword/" + email;
    console.log("resetUrl: ", resetPasswordUrl);
    return this.http.get(
      resetPasswordUrl,
      { headers: this._custom_header }
    )
  }

}