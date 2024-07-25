// validator.js
class Validator {
    constructor() {
        this.regex = {
            "minimum4Chars": (input) => /.{3,}/.test(input),
            "alphabetsOnly": (input) => /^[A-Za-z\s]+$/.test(input),
            "minimum8Chars": (input) => /.{8,}/.test(input),
            "emailValidation": (input) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input),
            "noLowercaseNumbersUnderscoreFullstopAt": (input) => /[^a-z0-9_.@]+/.test(input),
            "exactly10Numbers": (input) => /^\d{10}$/.test(input),
            "atLeastOneSpecialChar": (input) => /[^A-Za-z0-9]/.test(input),
            "atLeastOneNumber": (input) => /\d/.test(input),
            "isDigit": (input) => /^\d$/.test(input),
            "isSixDigit": (input) => /^\d{6}$/.test(input),
            "atLeastOneUpperCase": (input) => /[A-Z]/.test(input),
        };
    }

    isUserNameInErrorState(event, isVisited) {
        return isVisited[event.target.id] &&
               (event.target.value === undefined || event.target.value === "" || !this.regex["minimum4Chars"](event.target.value) || !this.regex["alphabetsOnly"](event.target.value));
    }

    isUserNameInValidState(event, isVisited) {
        return isVisited[event.target.id] &&
               this.regex["minimum4Chars"](event.target.value) &&
               this.regex["alphabetsOnly"](event.target.value);
    }

    isUserNameInWarningState(event, isVisited) {
        return !(event.target.value === undefined || event.target.value === "") &&
               !this.regex["alphabetsOnly"](event.target.value);
    }

    isEmailInErrorState(event, isVisited) {
        return isVisited[event.target.id] && (event.target.value === undefined || event.target.value === "" || !this.regex["emailValidation"](event.target.value) || this.regex["noLowercaseNumbersUnderscoreFullstopAt"](event.target.value));
    }

    isEmailInValidState(event, isVisited) {
        return isVisited[event.target.id] && this.regex["emailValidation"](event.target.value);
    }

    isLoginEmailInValidState(event, isVisited) {
        return this.regex["emailValidation"](event.target.value);
    }

    isEmailInWarningState(event) {
        return !(event.target.value === undefined || event.target.value === "") && this.regex["noLowercaseNumbersUnderscoreFullstopAt"](event.target.value);
    }

    isDobInErrorState(event, isVisited) {
        return isVisited[event.target.id] && (!event.target.value);
    }

    isPhoneInErrorState(event, isVisited) {
        return isVisited[event.target.id] && (event.target.value === undefined || event.target.value === "" || this.regex["exactly10Numbers"](event.target.value) === false);
    }

    isPhoneInValidState(event, isVisited) {
        return isVisited[event.target.id] && this.regex["exactly10Numbers"](event.target.value);
    }

    isKeyDownNotNumeric(event) {
        return !(this.regex["isDigit"](event.key)) && (event.key !== "Backspace" && event.key !== "Tab");
    }

    isPasswordInErrorState(event, isVisited) {
        return isVisited[event.target.id] && (event.target.value === undefined || event.target.value === "" || !this.regex["minimum8Chars"](event.target.value));
    }

    isAllPasswordRulesValid(event){
        return this.regex["minimum8Chars"](event.target.value) && this.regex["atLeastOneSpecialChar"](event.target.value) && this.regex["atLeastOneNumber"](event.target.value) && this.regex["atLeastOneUpperCase"](event.target.value);
    }

    isPasswordInValidState(event, isVisited) {
        return isVisited[event.target.id] && (this.regex["minimum8Chars"](event.target.value) && this.regex["atLeastOneSpecialChar"](event.target.value) && this.regex["atLeastOneNumber"](event.target.value) && this.regex["atLeastOneUpperCase"](event.target.value));
    }

    isConfirmPasswordInErrorState(event, isVisited, password) {
        return isVisited[event.target.id] && (event.target.value === undefined || event.target.value === "" || event.target.value !== password);
    }
    
    isConfirmPasswordInValidState(event, isValid, password) {
        return isValid.password && event.target.value === password;
    }

    isPasswordVisitedAndInErrorState(isVisited, isValid) {
        return isVisited["password"] && !isValid.password;
    }
    isAllInputsValid(isValid) {
        return isValid["full-name"] && isValid["email"] && isValid["date-of-birth"] && isValid["mobile-number"] && isValid["password"] && isValid["confirm-password"] && isValid.pin && isValid.confirmpin;
    }

    isLoginEmailInErrorState(event){
        return (!this.regex["emailValidation"](event.target.value) || this.regex["noLowercaseNumbersUnderscoreFullstopAt"](event.target.value)) && event.target.value !== "";
    }

    isLoginPasswordInValidState(event){
        return !(event.target.value === undefined || event.target.value === "" );
    }
}

export default Validator;
