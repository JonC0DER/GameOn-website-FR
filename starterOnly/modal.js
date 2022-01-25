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

// launch modal event
modalBtn.forEach((btn) => btn.addEventListener("click", launchModal));
formClose.addEventListener("click", closeModal);
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

function checkDateOrEmail(dateEmail) {
  // https://www.regextester.com/99555
  let regex = [
    '^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$',
    '^[a-zA-Z0-9.$%&_-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$'
  ];
  if( dateEmail.match(regex[0]) || dateEmail.match(regex[1]) ){
    return true;
  }else{
    sendMSG();
  }
}

function validate(){
  for (let i = 0; i < formData.length; i++) {
    let val = formData[i].children[2].value;
    let elem = formData[i].children[2];
    let tab =Array();
    switch(i){
      case 0:
      case 1:
        if(val.length < 2)
          sendMSG(elem);
        else
          tab.push(val);
      case 2:
      case 3:
        if(checkDateOrEmail(val) == true)
          tab.push(val);
      case 4:
        if(typeof(val) == 'number')
          tab.push(val);
      case 5:
        formCoiceTown.forEach(
          item => {
            if( item.checked == true)
              tab.push(item.value)
          }
        );
      case 6:
        if( formCheckBX[0].checked == true ){
          tab.push(formCheckBX[0].nextElementSibling.innerText)
        }
      default:
        break;
    }
  }
  
}
