function getHighLevelAdvisor(){

var xhr = new XMLHttpRequest();
xhr.open("GET", "http://localhost:8080/backend/highleveladvisor", false); //change when deployment
xhr.send(null);
console.log(xhr.responseText);
console.log(document);
document.getElementById("A1").innerHTML = xhr.responseText;

}