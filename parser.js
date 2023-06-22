import { generate } from "./generate";

export const importClassic = (url) => {
  return new Promise((resolve) => {
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

    const iframe = document.querySelector("iframe#classic-transfer");
    const iframeWindow = iframe.contentWindow;
    console.log("the url", url);
    // iframe.src = url;
    // iframe.onload = () => {
    const dom = iframe.contentWindow.document.querySelector(
      ".containerWrapper"
    );
    console.log(
      iframe.contentWindow.document,
      dom,
      iframe.contentWindow.document.innerHTML
    );
    const data = {
      sections: generate.sections(dom),
    };

    css = "";
    google_font_families = "";

    // Call resolve() here, when iframe finished loading and after
    // all synchronous operations are done.
    resolve({
      css: css,
      page_tree: JSON.stringify(page_tree),
      google_font_families: google_font_families,
    });
    // };
  });
};
