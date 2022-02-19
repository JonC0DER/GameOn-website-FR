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
const modalbody = document.querySelector(".modal-body");
const modalBtn = document.querySelectorAll(".modal-btn");
const form = document.forms['reserve'];
const formElem = form['elements'];
const formData = document.querySelectorAll(".formData");
const formClose = document.querySelector(".close");
const successBloc = document.querySelector(".success-msg");
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

// écoute les changements de tous les inputs
function checkInputsChange(){
// liste des inputs du formulaire
  const allInput = [
    formElem['first'], formElem['last'], formElem['email'], formElem['birthdate'],
    formElem['quantity'], formElem['location'], formElem['checkbox1']
  ];
  for (let i = 0; i < allInput.length; i++) {
    let allI = allInput[i];

    switch (i) {
      case 0:
      case 1:
        allI.addEventListener('focusout', () => checkFirstLast([,allI]));
        break;
      case 2:
      case 3:
        allI.addEventListener('focusout', () => checkDateOrEmail([,allI]));
        break;
      case 4:
        allI.addEventListener('focusout', () => checkNumber(allI));
        break;
      case 5:
        allI.forEach( loc => {
          loc.addEventListener( 'change', () => checkTown(allI) ) 
        });
        break;
      case 6:
        allI.addEventListener('change', () => checkGeneralCondition(allI));
        break;
      default:
        throw "Error eventListener on input";
        break;
    }
  }
}

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
  modalbg.children[0].className = 'content-return';
  await sleep(720);
  modalbg.children[0].className = 'content';
  modalbg.style.display = "none";
}
// le formulaire est valider afficher un message de succès 
// et un message de remerciments
async function successMSG() {
  form.className = "success-anim-form";
  await sleep(720);
  form.style.display = 'none';  
  form.className = "";
  successBloc.style.display = 'block';
  successBloc.className += ' success-anim-msg';
  modalbody.className += ' modal-body-anim';
  await sleep(722);
  modalbody.className = 'modal-body';
  successBloc.className = 'success-msg';
}
// rendre visible les erreurs du formulaire
function sendErrorMSG(elemFrom) {
  elemFrom.offsetParent.attributes["data-error-visible"].value = 'true';
}
// enlever les erreurs du formulaire si elles sont rectifier
function cancelErrorMSG(elemFrom){
  elemFrom.offsetParent.attributes["data-error-visible"].value = 'false';
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
function checkNumber(nbTournament) { 
  let nb = Number(nbTournament.value);
  let isNum = (typeof nb === 'number' && isFinite(nb));
  // console.log('numberTournament != vide : ' + numberTournament.value);
  if(nbTournament.value !== '' && isNum && nb >= 0){
    // console.log('nb est numérique : ' + nb);
    formArray(nb);
    cancelErrorMSG(nbTournament);
    return true;
  }else{
    // console.log('nb est vide');
    sendErrorMSG(nbTournament);
    formArray(null);
    return false;
  }
}

// verifie la longueur des strings prenom/nom supérieur à 2 characteres
function checkFirstLast(params){
  let count = 0;
  let result;
  params.forEach(
    item => {
      // on enlève les espaces
      item.value = item.value.trim().replace(/ +(?= )/g,'');
      let name = item.value.trim();
      // si la chaine contient des charactères numériques
      // elle retourne null si il n'y en à aucun, sinon un Array
      let isNum = name.match(/[0-9]/g);
      // si la chaine contient des charactères spéciaux
      let isSpecial = name.match(/[^\w\s]/gi);
      // console.log('name => isnum ',name,' : ',isNum);
      if((name == null || name == "")||(name.length < 2 || isNum != null || isSpecial != null)){
        sendErrorMSG(item);
        formArray(null);
        result = false;
      }else{
        formArray(name);
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
function checkGeneralCondition(generalCondition, nextEvent = null) {
  let ret = false;
  if (generalCondition.checked) {
    formArray(generalCondition.checked);
    cancelErrorMSG(generalCondition.labels[0]);
    ret = true;
  }else{
    formArray(null);
    sendErrorMSG(generalCondition.labels[0])
  }
  if(nextEvent != null && nextEvent.checked){
    formArray(nextEvent.checked);
  }else{
    formArray(null);
  }
  return ret;
}

// check if all functions that analyse a input formular return TRUE value
// then checkForm will return TRUE
// or FALSE if one of those functions return FALSE
function checkForm(){
  let isValidate;
  let trueCount = 0;
  if(formValues.length == 0 && formValues instanceof Array) {  
    let allFuncs = [
      checkFirstLast( [formElem['first'], formElem['last']] ) ,
      checkDateOrEmail( [formElem['email'], formElem['birthdate']] ),
      checkNumber(formElem['quantity']),
      checkTown(formElem['location']),
      checkGeneralCondition(formElem['checkbox1'], formElem['checkbox2'])
    ];
    allFuncs.forEach(
      func => {
        // console.log('function => ' + func);
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
  // 8 est le nombres de valeurs final que l'on doit 
  // avoir dans l'array fromValues
  if (formValues.length > 8 || formValues.length < 8) {
    formValues.splice(0, formValues.length);
  }
  if(checkForm() == true){
    successMSG();
  }else{
    checkInputsChange();
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
