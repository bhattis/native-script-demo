import { Component, ElementRef, 
  OnInit, ViewChild }             from "@angular/core";
import { Router }                 from "@angular/router";
import { Color }                  from "color";
import { connectionType, 
  getConnectionType }             from "connectivity";
import { Animation }              from "ui/animation";
import { View }                   from "ui/core/view";
import { prompt }                 from "ui/dialogs";
import { Page }                   from "ui/page";
import { TextField }              from "ui/text-field";
import { User }                   from "../../model/user";
import { setHintColor }           from "../shared/hint_util";
import { alert }                  from "../shared/dialog_util";
import { DatabaseService }        from "../../services/database_service"
import * as appSettings           from "application-settings";


@Component({
  selector:    "login",
  templateUrl: "pages/login/login.html",
  styleUrls:   ["pages/login/login_common.css", "pages/login/login_component.css"]
})

export class LoginPage implements OnInit {

  user: User;
  isLoggingIn = true;
  isAuthenticating = false;

  @ViewChild("initialContainer") initialContainer: ElementRef;
  @ViewChild("mainContainer") mainContainer: ElementRef;
  @ViewChild("logoContainer") logoContainer: ElementRef;
  @ViewChild("formControls") formControls: ElementRef;
  @ViewChild("signUpStack") signUpStack: ElementRef;
  @ViewChild("email") email: ElementRef;
  @ViewChild("password") password: ElementRef;

  constructor(private router: Router,
    private backend: DatabaseService,
    private page: Page) {
    this.user = new User();
  }

  ngOnInit() {
    this.page.actionBarHidden = true;
  }

  focusPassword() {
    this.password.nativeElement.focus();
  }

  submit() {
    if (!this.user.isValidEmail()) {
      alert("Enter a valid email address.");
      return;
    }

    this.isAuthenticating = true;
    if (this.isLoggingIn) {
      this.login();
    } else {
      this.signUp();
    }
  }

  login() {
    if (getConnectionType() === connectionType.none) {
      alert("MyApp requires an internet connection to log in.");
      return;
    }

    this.backend.login(this.user).subscribe(
      response => { this.loginResponse(response) },
      error => { 
        console.log("login error: ", [error]);
        alert("Unfortunately we could not find your account.");
        this.isAuthenticating = false; 
      },
      () => { 
        this.isAuthenticating = false;
        this.router.navigate(["/"]);
      }
    );
  }

  loginResponse(response) {
    Object.keys(response).forEach((key) => {
      if (key == "user-token") {
        this.user.userToken = response[key];
      } else {
        this.user[key] = response[key];
      }

    });
    appSettings.setString("userToken", this.user.userToken);
    appSettings.setString("objectId", this.user.objectId);
    appSettings.setString("loggedInUser", JSON.stringify(this.user));
  }

  signUp() {
    if (getConnectionType() === connectionType.none) {
      alert("MyApp requires an internet connection to register.");
      return;
    }
    this.backend.register(this.user).subscribe(
      response => { },
      error => { 
        console.log("Signup error: ", [error])
        this.isAuthenticating = false;
      },
      () => {
        alert("Your account was successfully created.");
        this.isAuthenticating = false;
        this.toggleDisplay();
      }
    )
  }

  forgotPassword() {
    prompt({
      title: "Forgot Password",
      message: "Enter the email address you used to register for MyApp to reset your password.",
      defaultText: "",
      okButtonText: "Ok",
      cancelButtonText: "Cancel"
    }).then((data) => {
      if (data.result) {
        this.user.resetPassword(data.text.trim())
          .then(() => {
            alert("Your password was successfully reset. Please check your email for instructions on choosing a new password.");
          })
          .catch(() => {
            alert("Unfortunately, an error occurred resetting your password.");
          });
      }
    });
  }

  toggleDisplay() {
    this.isLoggingIn = !this.isLoggingIn;
    this.setTextFieldColors();
    let mainContainer = <View>this.mainContainer.nativeElement;
    mainContainer.animate({
      backgroundColor: this.isLoggingIn ? new Color("white") : new Color("#301217"),
      duration: 200
    });
  }

  startBackgroundAnimation(background) {
    background.animate({
      scale: { x: 1.0, y: 1.0 },
      duration: 10000
    });
  }

  showMainContent() {
    let initialContainer = <View>this.initialContainer.nativeElement;
    let mainContainer = <View>this.mainContainer.nativeElement;
    let logoContainer = <View>this.logoContainer.nativeElement;
    let formControls = <View>this.formControls.nativeElement;
    let signUpStack = <View>this.signUpStack.nativeElement;
    let animations = [];

    // Fade out the initial content over one half second
    initialContainer.animate({
      opacity: 0,
      duration: 500
    }).then(function() {
      // After the animation completes, hide the initial container and
      // show the main container and logo. The main container and logo will
      // not immediately appear because their opacity is set to 0 in CSS.
      initialContainer.style.visibility = "collapse";
      mainContainer.style.visibility = "visible";
      logoContainer.style.visibility = "visible";

      // Fade in the main container and logo over one half second.
      animations.push({ target: mainContainer, opacity: 1, duration: 500 });
      animations.push({ target: logoContainer, opacity: 1, duration: 500 });

      // Slide up the form controls and sign up container.
      animations.push({ target: signUpStack, translate: { x: 0, y: 0 }, opacity: 1, delay: 500, duration: 150 });
      animations.push({ target: formControls, translate: { x: 0, y: 0 }, opacity: 1, delay: 650, duration: 150 });

      // Kick off the animation queue
      new Animation(animations, false).play();
    });
  }

  setTextFieldColors() {
    let emailTextField = <TextField>this.email.nativeElement;
    let passwordTextField = <TextField>this.password.nativeElement;

    let mainTextColor = new Color(this.isLoggingIn ? "black" : "#C4AFB4");
    emailTextField.color = mainTextColor;
    passwordTextField.color = mainTextColor;

    let hintColor = new Color(this.isLoggingIn ? "#ACA6A7" : "#C4AFB4");
    setHintColor({ view: emailTextField, color: hintColor });
    setHintColor({ view: passwordTextField, color: hintColor });
  }

}