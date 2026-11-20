import { render, h } from "preact";
import { setup } from "satin-ui";
import { defineElements } from "satin-ui/elements";
import "./styles.js";
import App from "./App.jsx";
setup(); defineElements();
render(h(App), document.getElementById("app"));
