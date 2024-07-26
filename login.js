import Validator from './validator.js';
import DataBase from './database.js';

document.addEventListener("DOMContentLoaded", function() {
    const domManipulator = new DOMManipulator();
    domManipulator.addEventListeners(); 
});

class DOMManipulator {
    constructor() {
        this.domElements = {
            pinRadio: document.querySelector('#option-pin'),
            passwordRadio: document.querySelector('#option-password'),
            inputFields: document.querySelector('#login-credential'),
            email: document.querySelector('input#email'),
            pinInputs: document.querySelectorAll('input.pin'),
            password: document.querySelector('input#password'),
            submitButton: document.querySelector('button'),
            form: document.querySelector('form'),
            togglePasswordVisibilityButton: document.querySelector("#password-visibility-icon"),
            togglePinVisibilityButton: document.querySelector("#pin-visibility-icon"),
        }
        this.pinValues = null;
        this.isPasswordInInfoState = true;
        this.isPasswordTogglePressed = false;
        this.isPinInInfoState = true;
        this.isPinTogglePressed = false;
        this.validator = new Validator();
        this.isValid = {
            email: false,
            password: false,
            pin: false,
        }
        
        this.visited = {
            email: false,
            password: false,
            pin: false,
        }
    }

    addEventListeners() {
        this.addLoginPreferenceOptionEventListener();
        this.addEmailEventListner();
        this.addPasswordEventListner();
        this.addPinInputsEventListner();
        this.addTogglePinVisibilityEventListner();
        this.addTogglePasswordVisibilityEventListener();
        this.addFormSubmitEventListener();
    }

    addEmailEventListner() {
        this.domElements.email.addEventListener("blur", (event) => {
            if(this.validator.isLoginEmailInErrorState(event)){
                this.markInputModeAsError(event);
            }
            this.checkFormValidity();
        })
        this.domElements.email.addEventListener("input", (event) => {
            if(this.validator.isLoginEmailInValidState(event, this.visited)){
                this.markInputModeAsValid(event);
            }
            else{
                this.markInputModeAsInfo(event);
            }
            this.checkFormValidity();
        })
    }

    addPasswordEventListner(){
        this.domElements.password.addEventListener("blur", (event) => {
            if(this.isPasswordTogglePressed){
                event.target.focus();
                this.isPasswordTogglePressed = false;
            }
            this.checkFormValidity();
        })
        this.domElements.password.addEventListener("input", (event) => {
            if(this.validator.isLoginPasswordInValidState(event)){
                this.isValid[event.target.id] = true;
            }
            else{
                this.isValid[event.target.id] = false;
            }
            this.checkFormValidity();
        })
    }

    addTogglePinVisibilityEventListner() {
        this.domElements.togglePinVisibilityButton.onmousedown = () => {
            this.togglePinVisibility(this.domElements.togglePinVisibilityButton, this.domElements.pinInputs);
        };
    }

    addTogglePasswordVisibilityEventListener(){
        this.domElements.togglePasswordVisibilityButton.onmousedown = () => {
            this.togglePasswordVisibility(this.domElements.togglePasswordVisibilityButton, this.domElements.password);
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
                else{
                    this.validatePinInputsOnBlur(event);
                }
            });
        });
    }

    addLoginPreferenceOptionEventListener() {
        this.domElements.pinRadio.addEventListener('change', () => {
            if (this.domElements.pinRadio.checked) {
                this.toggleInputFieldsMode("pin");
                this.domElements.pinInputs[0].focus();
            }
            this.checkFormValidity();
        });

        this.domElements.passwordRadio.addEventListener('change', () => {
            if (this.domElements.passwordRadio.checked) {
                this.toggleInputFieldsMode("password");
                this.domElements.password.focus();
            }
            this.checkFormValidity();
        });
    }

    addFormSubmitEventListener(){
        this.domElements.form.addEventListener('submit', (event) => {
            this.checkFormValidity();
            if (this.domElements.submitButton.disabled) {
                event.preventDefault();
            } else {
                event.preventDefault();
                const database = new DataBase();
                database.login(this.domElements.email.value,this.domElements.password.value,this.pinValues);
            }
        });
    }

    // utilityFunctions--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    checkFormValidity() {
        const isValidSubmission = this.domElements.pinRadio.checked 
            ? this.isValid.email && this.isValid.pin 
            : this.isValid.email && this.isValid.password;
    
        this.domElements.submitButton.disabled = !isValidSubmission;
        this.domElements.submitButton.classList.toggle('valid', isValidSubmission);
        this.domElements.submitButton.classList.toggle('invalid', !isValidSubmission);
    }

    markInputModeAsError(event){
        event.target.nextElementSibling.innerHTML = "error_outline";
        event.target.parentNode.dataset["mode"] = "error";
        this.isValid[event.target.id] = false;
    }

    markInputModeAsValid(event){
        event.target.parentNode.dataset["mode"] = "";
        this.isValid[event.target.id] = true;
    }

    markInputModeAsInfo(event) {
        event.target.parentNode.dataset["mode"] = "info";
        this.isValid[event.target.id] = false;
    }

    validatePinInputsOnBlur(event){
        this.pinValues = Array.from(this.domElements.pinInputs).map(input => input.value).join('').trim();
        setTimeout(() => {
            if(this.validator.regex["isSixDigit"](this.pinValues)){
                event.target.parentNode.dataset.mode = "valid";
                this.isValid.pin=true;
            }
            else if(!(document.activeElement.classList.contains("pin"))){
                event.target.parentNode.dataset.mode = "";
                this.isValid.confirmpin=false;
            }
            this.checkFormValidity();
            }, 300);
    }

    toggleInputFieldsMode(mode) {
        this.domElements.inputFields.dataset.mode = mode;
    }

    togglePasswordVisibility(toggleButton, inputField) {
        const isPassword = inputField.type === "password";
        this.isPasswordTogglePressed = true;
        inputField.type = isPassword ? "text" : "password";
        toggleButton.innerHTML = isPassword ? "visibility" : "visibility_off";
    }

    togglePinVisibility(toggleButton, inputField) {
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
        this.isPinTogglePressed = true;
    }

    

    inputPinValueAndFocusNextPin(event, index){
        if(event.target.value){
            index<5?this.domElements.pinInputs[index+1].type = "tel":null;
            event.target.value = event.key;
        }
        setTimeout(() => {
            if(this.domElements.togglePinVisibilityButton.innerHTML === "visibility_off"){
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
                    this.checkFormValidity();
    }
}