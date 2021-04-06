let operator = document.querySelectorAll("[data-operation]");
let number = document.querySelectorAll("[data-number]");
let display = document.querySelector("[data-display]");
let del = document.querySelector("[data-delete]");
let allClear = document.querySelector("[data-all-clear]");
let equals = document.querySelector("[data-equals]");

operator.forEach(operator => operator.addEventListener("click", updateDisplayInput));
number.forEach(number => number.addEventListener("click", updateDisplayInput));
del.addEventListener("click", updateDisplayInput);
allClear.addEventListener("click", clearDisplay);
equals.addEventListener("click", operate);

let displayArr = [];
let operatorRegex = /[\+\-\*/]/;
let dangleOperand = "";

function updateDisplayInput(e) {
    //checks if user is deleting
    if (e.target.hasAttribute("data-delete")) {
        displayArr.pop();
        dangleOperand = "";
    }
    //only lets user input numbers if array is empty
    else if (displayArr.length === 0) {
        if (e.target.hasAttribute("data-number")) {
            displayArr.push(e.target.textContent);
        }
    }
    //handles input when array isn't empty
    else if (displayArr.length !== 0) {
        //is input a number? If so, "." or digit?
        if (e.target.hasAttribute("data-number")) {
            if (e.target.innerText === ".") {
                if (!displayArr.includes(".")) {
                    displayArr.push(e.target.textContent);
                }
                else if (displayArr.includes("+") || displayArr.includes("-") || displayArr.includes("*") || displayArr.includes("/")) {
                    displayArr.push(e.target.textContent);
                }
                else return;
            }

            else if (e.target.innerText !== ".") {
                displayArr.push(e.target.textContent);
            }
            else return
        }
        //is input an operand? Only allow 1
        else if (e.target.hasAttribute("data-operation")) {
            if (displayArr.every(element => !isNaN(element) || element === ".")) {
                displayArr.push(e.target.textContent);
            }
            else if (displayArr.some(element => isNaN(element)) && displayArr[displayArr.length - 1] === "+" || displayArr[displayArr.length - 1] === "-" || displayArr[displayArr.length - 1] === "*" || displayArr[displayArr.length - 1] === "/") {
                return displayArr;
            }
            else if (displayArr.some(element => isNaN(element))) {
                
                dangleOperand = e.target.textContent;
                operate(dangleOperand);
            }
            else return
        }
    }
    else return

    let displayStr = displayArr.join("");
    display.textContent = displayStr;
}

function clearDisplay() {
    displayArr = [];
    display.textContent = "";
    dangleOperand = "";
}

function operate() {
    let displayStr = displayArr.join("");
    let indexTest = displayStr.match(operatorRegex);
    let indexOperand = displayStr.indexOf(indexTest[0]);
    let firstNum = parseFloat(displayStr.slice(0,indexOperand));
    let secondNum = parseFloat(displayStr.slice(indexOperand + 1));
    if (isNaN(secondNum)) {
        secondNum = firstNum;
    }
    let result = "";
    if (displayStr[indexOperand] === "+") {
        result = firstNum + secondNum;
    }
    else if (displayStr[indexOperand] === "-") {
        result = firstNum - secondNum;
    }
    else if (displayStr[indexOperand] === "*") {
        result = firstNum * secondNum;
    }
    else if (displayStr[indexOperand] === "/") {
        result = firstNum / secondNum;
    }
    updateDisplayResult(result)
    return result;
}

function updateDisplayResult(result) {
    let rounded = Math.round(result * 100) / 100;
    rounded = rounded.toString().split("");
    let modifiedArr = [];
    if (dangleOperand === "") {
        modifiedArr = [...rounded]
    }
    else {
        modifiedArr = [...rounded, dangleOperand];
    }
    let roundedStr = modifiedArr.join("");
    if (roundedStr.includes("NaN") || roundedStr.includes("Infinity")) {
        display.innerHTML = "Uh Oh!<br>That's illegal!";
        setTimeout(clearDisplay, 1500)
    }
    else {
        display.textContent = roundedStr;
        displayArr = [...rounded];
        dangleOperand = "";
    }
}