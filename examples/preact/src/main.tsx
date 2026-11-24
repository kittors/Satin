import { render, h } from "preact";
import { setup } from "satin-ui";
import { defineElements } from "satin-ui/elements";
import "./styles";
import App from "./App";
setup(); defineElements();
render(h(App, null), document.getElementById("app")!);
