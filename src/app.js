import { Question } from "./question";
import { createModal, isValid } from "./utils";
import "./styles.css";
import { authWithEmailAndPassword, getAuthForm } from "./auth";

const form = document.getElementById("form");
const input = form.querySelector("#question-input");
const submitBtn = form.querySelector("#submit");
const modalBtn = document.getElementById("modal-btn");

const submitFormHandler = (event) => {
  event.preventDefault();
  if (isValid(input.value)) {
    const question = {
      text: input.value.trim(),
      date: new Date().toJSON(),
    };

    submitBtn.disabled = true;

    //Async request to server to save question
    Question.create(question).then(() => {
      input.value = "";
      input.className = "";
      submitBtn.disabled = false;
    });
  }
};
const authFormHandler = (event) => {
  event.preventDefault();

  const btn = event.target.querySelector("button");
  btn.disabled = true;
  const email = event.target.querySelector("#email").value;
  const password = event.target.querySelector("#password").value;

  authWithEmailAndPassword(email, password)
    .then(Question.fetch)
    .then(renderModalAfterAuth)
    .then(() => (btn.disabled = false));
};

const renderModalAfterAuth = (content) => {
  if (typeof content === "string") {
    createModal("Ошибка!", content);
  } else {
    createModal("Список вопросов", Question.listToHtml(content));
  }
};

const openModal = () => {
  createModal("Aвторизация", getAuthForm());
  document
    .getElementById("auth-form")
    .addEventListener("submit", authFormHandler),
    { once: true };
};

form.addEventListener("submit", submitFormHandler);
window.addEventListener("load", Question.renderList);
input.addEventListener("input", () => {
  submitBtn.disabled = !isValid(input.value);
});
modalBtn.addEventListener("click", openModal);
