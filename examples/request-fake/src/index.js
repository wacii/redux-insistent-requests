import React from "react";
import ReactDOM from "react-dom";

import Serial from "./serial";
import Parallel from "./parallel";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(
  <div>
    <Serial />
    <Parallel />
  </div>,
  document.getElementById("root")
);
registerServiceWorker();
