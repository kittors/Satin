import { render } from "@solidjs/web";
import { setup } from "satin-ui";
import { defineElements } from "satin-ui/elements";
import "./styles.js";
import App from "./App.jsx";
setup(); defineElements();
render(App, document.getElementById("app"));
