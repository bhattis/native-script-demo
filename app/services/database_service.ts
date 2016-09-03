import { Injectable } from "@angular/core";
import { 
  HTTP_PROVIDERS,
  Http,
  Request,
  RequestMethod,
  Headers }           from "@angular/http";
import { Observable } from "data/observable";

@Injectable()
export class DatabaseService {

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

}