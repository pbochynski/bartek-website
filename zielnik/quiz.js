import { data } from "./data.js"

let score = 0;

function ok(){
  score += 1;
  document.getElementById("score").innerText = score;
  quiz();
}

function wrong(title){
  window.alert("Nie bardzo. To jest "+ title +". Spróbuj jeszcze raz");
}

function pictureElement(file) {
  const div = document.createElement('div');
  const img = document.createElement('img');

  div.className = "gallery";
  img.src=file;
  
  div.style.width=100;
  div.appendChild(img);
  return div;
}
function random(i) {
  return Math.floor(Math.random() * i)
}

function quiz() {

  const quizElement = data[random(data.length)]

  const content = document.getElementById("content")
  content.innerHTML="";
  const question = document.createElement("h1");
  question.innerText = "Pokaż obrazek na którym jest " + quizElement.title.toLowerCase();
  content.appendChild(question)
  data.forEach(element => {
    const pic = pictureElement(element.file);
    if (element.title == quizElement.title) {
      pic.addEventListener("click", ok);
    } else {
      pic.addEventListener("click", () => wrong(element.title.toLowerCase()));
    }
    content.appendChild(pic)
  });
}
quiz();
window.quiz = quiz;