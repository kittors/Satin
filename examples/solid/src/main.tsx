import { render } from "@solidjs/web";
import { setup } from "satin-ui";
import { defineElements } from "satin-ui/elements";
import "./styles";
import App from "./App";
setup(); defineElements();
render(App, document.getElementById("app")!);
