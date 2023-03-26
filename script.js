const inputSlider = document.querySelector("[data-lengthSlider");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const upperCaseCheck = document.querySelector("#uppercase");
const lowerCaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generate-button");
const allCheckBox = document.querySelectorAll("input[type=checkBox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
//Set strength circle color to grey
setIndicator("#ccc");

// set Password Length

//Reflect Password Length on UI
function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
  const min = inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize =
    ((passwordLength - min) * 100) / (max - min) + "% 100%";
}

//Change the Indicator Color
function setIndicator(color) {
  indicator.style.backgroundColor = color;
}

//Generate a random integer in the range min-max
function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

//Generates a random number between 0-9
function generateRandomNumber() {
  return getRandomInteger(0, 9);
}

//Returns a lowercase character in the ascii range of 97-123
function generateLowerCase() {
  return String.fromCharCode(getRandomInteger(97, 123));
}

//Returns a uppercase character in the ascii range of 65-91
function generateUpperCase() {
  return String.fromCharCode(getRandomInteger(65, 91));
}

//Returns a symbol from the symbol string
function generateSymbols() {
  const randNum = getRandomInteger(0, symbols.length);
  return symbols.charAt(randNum);
}

// Calculates the strength of the password
function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;

  if (upperCaseCheck.checked) hasUpper = true;
  if (lowerCaseCheck.checked) hasLower = true;
  if (symbolsCheck.checked) hasSym = true;
  if (numbersCheck.checked) hasNum = true;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

function shufflePassword(array) {
  //Fisher Yates Method
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

//Counts the checkbox checked
function handleCheckBoxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) {
      checkCount++;
    }

    //Special Case
    if (passwordLength < checkCount) {
      passwordLength = checkCount;
      handleSlider();
    }
  });
}

//handles the checkbox when a checkbox is changed
allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});

inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

//Copies the password on the clipBoard
async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "Copied";
  } catch (err) {
    copyMsg.innerText = "Failed";
  }
  copyMsg.classList.add("active");
  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

//Calls copy clipboard when the copy button is clicked
copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) {
    copyContent();
  }
});

// Generate the Password
generateBtn.addEventListener("click", () => {
  //none of the checkboxes are selected
  if (checkCount == 0) return;

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  //remove old password
  password = "";

  //put the stuff mentioned by checkboxes

  // if (upperCaseCheck.checked) {
  //   password = generateUpperCase();
  // }

  // if (lowerCaseCheck.checked) {
  //   password = generateLowerCase();
  // }

  // if (numbersCheck.checked) {
  //   password = generateRandomNumber();
  // }

  // if (symbolsCheck.checked) {
  //   password = generateSymbols();
  // }

  let funcArr = [];
  if (upperCaseCheck.checked) {
    funcArr.push(generateUpperCase);
  }

  if (lowerCaseCheck.checked) {
    funcArr.push(generateLowerCase);
  }

  if (numbersCheck.checked) {
    funcArr.push(generateRandomNumber);
  }

  if (symbolsCheck.checked) {
    funcArr.push(generateSymbols);
  }

  // compulsory Addition
  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }

  // console.log("Compulsory Addition Done");
  // Remaining Addition
  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    let randIndex = getRandomInteger(0, funcArr.length);
    password += funcArr[randIndex]();
  }

  // console.log("Remaining Addition Done");

  //Shuffle The Password
  password = shufflePassword(Array.from(password));

  // console.log("Shuffling Done");

  // show on UI
  passwordDisplay.value = password;

  // console.log("UI Done");

  // Calculate Strength
  calcStrength();
});
