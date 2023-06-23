function init() {
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

  css = "";
  google_font_families = "";

  const response = {
    css: css,
    page_tree: JSON.stringify(page_tree),
    google_font_families: google_font_families,
  };
  window.parent.postMessage(response, "*");
}

// Export the function to make it accessible in other files
export { init };
