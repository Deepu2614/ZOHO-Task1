import Validator from './validator.js';
import UserModel from './user_model.js';
import DataBase from './database.js';

document.addEventListener('DOMContentLoaded', () => {

    const domManipulator = new DOMManipulator();
    domManipulator.addEventListeners();
});

class DOMManipulator {
    constructor() {
        this.domElements = {
            "username": document.getElementById("full-name"),
            "email": document.getElementById("email"),
            "dob": document.getElementById("date-of-birth"),
            "phonenumber": document.getElementById("mobile-number"),
            "password": document.querySelector("#password"),
            "confirmpassword": document.querySelector("#confirm-password"),
            "togglePasswordVisibilityButton": document.querySelector("#password-visibility-icon"),
            "togglePinVisibilityButton": document.querySelector("#pin-visibility-icon"),
            "pinInputs": document.querySelectorAll("input.pin"),
            "confirmPinInputs": document.querySelectorAll("input.confirm-pin"),
            "minimum8CharactersIcon": document.querySelector("#min-8-characters"),
            "atLeastOneSpecialCharIcon": document.querySelector("#\\31-special-character"),
            "atLeastOneNumberIcon": document.querySelector("#\\31-number"),
            "atLeastOneUppercaseIcon": document.querySelector("#\\31-uppercase"),
            "form": document.querySelector('#container form'),
            "submitButton": document.querySelector("button"),
        }

        this.pinValues = null;
        this.confirmPinValues = null;
        this.isMinimum8CharReached = false;
        this.isAtleast1NumberReached = false;
        this.isAtleast1UppercaseReached = false;
        this.isAtleast1SpecialCharReached = false;
        
        this.isValid = { 
            "full-name": false,
            "email": false,
            "date-of-birth": false,
            "mobile-number": false,
            "password": false,
            "confirm-password": false,
            pin: false,
            confirmpin: false
        }
        this.visited = {
            "full-name": false,
            "email": false,
            "date-of-birth": false,
            "mobile-number": false,
            "password": false,
            "confirm-password": false,
            pin: false,
            confirmpin: false
        }
        this.isPasswordInInfoState = true;
        this.isPasswordTogglePressed = false;
        this.isPinInInfoState = true;
        this.isPinTogglePressed = false;

        this.validator = new Validator();
    }

    addEventListeners() {
        this.addUsernameEventListner();
        this.addEmailEventListner();
        this.addDobEventListner();
        this.addPhoneEventListner();
        this.addPasswordEventListner();
        this.addConfirmPasswordEventListner();
        this.addTogglePasswordVisibilityEventListener();
        this.addTogglePinVisibilityEventListner();
        this.addPinInputsEventListner();
        this.addConfirmPinInputsEventListner();  
        this.addFormSubmitEventListner();
    }

    addUsernameEventListner(){
        this.domElements.username.addEventListener("focus", (event) => {
            this.markInputAsVisited(event);
        })
        this.domElements.username.addEventListener("blur", (event) => {
            if(this.validator.isUserNameInErrorState(event, this.visited)){
                this.markInputModeAsError(event);
            }
            else if(this.validator.isUserNameInValidState(event, this.visited)){
                this.markInputModeAsValid(event);
            }
            this.checkFormValidity();
        })
        this.domElements.username.addEventListener("input", (event) => {
            if(this.validator.isUserNameInWarningState(event)){
                this.markInputModeAsWarning(event);
            }
            else{
                this.markInputModeAsInfo(event);
            }
            this.checkFormValidity();
        })
    }

    addEmailEventListner() {
        this.domElements.email.addEventListener("focus", (event) => {
            this.markInputAsVisited(event);
        })
        this.domElements.email.addEventListener("blur", (event) => {
            if(this.validator.isEmailInErrorState(event, this.visited)){
                this.markInputModeAsError(event);
            }
            else if(this.validator.isEmailInValidState(event, this.visited)){
                this.markInputModeAsValid(event);
            }
            this.checkFormValidity();
        })
        this.domElements.email.addEventListener("input", (event) => {
            if(this.validator.isEmailInWarningState(event)){
                this.markInputModeAsWarning(event);
            }
            else{
                this.markInputModeAsInfo(event);
            }
            this.checkFormValidity();
        })
    }

    addDobEventListner(){
        this.domElements.dob.addEventListener("focus", (event) => {
            this.markInputAsVisited(event);
        })
        this.domElements.dob.addEventListener("blur", (event) => {
            if(this.validator.isDobInErrorState(event, this.visited)){
                this.markInputModeAsError(event);
            }
            else{
                this.markInputModeAsValid(event);
            }
            this.checkFormValidity();
        })
        this.domElements.dob.addEventListener("input", (event) => {
            this.markInputModeAsInfo(event);
            this.checkFormValidity();
        })
        
    }

    addPhoneEventListner(){
        this.domElements.phonenumber.addEventListener("focus", (event) => {
            this.markInputAsVisited(event);
        })
        this.domElements.phonenumber.addEventListener("blur", (event) => {   
            if(this.validator.isPhoneInErrorState(event, this.visited)){
                this.markInputModeAsError(event);
            }
            else if(this.validator.isPhoneInValidState(event, this.visited)){
                this.markInputModeAsValid(event);
            }
            this.checkFormValidity();
        })
        this.domElements.phonenumber.addEventListener("keydown", (event) => {
            if(this.validator.isKeyDownNotNumeric(event)){ 
                event.preventDefault();
                this.checkFormValidity();
            }
            else{
                this.markInputModeAsInfo(event);
            }
            this.checkFormValidity();
        })
    }
    
    addPasswordEventListner(){
        this.domElements.password.addEventListener("focus", (event) => {
            this.markInputAsVisited(event);
        })
        this.domElements.password.addEventListener("blur", (event) => {
            if(this.isPasswordTogglePressed){
                event.target.focus();
            }
            else{
                if(this.validator.isPasswordInErrorState(event, this.visited)){ 
                    this.markPasswordFieldsAsError(event);
                    this.clearConfirmPasswordValidationMode(event);
                }
                else if(this.validator.isPasswordInValidState(event, this.visited)){ 
                    this.markPasswordFieldsAsValid(event);
                    this.updateConfirmPasswordValidationMode(event);
                }
                else{
                    this.markPasswordFieldsAsError(event);
                }
                this.checkFormValidity();
            }
            this.isPasswordTogglePressed = false;
        })
        this.domElements.password.addEventListener("input", (event) => {
            event.target.parentNode.dataset["mode"] = "info";
            this.validatePasswordCredentials(event);
        })
    }

    addConfirmPasswordEventListner(){
        this.domElements.confirmpassword.addEventListener("focus", (event) => {
            this.markInputAsVisited(event);
        })
        this.domElements.confirmpassword.addEventListener("blur", (event) => {   
            if(this.validator.isConfirmPasswordInErrorState(event, this.visited, this.domElements.password.value)){
                this.markPasswordFieldsAsError(event);
            }
            else if(this.validator.isConfirmPasswordInValidState(event, this.isValid, this.domElements.password.value)){
                this.markPasswordFieldsAsValid(event);
            }
            else{
                this.markPasswordFieldsAsError(event);
            }
            this.checkFormValidity();
        })
        this.domElements.confirmpassword.addEventListener("input", (event) => {
            event.target.parentNode.dataset["mode"] = "info";
            if(this.validator.isConfirmPasswordInValidState(event, this.isValid, this.domElements.password.value)){
                this.markPasswordFieldsAsValid(event);
            }
            else if(this.validator.isPasswordVisitedAndInErrorState(this.visited, this.isValid)){ 
                event.target.nextElementSibling.nextElementSibling.innerHTML = "Password should be valid !!";
            }
            else{  
                event.target.nextElementSibling.nextElementSibling.innerHTML = "Password doesn't match !!";
            }
            this.checkFormValidity();
        })
    }    

    addTogglePasswordVisibilityEventListener(){
        this.domElements.togglePasswordVisibilityButton.onmousedown = () => {
            this.togglePasswordVisibility(this.domElements.togglePasswordVisibilityButton, this.domElements.password);
        };
    }

    addTogglePinVisibilityEventListner() {
        this.domElements.togglePinVisibilityButton.onmousedown = () => {
            this.togglePinVisibility(this.domElements.togglePinVisibilityButton, this.domElements.pinInputs);
        };
    }

    addPinInputsEventListner(){
        this.domElements.pinInputs.forEach((input, index) => {
            input.addEventListener('keydown', (event) => {
                if(this.validator.isKeyDownNotNumeric(event)){ // 
                    event.preventDefault();
                    this.checkFormValidity();
                }
                else if(event.key === "Backspace"){
                    this.clearPinInputOnBackSpace(event, index);
                }
                else{
                    this.inputPinValueAndFocusNextPin(event, index);
                }
            })
            input.addEventListener("blur",(event)=>{
                if(this.isPinTogglePressed){
                    event.target.focus();
                    this.isPinTogglePressed = false;
                }
                this.validatePinInputsOnBlur(event);
            });
        });
    }

    addConfirmPinInputsEventListner(){
        this.domElements.confirmPinInputs.forEach((input, index) => {
            input.addEventListener('keydown', (event) => {
                if(this.validator.isKeyDownNotNumeric(event)){ // 
                    event.preventDefault();
                    this.checkFormValidity();
                }
                else if(event.key === "Backspace"){
                    this.clearConfirmPinInputOnBackSpace(event, index);
                }
                else{
                    this.inputConfirmPinValueAndFocusNextPin(event, index);
                }
            })

            input.addEventListener("blur",(event)=>{
                this.validateConfirmPinInputsOnBlur(event);
            });
        });
    }

    addFormSubmitEventListner(){
        this.domElements.form.addEventListener('submit',(event) => {
            this.checkFormValidity();
            if (this.domElements.submitButton.disabled) {
                event.preventDefault();
            } else {
                event.preventDefault();
                const user = new UserModel(
                    this.domElements.username.value,
                    this.domElements.email.value,
                    this.domElements.dob.value,
                    this.domElements.phonenumber.value,
                    this.domElements.password.value,
                    this.pinValues
                );
                // user.save();
                this.database = new DataBase();
                this.database.signup(user);
            }
        });
    }

    markInputAsVisited(event){
        if(!this.visited[event.target.id]){
            this.visited[event.target.id] = true;
            event.target.parentNode.dataset["mode"] = "info";
        }
        this.checkFormValidity();
    }

    markInputModeAsError(event){
        event.target.nextElementSibling.innerHTML = "error_outline";
        event.target.parentNode.dataset["mode"] = "error";
        this.isValid[event.target.id] = false;
    }

    markInputModeAsValid(event){
        event.target.nextElementSibling.innerHTML = "check_circle_outline";
        event.target.parentNode.dataset["mode"] = "valid";
        this.isValid[event.target.id] = true;
    }

    markInputModeAsWarning(event) {
        event.target.nextElementSibling.innerHTML = "warning";
        event.target.parentNode.dataset["mode"] = "warning";
        this.isValid[event.target.id] = false;
    }

    markInputModeAsInfo(event) {
        event.target.parentNode.dataset["mode"] = "info";
        this.isValid[event.target.id] = false;
    }

    

    makeCredentialValidOrWarning(validator, credentialIcon, isReached){
        const bool = isReached==="specialChar"?this.isAtleast1SpecialCharReached:isReached==="number"?this.isAtleast1NumberReached:isReached==="uppercase"?this.isAtleast1UppercaseReached:this.isMinimum8CharReached;
        if(bool){
            if(validator){
                credentialIcon.querySelector(".material-icons").innerHTML = "check_circle_outline";
                credentialIcon.dataset.mode = "valid";
            }
            else{
                credentialIcon.querySelector(".material-icons").innerHTML = "warning";
                credentialIcon.dataset.mode = "warning";
            }
        }
        else{
            if(validator){
                credentialIcon.querySelector(".material-icons").innerHTML = "check_circle_outline";
                credentialIcon.dataset.mode = "valid";
                isReached==="specialChar"?this.isAtleast1SpecialCharReached=true:isReached==="number"?this.isAtleast1NumberReached=true:isReached==="uppercase"?this.isAtleast1UppercaseReached=true:this.isMinimum8CharReached=true;
            }
        }
    }

    markPasswordFieldsAsError(event){
        event.target.nextElementSibling.nextElementSibling.innerHTML = "error_outline";
        event.target.parentNode.dataset["mode"] = "error";
        this.isValid[event.target.id] = false;
    }

    markPasswordFieldsAsValid(event) {
        event.target.parentNode.dataset["mode"] = "valid";
        event.target.id === "password"?event.target.nextElementSibling.nextElementSibling.innerHTML = "check_circle_outline":event.target.nextElementSibling.innerHTML = "check_circle_outline";
        this.isValid[event.target.id] = true;
    }

    validatePasswordCredentials(event){
        this.makeCredentialValidOrWarning(this.validator.regex["minimum8Chars"](event.target.value), this.domElements.minimum8CharactersIcon, "min*char");
        this.makeCredentialValidOrWarning(this.validator.regex["atLeastOneSpecialChar"](event.target.value), this.domElements.atLeastOneSpecialCharIcon, "specialChar");
        this.makeCredentialValidOrWarning(this.validator.regex["atLeastOneNumber"](event.target.value), this.domElements.atLeastOneNumberIcon, "number");
        this.makeCredentialValidOrWarning(this.validator.regex["atLeastOneUpperCase"](event.target.value), this.domElements.atLeastOneUppercaseIcon, "uppercase")
    }

    clearConfirmPasswordValidationMode(event){
        if(this.visited["confirmpassword"] && (event.target.value !== this.domElements.confirmpassword.value)){
            this.domElements.confirmpassword.parentNode.dataset.mode = "";
        }
    }

    updateConfirmPasswordValidationMode(event){
        if(this.visited["confirmpassword"] && (event.target.value === this.domElements.confirmpassword.value)){
            this.isValid.confirmpassword = true;
            this.domElements.confirmpassword.parentNode.dataset.mode = "valid";
            this.domElements.confirmpassword.nextElementSibling.nextElementSibling.innerHTML = "check_circle_outline";
        }
        else if(this.visited["confirmpassword"] && (event.target.value !== this.domElements.confirmpassword.value)){
            this.domElements.confirmpassword.nextElementSibling.nextElementSibling.innerHTML = "error_outline";
            this.domElements.confirmpassword.parentNode.dataset.mode = "error";
            this.isValid.confirmpassword = false;
        }
    }

    togglePasswordVisibility(toggleButton, inputField) {
        const isPassword = inputField.type === "password";
        this.isPasswordTogglePressed = true;
        inputField.type = isPassword ? "text" : "password";
        toggleButton.innerHTML = isPassword ? "visibility" : "visibility_off";
        (this.visited["password"] && inputField.parentNode.dataset["mode"] === "info")?this.isPasswordInInfoState = true:this.isPasswordInInfoState = false;
    }
    

    togglePinVisibility(toggleButton, inputField) {
        this.isPinTogglePressed = true;
        if(toggleButton.innerHTML === "visibility_off"){
            inputField.forEach((input, index) => {
                input.type = "tel";
            });
            toggleButton.innerHTML = "visibility";
        }else{
            inputField.forEach((input, index) => {
                input.type = "password";
            });
            toggleButton.innerHTML = "visibility_off";
        }
    }

    inputPinValueAndFocusNextPin(event, index){
        if(event.target.value){
            index<5?this.domElements.pinInputs[index+1].type = "tel":this.domElements.confirmPinInputs[0].type = "tel";
            event.target.value = event.key;
        }
        setTimeout(() => {
            if(this.domElements.togglePinVisibilityButton.innerHTML == "visibility_off"){
                event.target.type = "password";
            }
        }, 350)
        setTimeout(() => {
            this.pinValues = Array.from(this.domElements.pinInputs).map(input => input.value).join('').trim();
            if(this.validator.regex["isSixDigit"](this.pinValues)){
                event.target.parentNode.dataset.mode = "valid";
                this.isValid.pin=true;
            }
            if(index < 5){
                this.domElements.pinInputs[index+1].type = "tel";
                this.domElements.pinInputs[index+1].focus();
            }
            else if(index == 5){
                this.domElements.confirmPinInputs[0].focus();
            }
            this.validateConfirmPinInputs();
            this.checkFormValidity();
        }, 100)
    }

    inputConfirmPinValueAndFocusNextPin(event, index){
        if(event.target.value){
            event.target.value = event.key;
        }
        setTimeout(() => {
            event.target.type = "password";
        }, 1000)
        setTimeout(() => {
            if(index < 5){
                this.domElements.confirmPinInputs[index+1].type = "tel";
                setTimeout(() => { this.domElements.confirmPinInputs[index+1].type = "password";}, 1000)
                this.domElements.confirmPinInputs[index+1].focus();
                this.validateConfirmPinInputs();
            }
            else if(index == 5){
                if(this.isValid.pin){
                    this.validateConfirmPinInputs();
                }
                else{
                    console.log("False");
                }
            }
            this.checkFormValidity();
        }, 100)
    }

    clearPinInputOnBackSpace(event, index) {
        this.isValid.pin=false;
                    if(event.target.value){
                        event.target.value = "";
                        event.target.type = "tel";
                    }
                    else if((event.target.value === "" || event.target.value === undefined) && index > 0){
                        event.target.type = "tel";
                        this.domElements.pinInputs[index-1].type = "tel";
                        this.domElements.pinInputs[index-1].focus();
                        event.preventDefault();
                    }
                    this.validateConfirmPinInputs();
                    this.checkFormValidity();
    }

    clearConfirmPinInputOnBackSpace(event, index) {
        this.isValid.confirmpin=false;
        if(event.target.value){
            event.target.value = "";
            event.target.type = "tel";
        }
        else if((event.target.value === "" || event.target.value === undefined) && index > 0){
            event.target.type = "tel";
            this.domElements.confirmPinInputs[index-1].type = "tel";
            this.domElements.confirmPinInputs[index-1].focus();
        }
        this.validateConfirmPinInputs();
        this.checkFormValidity();
    }

    validatePinInputsOnBlur(event){
        this.pinValues = Array.from(this.domElements.pinInputs).map(input => input.value).join('').trim();
        setTimeout(() => {
            if(this.validator.regex["isSixDigit"](this.pinValues)){
                event.target.parentNode.dataset.mode = "valid";
                this.isValid.pin=true;
            }
            else if(!(document.activeElement.classList.contains("pin"))){
                event.target.parentNode.dataset.mode = "error";
                this.isValid.confirmpin=false;
            }
            this.checkFormValidity();
        }, 300);
    }

    validateConfirmPinInputs(){
        this.pinValues = Array.from(this.domElements.pinInputs).map(input => input.value).join('').trim();
                        
        this.domElements.confirmPinValues = Array.from(this.domElements.confirmPinInputs).map(input => input.value).join('').trim();
        
        if(this.pinValues === this.domElements.confirmPinValues) {
            console.log("valid");
            this.domElements.confirmPinInputs[0].parentNode.dataset.mode = "valid";
            this.isValid.confirmpin=true;
            document.activeElement.blur();
        }
        else{
            this.domElements.confirmPinInputs[0].parentNode.dataset.mode = "";
            this.isValid.confirmpin=false;
        }
    }

    validateConfirmPinInputsOnBlur(event) {
        this.pinValues = Array.from(this.domElements.pinInputs).map(input => input.value).join('').trim();
        this.domElements.confirmPinValues = Array.from(this.domElements.confirmPinInputs).map(input => input.value).join('').trim();
        setTimeout(() => {
            if((this.validator.regex["isSixDigit"](this.domElements.confirmPinValues)) && this.domElements.confirmPinValues === this.pinValues){
                event.target.parentNode.dataset.mode = "valid";
                this.isValid.confirmpin=true;
            }
            else if(!(document.activeElement.classList.contains("confirm-pin"))){
                event.target.parentNode.dataset.mode = "error";
                this.isValid.confirmpin=false;
            }
            this.checkFormValidity();
        }, 300);
    }

    checkFormValidity() {
        if (this.validator.isAllInputsValid(this.isValid)) {
            this.domElements.submitButton.disabled = false;
            this.domElements.submitButton.classList.remove('invalid');
            this.domElements.submitButton.classList.add('valid');
        } else {
            this.domElements.submitButton.disabled = true;
            this.domElements.submitButton.classList.remove('valid');
            this.domElements.submitButton.classList.add('invalid');
        }
    }
}

