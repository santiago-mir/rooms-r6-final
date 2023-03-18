import { Router } from "@vaadin/router";
const router = new Router(document.querySelector(".root"));
router.setRoutes([
  { path: "/", component: "login-page" },
  { path: "/welcome", component: "home-page" },
  { path: "/chat", component: "chat-page" },
  { path: "(.*)", redirect: "/" },
]);
