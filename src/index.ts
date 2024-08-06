import { load } from "./handler";
import "./styles/index.scss";

if (localStorage.getItem("location")) {
  load(localStorage.getItem("location"));
} else {
  load("London");
}
