import { state } from "../../state";
import { Router } from "@vaadin/router";
class Login extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  addListeners() {
    const signInFormEl = this.querySelector(".sign-in-form");
    const logInFormEl = this.querySelector(".login-form");
    this.submitSigninForm(signInFormEl);
    this.submitLoginForm(logInFormEl);
  }
  submitSigninForm(formEl) {
    formEl.addEventListener("submit", (event) => {
      event.preventDefault();
      const target = event.target as any;
      state.signUpUser(target.email.value, target.nombre.value);
      state.suscribe(() => {
        Router.go("/welcome");
      });
    });
  }
  submitLoginForm(formEl) {
    formEl.addEventListener("submit", (event) => {
      event.preventDefault();
      const target = event.target as any;
      const email = target.email.value;
      state.loginUser(email);
      state.suscribe(() => {
        Router.go("/welcome");
      });
    });
  }

  render() {
    this.innerHTML = `
        <header class="header"></header>
        <div class="container">
        <h1 class="title">Bienvenidx</h1>
        <div class="form-container">
        <h2 class="subtitle">Registrate</h2>
        <form class="sign-in-form">
        <label class="label">Email</label>
        <input name="email" type="email" class="input"/>
        <label class="label">Tu Nombre</label>
        <input name="nombre" type="text" class="input"/>
        <button class="button">Registrarse</button>
        </form>
        </div>
        <h2 class="subtitle">Ingresa</h2>
        <div class="form-container">
        <form class="login-form">
        <label class="label">Email</label>
        <input name="email" type="email" class="input"/>
        <button class="button">Ingresar</button>
        </form>
         </div>
        </div>
    `;

    this.addListeners();
  }
}
customElements.define("login-page", Login);
