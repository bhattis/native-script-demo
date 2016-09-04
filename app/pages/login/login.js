"use strict";
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var color_1 = require("color");
var connectivity_1 = require("connectivity");
var animation_1 = require("ui/animation");
var dialogs_1 = require("ui/dialogs");
var page_1 = require("ui/page");
var user_1 = require("../../model/user");
var hint_util_1 = require("../shared/hint_util");
var dialog_util_1 = require("../shared/dialog_util");
var database_service_1 = require("../../services/database_service");
var appSettings = require("application-settings");
var LoginPage = (function () {
    function LoginPage(router, backend, page) {
        this.router = router;
        this.backend = backend;
        this.page = page;
        this.isLoggingIn = true;
        this.isAuthenticating = false;
        this.user = new user_1.User();
    }
    LoginPage.prototype.ngOnInit = function () {
        this.page.actionBarHidden = true;
    };
    LoginPage.prototype.focusPassword = function () {
        this.password.nativeElement.focus();
    };
    LoginPage.prototype.submit = function () {
        if (!this.user.isValidEmail()) {
            dialog_util_1.alert("Enter a valid email address.");
            return;
        }
        this.isAuthenticating = true;
        if (this.isLoggingIn) {
            this.login();
        }
        else {
            this.signUp();
        }
    };
    LoginPage.prototype.login = function () {
        var _this = this;
        if (connectivity_1.getConnectionType() === connectivity_1.connectionType.none) {
            dialog_util_1.alert("MyApp requires an internet connection to log in.");
            return;
        }
        this.backend.login(this.user).subscribe(function (response) { _this.loginResponse(response); }, function (error) {
            console.log("login error: ", [error]);
            dialog_util_1.alert("Unfortunately we could not find your account.");
            _this.isAuthenticating = false;
        }, function () {
            _this.isAuthenticating = false;
            _this.router.navigate(["/"]);
        });
    };
    LoginPage.prototype.loginResponse = function (response) {
        var _this = this;
        Object.keys(response).forEach(function (key) {
            if (key == "user-token") {
                _this.user.userToken = response[key];
            }
            else {
                _this.user[key] = response[key];
            }
        });
        appSettings.setString("userToken", this.user.userToken);
        appSettings.setString("objectId", this.user.objectId);
        appSettings.setString("loggedInUser", JSON.stringify(this.user));
    };
    LoginPage.prototype.signUp = function () {
        var _this = this;
        if (connectivity_1.getConnectionType() === connectivity_1.connectionType.none) {
            dialog_util_1.alert("MyApp requires an internet connection to register.");
            return;
        }
        this.backend.register(this.user).subscribe(function (response) { }, function (error) {
            console.log("Signup error: ", [error]);
            _this.isAuthenticating = false;
        }, function () {
            dialog_util_1.alert("Your account was successfully created.");
            _this.isAuthenticating = false;
            _this.toggleDisplay();
        });
    };
    LoginPage.prototype.forgotPassword = function () {
        var _this = this;
        dialogs_1.prompt({
            title: "Forgot Password",
            message: "Enter the email address you used to register for MyApp to reset your password.",
            defaultText: "",
            okButtonText: "Ok",
            cancelButtonText: "Cancel"
        }).then(function (data) {
            if (data.result) {
                _this.backend.reset_password(data.text.trim()).subscribe(function (response) { }, function (error) {
                    console.log("reset password error: ", JSON.stringify(error));
                    dialog_util_1.alert("Unfortunately, an error occurred resetting your password.");
                }, function () {
                    dialog_util_1.alert("Your password was successfully reset. Please check your email for instructions on choosing a new password.");
                });
            }
        });
    };
    LoginPage.prototype.toggleDisplay = function () {
        this.isLoggingIn = !this.isLoggingIn;
        this.setTextFieldColors();
        var mainContainer = this.mainContainer.nativeElement;
        mainContainer.animate({
            backgroundColor: this.isLoggingIn ? new color_1.Color("white") : new color_1.Color("#301217"),
            duration: 200
        });
    };
    LoginPage.prototype.startBackgroundAnimation = function (background) {
        background.animate({
            scale: { x: 1.0, y: 1.0 },
            duration: 10000
        });
    };
    LoginPage.prototype.showMainContent = function () {
        var initialContainer = this.initialContainer.nativeElement;
        var mainContainer = this.mainContainer.nativeElement;
        var logoContainer = this.logoContainer.nativeElement;
        var formControls = this.formControls.nativeElement;
        var signUpStack = this.signUpStack.nativeElement;
        var animations = [];
        // Fade out the initial content over one half second
        initialContainer.animate({
            opacity: 0,
            duration: 500
        }).then(function () {
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
            new animation_1.Animation(animations, false).play();
        });
    };
    LoginPage.prototype.setTextFieldColors = function () {
        var emailTextField = this.email.nativeElement;
        var passwordTextField = this.password.nativeElement;
        var mainTextColor = new color_1.Color(this.isLoggingIn ? "black" : "#C4AFB4");
        emailTextField.color = mainTextColor;
        passwordTextField.color = mainTextColor;
        var hintColor = new color_1.Color(this.isLoggingIn ? "#ACA6A7" : "#C4AFB4");
        hint_util_1.setHintColor({ view: emailTextField, color: hintColor });
        hint_util_1.setHintColor({ view: passwordTextField, color: hintColor });
    };
    __decorate([
        core_1.ViewChild("initialContainer"), 
        __metadata('design:type', core_1.ElementRef)
    ], LoginPage.prototype, "initialContainer", void 0);
    __decorate([
        core_1.ViewChild("mainContainer"), 
        __metadata('design:type', core_1.ElementRef)
    ], LoginPage.prototype, "mainContainer", void 0);
    __decorate([
        core_1.ViewChild("logoContainer"), 
        __metadata('design:type', core_1.ElementRef)
    ], LoginPage.prototype, "logoContainer", void 0);
    __decorate([
        core_1.ViewChild("formControls"), 
        __metadata('design:type', core_1.ElementRef)
    ], LoginPage.prototype, "formControls", void 0);
    __decorate([
        core_1.ViewChild("signUpStack"), 
        __metadata('design:type', core_1.ElementRef)
    ], LoginPage.prototype, "signUpStack", void 0);
    __decorate([
        core_1.ViewChild("email"), 
        __metadata('design:type', core_1.ElementRef)
    ], LoginPage.prototype, "email", void 0);
    __decorate([
        core_1.ViewChild("password"), 
        __metadata('design:type', core_1.ElementRef)
    ], LoginPage.prototype, "password", void 0);
    LoginPage = __decorate([
        core_1.Component({
            selector: "login",
            templateUrl: "pages/login/login.html",
            styleUrls: ["pages/login/login_common.css", "pages/login/login_component.css"]
        }), 
        __metadata('design:paramtypes', [router_1.Router, database_service_1.DatabaseService, page_1.Page])
    ], LoginPage);
    return LoginPage;
}());
exports.LoginPage = LoginPage;
