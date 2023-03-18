import { state } from "../../state";
import { Router } from "@vaadin/router";
class Home extends HTMLElement {
  userName: string;
  connectedCallback() {
    this.userName = state.getUserName();
    this.render();
  }
  addListeners() {
    const selectInput = this.querySelector(".select");
    const divContainer = this.querySelector(".room-id");
    selectInput?.addEventListener("change", (e) => {
      const target = e.target as any;
      if (target.value == "existing-room") {
        divContainer?.classList.remove("hidden");
      } else {
        divContainer?.classList.add("hidden");
      }
    });
    const form = this.querySelector(".form");
    this.submitForm(form);
  }
  submitForm(formEl) {
    formEl.addEventListener("submit", (event) => {
      event.preventDefault();
      const target = event.target as any;
      if (target.room.value == "new-room") {
        const userId = state.getUserId();
        state.createRoom(userId);
        state.suscribe(() => {
          Router.go("/chat");
        });
      } else {
        const roomId = target["room-ID"].value;
        state.enterRoom(roomId);
        state.suscribe(() => {
          Router.go("/chat");
        });
      }
    });
  }

  render() {
    this.innerHTML = `
        <header class="header"></header>
        <div class="container">
        <h1 class="title">Bienvenidx ${this.userName}</h1>
        <div class="form-container">
        <form class="form">
        <label class="label">Room</label>
        <select name="room" class="select input">
        <option value="new-room" selected>Nuevo room</option>
        <option value="existing-room">Room existente</option>
        </select>
        <div class="room-id hidden">
        <label class="label">Room ID</label>
        <input name="room-ID" type="text" class="input"/>
        </div>
        <button class="button">Comenzar</button>
        </form>
         </div>
        </div>
    `;

    this.addListeners();
  }
}
customElements.define("home-page", Home);
