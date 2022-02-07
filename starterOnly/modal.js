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
const formData = document.querySelectorAll(".formData");
const formClose = document.querySelector(".close");
const formCoiceTown = document.querySelectorAll("input[name=location]");
const formCheckBX = document.querySelectorAll("input[type=checkbox]");
const submit = document.querySelector("input[type=submit]");
// tableau contenant les valeurs du formulaire
const formValues = new Array();

// launch modal event
modalBtn.forEach((btn) => btn.addEventListener("click", launchModal));
formClose.addEventListener("click", closeModal);
submit.addEventListener("click", event => {event.preventDefault()});
// launch modal form
function launchModal() {
  modalbg.style.display = "block";
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function closeModal() {
  modalbg.children[0].className = 'content_return';
  await sleep(810);
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
      }else{
        sendErrorMSG(item);        
        formArray(null);
      }
    }
  );
}

// verifie si la valeur entrer est integer
function checkNumber(numberTournament) { 
  let nb = Number(numberTournament.value);
  if(typeof nb === 'number' && isFinite(nb)){
    formArray(nb);
  }else{
    sendErrorMSG(numberTournament);
    formArray(null);
  }
}

// verifie la longueur des strings prenom/nom supérieur à 2 characteres
function checkedFirstLast(params){
  // let count = 0;
  params.forEach(
    item => {
      if (item.value.length < 2){
        sendErrorMSG(item);
        formArray(null);
      }else{
        formArray(item.value);
        //count ++;
      }
    }
  );
  //if(count == 2)
  //  return true;
}
// loop quel input est checked
function checkTown(towns) {
  let count = 0;
  let labelBelow = null;
  towns.forEach(
    town => {
      if(town.checked){
        formArray(towns.value);
      }else{
        if(labelBelow == null){
          labelBelow = town.labels[0];
        }
        count ++;
      }
    }
  );
  if(count == towns.length){
    sendErrorMSG(labelBelow);
    formArray(null);
  }
}
// condition general et prochains évenements
function checkGeneralCondition(generalCondition, nextEvent) {
  if (generalCondition.checked) {
    formArray(generalCondition.checked);
  }else{
    formArray(null);
  }
  if(nextEvent.checked){
    formArray(nextEvent.checked);
  }else{
    formArray(null);
  }
}
// rendre visible les erreurs du formulaire
function sendErrorMSG(elemFrom) {
  elemFrom.offsetParent.attributes["data-error-visible"].value = 'true';
}

function validate(){
  const form = document.forms['reserve'];
  const formElem = form['elements'];

  checkedFirstLast( [formElem['first'], formElem['last']] ) ;
  checkDateOrEmail( [formElem['email'], formElem['birthdate']] );
  checkNumber(formElem['quantity']);
  checkTown(formElem['location']);
  checkGeneralCondition(formElem['checkbox1'], formElem['checkbox2']);
  
  console.log( formValues );
  sendResults(formValues);
}

// send array with post method
function sendResults(theArray){
  const options = {
    method: 'POST',
    body: JSON.stringify( theArray )  
  };
  fetch( 'index.html', options )
    .then( response => response.json() )
    .catch(function(error){
      console.log('Fetch error : ' + error);
    })
}

function catchResults(response){
  if(response.status !== 200){
    console.log('Reponse is not 200 : ' + response.status);
    return;
  }
  response.json().then(
    function (data) {
      console.log(data);
    }
  )
}