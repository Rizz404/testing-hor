"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getErrorMessage = function (error) {
    var message;
    if (error instanceof Error) {
        message = error.message;
    }
    else if (error && typeof error === "object" && "message" in error) {
        message = String(error.message);
    }
    else if (typeof error === "string") {
        message = error;
    }
    else {
        message = "An unknown error has occurred";
    }
    return message;
};
exports.default = getErrorMessage;
//# sourceMappingURL=getErrorMessage.js.map