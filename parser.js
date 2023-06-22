(() => {
  console.log("clickfunnels classic page verification loaded.");

  const contentId = "";
  let page_tree = {
    version: 103,
    content: {
      type: "ContentNode",
      id: contentId,
      params: {},
      attrs: {},
      children: [],
    },
    settings: {},
    popup: {},
  };
  let css = "";
  let google_font_families = "";

  const dom = document.querySelector(".containerWrapper");

  console.log("we got the dom!", dom.innerHTML);

  css = "";
  google_font_families = "";

  window.addEventListener(
    "message",
    function (event) {
      if (event.data.type === "import-classic") {
        console.log("Received import-classic message:", event.data);
        // After executing your logic, send the response back to the parent
        const response = {
          css: css,
          page_tree: JSON.stringify(page_tree),
          google_font_families: google_font_families,
        };
        window.parent.postMessage(response, "*");
      }
    },
    false
  );
})();
