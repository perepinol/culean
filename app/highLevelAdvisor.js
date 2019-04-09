function getHighLevelAdvisor(){

var xhr = new XMLHttpRequest();
xhr.open("GET", "http://localhost:8080/backend/src/backend/HighLevelAdvisorServlet", false); //change when deployment
xhr.send(null);
console.log(xhr.responseText);

document.getElementById("A1").innerHTML = xhr.responseText;

}