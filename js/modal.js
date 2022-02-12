function editNav() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

// DOM Elements
const modalbg = document.querySelector(".bground");
const modalBtn = document.querySelectorAll(".modal-btn");
const form = document.forms['reserve'];
const formElem = form['elements'];
const formData = document.querySelectorAll(".formData");
const formClose = document.querySelector(".close");
const successBloc = document.querySelector(".success_msg");
const successClose = document.querySelector("button[class=btn-submit]");
const submit = document.querySelector("input[type=submit]");

// tableau contenant les valeurs du formulaire
const formValues = new Array();

// launch modal event
modalBtn.forEach((btn) => btn.addEventListener("click", launchModal));
// close modal
(() => {
  let btns = [formClose, successClose];
  btns.forEach(
    btn => {
      btn.addEventListener("click", closeModal);
    }
  );
})();

// on click for submit formular 
submit.addEventListener("click", waitBeforeSubmit);

// stop event on click action
function waitBeforeSubmit(event){
  event.preventDefault();
  validate();
}

// launch modal form
function launchModal() {
  modalbg.style.display = "block";
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function closeModal() {
  modalbg.children[0].className = 'content_return';
  await sleep(720);
  modalbg.children[0].className = 'content';
  modalbg.style.display = "none";
}
// mise à jour du tableau des valeurs formulaire
function formArray(newValue){
  formValues.push(newValue);
  //return formValues;
}

// verifie si la date en est bien une et l'email également
function checkDateOrEmail(params) {
  let count = 0; 
  // https://www.regextester.com/99555
  // on stocke nos regexs date et email dans un array
  let regex = [
    /((0[1-9]|[12]\d|3[01])[-/](0[1-9]|1[0-2])[-/][12]\d{3})/g,
    /^[a-zA-Z0-9.$%&_-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/g
  ];
  params.forEach(
    item => {
      let dateTest = new Date(item.value);
      let birthDate = null;
      // renvoi true si dateTest est bien de type Date
      if(dateTest instanceof Date && !isNaN(dateTest.valueOf())){
        // inverse les valeur de la date que l'on à spliter dans un array
        // et join les valeurs avec des slaches /
        if(item.value != null){
          birthDate = item.value.split('-').reverse().join('/');
        }
      }
      if( ( item.value != null && item.value.match(regex[1]) ) 
        || ( birthDate != null && birthDate.match(regex[0]) ) ){
        formArray(item.value);
        cancelErrorMSG(item);
        count ++;
      }else{
        sendErrorMSG(item);        
        formArray(null);
      }
    }
  );
  return (count == 2 ? true : false);
}

// verifie si la valeur entrer est integer
function checkNumber(numberTournament) { 
  if(numberTournament.value !== ''){
    // console.log('numberTournament != vide : ' + numberTournament.value);
    let nb = Number(numberTournament.value);
    if(typeof nb === 'number' && isFinite(nb)){
      // console.log('nb est numérique : ' + nb);
      formArray(nb);
      cancelErrorMSG(numberTournament);
      return true;
    }
    return false;
  }else{
    // console.log('nb est vide');
    sendErrorMSG(numberTournament);
    formArray(null);
    return false;
  }
}

// verifie la longueur des strings prenom/nom supérieur à 2 characteres
function checkedFirstLast(params){
  let count = 0;
  let result;
  params.forEach(
    item => {
      // console.log('item => item.value',item,' : ',item.value);
      if (item.value != null && item.value.length < 2){
        sendErrorMSG(item);
        formArray(null);
        result = false;
      }else{
        formArray(item.value);
        cancelErrorMSG(item);
        count ++;
      }
    }
  );
  if(count == 2){ result = true; }
  
  return result;
}
// verifie si un input:radio est est selectionné
function checkTown(towns) {
  let count = 0;
  let labelBelow = null;
  let result;
  towns.forEach(
    town => {
      if(labelBelow == null){
        labelBelow = town.labels[0];
      }
      if(town.checked){
        formArray(towns.value);
        cancelErrorMSG(labelBelow);
        result = true;
      }else{
        count ++;
      }
    }
  );
  if(count == towns.length){
    sendErrorMSG(labelBelow);
    formArray(null);
    result = false;
  }

  return result;
}

// condition general et prochains évenements
function checkGeneralCondition(generalCondition, nextEvent) {
  let ret = false;
  if (generalCondition.checked) {
    formArray(generalCondition.checked);
    cancelErrorMSG(generalCondition.labels[0]);
    ret = true;
  }else{
    formArray(null);
    sendErrorMSG(generalCondition.labels[0])
  }
  if(nextEvent.checked){
    formArray(nextEvent.checked);
  }else{
    formArray(null);
  }
  return ret;
}

// rendre visible les erreurs du formulaire
function sendErrorMSG(elemFrom) {
  elemFrom.offsetParent.attributes["data-error-visible"].value = 'true';
}
// enlever les erreurs du formulaire si elles sont rectifier
function cancelErrorMSG(elemFrom){
  elemFrom.offsetParent.attributes["data-error-visible"].value = 'false';
}
// le formulaire est valider afficher un message de succès 
// et un message de remerciments
function successMSG() {
  form.style.display = 'none';  
  successBloc.style.display = 'block';
}

// check if all functions that analyse a input formular return TRUE value
// then checkForm will return TRUE
// or FALSE if one of those functions return FALSE
function checkForm(){
  let isValidate;
  let trueCount = 0;
  if(formValues.length == 0 && formValues instanceof Array) {  
    let allFuncs = [
      checkedFirstLast( [formElem['first'], formElem['last']] ) ,
      checkDateOrEmail( [formElem['email'], formElem['birthdate']] ),
      checkNumber(formElem['quantity']),
      checkTown(formElem['location']),
      checkGeneralCondition(formElem['checkbox1'], formElem['checkbox2'])
    ];
    allFuncs.forEach(
      func => {
        console.log('function => ' + func);
        if(func != true){
          isValidate = false;
          formValues.splice(0, formValues.length);
        }else{
          trueCount ++;
        }
      }
    );
    if (trueCount == allFuncs.length) {
      isValidate = true;
    }
  }else{
    isValidate = false;
  }
  return isValidate;
}

function validate(){
  if(checkForm() == true){
    successMSG();
  }
  
  console.log( formValues );
  //sendResults(formValues);
}

// send array with post method
// let url = 'https://jsonplaceholder.typicode.com/posts';
// let url = `${window.origin}`;
let url = `index.html`;
async function sendResults(theArray){
  let response = await fetch(url,{
  //let request = new Request(url,{
    method: 'POST',
    cache:'no-cache',
    mode:'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(theArray)
  })

  // let response = await fetch(request)
  let data = await response.json()
}

async function catchResults(){
  try {
    let response = await fetch(url);
    if (reponse.ok) {    
      let data = await response.json();
      console.log(data);
    }else{
      console.error('Error response status', response.status);
    }
  } catch (error) {
    console.log(error);
  }
}
