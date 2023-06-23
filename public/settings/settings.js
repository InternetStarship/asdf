const settings = () => {
  const settingsId = app.makeId()
  const headerCodeId = app.makeId()
  const footerCodeId = app.makeId()
  const cssCodeId = app.makeId()
  const linkColorDom = document.querySelector('#link_color_style')
  let linkColor = '#000'
  if (linkColorDom) {
    linkColor = linkColorDom.innerText.replace('a { color: ', '').replace(';}', '').trim()
  }
  const textColor = document.querySelector('html').style.color
  const fontFamily = document.querySelector('html').style.fontFamily

  app.copiedCSS = document.querySelector('#custom-css').innerText
  app.copiedJS = document.querySelector('#page_body_tag').innerText

  app.copiedCSS = app.copiedCSS.replaceAll(`;`, ` !important;`)
  app.copiedCSS = app.copiedCSS.replaceAll(`!important !important;`, ` !important;`)
  app.copiedCSS = app.copiedCSS.replaceAll(`!important!important;`, ` !important;`)

  app.idList.map(item => {
    app.copiedCSS = app.copiedCSS.replaceAll(`#${item.cf1_id}`, `.id-${item.cf2_id}`)
    app.copiedJS = app.copiedJS.replaceAll(`#${item.cf1_id}`, `.id-${item.cf2_id}`)
  })

  return {
    id: settingsId,
    type: 'settings',
    version: 0,
    children: [
      {
        id: 'page_style',
        type: 'css',
        parentId: '6Z-ZJjGz-2',
        fractionalIndex: 'a0',
        attrs: {
          style: { color: textColor, 'font-family': fontFamily, 'font-weight': 500 },
        },
        selectors: { '.elTypographyLink': { attrs: { style: { color: linkColor } }, params: {} } },
        params: {},
      },
      {
        id: 'header-code',
        type: 'raw',
        parentId: headerCodeId,
        fractionalIndex: 'a0',
        innerText: '',
      },
      {
        id: 'footer-code',
        type: 'raw',
        parentId: footerCodeId,
        fractionalIndex: 'a1',
        innerText: app.copiedJS,
      },
      {
        id: 'css',
        type: 'raw',
        parentId: cssCodeId,
        fractionalIndex: 'a2',
        innerText: app.copiedCSS,
      },
    ],
  }
}
