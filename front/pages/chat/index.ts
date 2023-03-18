import { state } from "../../state";

type Message = {
  from: string;
  message: string;
};
class Chat extends HTMLElement {
  connectedCallback() {
    state.suscribe(() => {
      const currentState = state.getState();
      this.messages = currentState.messages;
      state.getRoomId();
      state.getState();
      this.render();
    });
    this.render();
  }
  addListeners() {
    const form = this.querySelector(".form");
    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const target = e.target as any;
      state.pushMessage(target.message.value);
    });
  }
  customClass: Function = (userName) => {
    if (userName == state.getUserName()) {
      return "main-user";
    } else {
      return "other-user";
    }
  };
  messages: Message[] = [];
  render() {
    this.innerHTML = `
    <header class="header"></header>
    <div class="container">
    <h1 class="title">Chat de ${state.getUserName()}</h1>
    <h4 class="room-id"> Room ID: ${state.getRoomId()}</h4>
    <div class="chat-area">
    ${this.messages
      .map((m) => {
        return `<div class="message ${this.customClass(m.from)}">${m.from}: ${
          m.message
        }</div>`;
      })
      .join("")}
    </div>
    <form class="form">
    <input type="text" name="message" class="input"/>
    <button class="button">Enviar</button>
    </form>
    </div>
  `;
    this.addListeners();
  }
}
customElements.define("chat-page", Chat);
