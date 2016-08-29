"use strict";
var dialogsModule = require("ui/dialogs");
function alert(message) {
    return dialogsModule.alert({
        title: "My App",
        okButtonText: "OK",
        message: message
    });
}
exports.alert = alert;
