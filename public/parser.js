import { init } from "https://classic-parser.onrender.com/init.js";

(() => {
  console.log("clickfunnels classic page verification loaded.");

  window.addEventListener(
    "message",
    function (event) {
      if (event.data.type === "import-classic") {
        init();
      }
    },
    false
  );
})();
