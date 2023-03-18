import { rtdb, ref, onValue } from "./db";
import * as lodash from "lodash";

let API_BASE_URL = "";
if (process.env.ENVIRONMENT == "development") {
  API_BASE_URL = "http://localhost:3000";
} else {
  API_BASE_URL = "https://final-test-b82k.onrender.com";
}
const state = {
  data: {
    name: "",
    email: "",
    userId: "",
    roomId: "",
    privateRoomId: "",
    messages: [],
  },
  listeners: [],
  listenRoom() {
    const currentState = this.getState();
    const chatRoomRef = ref(rtdb, "/rooms/" + currentState.privateRoomId);
    onValue(chatRoomRef, (snapShot) => {
      const messagesFromServer = snapShot.val();
      console.log(messagesFromServer);

      const messageList = lodash.map(messagesFromServer.messages);
      currentState.messages = messageList;
      this.setState(currentState);
    });
  },
  getState() {
    return this.data;
  },
  setState(newState) {
    this.data = newState;
    console.log(newState);

    for (const cb of this.listeners) {
      cb();
    }
  },
  suscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },
  setUserData(userData: { name: string; email: string; userId?: string }) {
    const currentState = this.getState();
    currentState.name = userData.name;
    currentState.email = userData.email;
    currentState.userId = userData.userId;
    this.setState(currentState);
  },
  signUpUser(email: string, name: string) {
    fetch(API_BASE_URL + "/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre: name,
        email: email,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        state.setUserData({
          name,
          email,
          userId: res.id,
        });
      });
  },
  loginUser(email: string) {
    fetch(API_BASE_URL + "/auth", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((ResFromServer) => {
        state.setUserData({
          name: ResFromServer.data.nombre,
          email: ResFromServer.data.email,
          userId: ResFromServer.id,
        });
      });
  },
  pushMessage(message: string) {
    fetch(API_BASE_URL + "/rooms/" + this.data.privateRoomId + "/messages", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: this.data.name,
        message: message,
      }),
    });
  },
  createRoom(userId: string) {
    const currentState = this.getState();
    fetch(API_BASE_URL + "/rooms", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((resFromServer) => {
        currentState.roomId = resFromServer.id;
        currentState.privateRoomId = resFromServer.privateId;
        this.setState(currentState);
        this.listenRoom();
      });
  },
  enterRoom(roomId: string) {
    const currentState = this.getState();
    const userId = state.getUserId();
    fetch(API_BASE_URL + "/rooms/" + roomId + "?userId=" + userId, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        currentState.privateRoomId = data.rtdbRoomId;
        currentState.roomId = roomId;
        this.setState(currentState);
        this.listenRoom();
      });
  },

  setRoomId(roomId: string) {
    const currentState = this.getState();
    currentState.roomId = roomId;
    this.setState(currentState);
  },
  getUserName() {
    const currentUser = this.getState().name;
    return currentUser;
  },
  getUserId() {
    const currentId = this.getState().userId;
    return currentId;
  },
  getRoomId() {
    const currentRoomId = this.getState().roomId;
    return currentRoomId;
  },
};

export { state };
