"use strict";
var validator = require("email-validator");
// @Injectable()
var User = (function () {
    function User() {
    }
    User.prototype.isValidEmail = function () {
        return validator.validate(this.email);
    };
    User.prototype.fullname = function () {
        return "#{this.first_name} #{this.last_name}";
    };
    return User;
}());
exports.User = User;
