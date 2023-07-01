const list = data => {
  const element = data.element
  const id = data.id
  const css = properties.css(element.id, 'list')
  const mainId = app.makeId()
  const children = []
  let themeClassName = ''
  let boldColor = '#000'
  let iconColor = '#000'
  let linkColor = '#000'
  let bulletSpacing = null

  const cf_classic_themes = [
    `
.elBulletList_theme1 li {
      padding: 0;
      margin-bottom: 0
  }
  
  .elBulletList_theme1 li i.fa,.elBulletList_theme1 li i.far,.elBulletList_theme1 li i.fas,.elBulletList_theme1 li i.fad,.elBulletList_theme1 li i.fab,.elBulletList_theme1[data-list-type=ordered] li::before {
      padding: 10px 10px;
      background: #f9f9f9;
      border: 1px solid #eee;
      border-bottom: 2px solid #eee;
      border-radius: 4px;
      margin: 5px 0;
      margin-right: 6px;
      width: auto;
      margin-left: 0 !important;
      display: inline-block
  }
  
  `,
    `
.elBulletList_theme2 li {
      padding: 0;
      margin-bottom: 0
  }
  
  .elBulletList_theme2 li i.fa,.elBulletList_theme2 li i.far,.elBulletList_theme2 li i.fas,.elBulletList_theme2 li i.fab,.elBulletList_theme2 li i.fad,.elBulletList_theme2[data-list-type=ordered] li::before {
      padding: 10px 10px;
      background: #fafafa;
      border: 1px solid #eee;
      border-bottom: 2px solid #ddd;
      border-radius: 224px;
      margin: 5px 0;
      margin-right: 6px;
      width: auto;
      margin-left: 0 !important;
      display: inline-block
  }`,
    `
    .elBulletList_theme3 li {
      padding: 0;
      margin-bottom: 0;
      border-bottom: 1px solid #eee
  }
  
  .elBulletList_theme3 li:last-child {
      border-bottom: none
  }
  
  .elBulletList_theme3 li i.fa,.elBulletList_theme3 li i.far,.elBulletList_theme3 li i.fas,.elBulletList_theme3 li i.fab,.elBulletList_theme3 li i.fad,.elBulletList_theme3[data-list-type=ordered] li::before {
      padding: 10px 10px;
      background: #3cb371;
      border-bottom: 2px solid #308f5a;
      color: #fff;
      border-radius: 3px;
      margin: 5px 0;
      margin-right: 6px;
      width: auto;
      margin-left: 0 !important;
      display: inline-block
  }`,
    `
.elBulletList_theme4 li {
      padding: 0;
      margin-bottom: 0;
      border-bottom: 1px solid #eee
  }
  
  .elBulletList_theme4 li:last-child {
      border-bottom: none
  }
  
  .elBulletList_theme4 li i.fa,.elBulletList_theme4 li i.far,.elBulletList_theme4 li i.fas,.elBulletList_theme4 li i.fab,.elBulletList_theme4 li i.fad,.elBulletList_theme4[data-list-type=ordered] li::before {
      padding: 10px 10px;
      background: #d8542e;
      border-bottom: 2px solid #ae3d1e;
      color: #fff;
      border-radius: 3px;
      margin: 5px 0;
      margin-right: 6px;
      width: auto;
      margin-left: 0 !important;
      display: inline-block
  }`,

    `
    .elBulletList_theme5 {
      border-radius: 5px;
      overflow: hidden;
      border: 1px solid #eee;
      background: #fff
  }
  
  .elBulletList_theme5 li {
      padding: 0;
      margin-bottom: 0;
      border-bottom: 1px solid #eee;
      background: #fff
  }
  
  .elBulletList_theme5 li:last-child {
      border-top: none
  }
  
  .elBulletList_theme5 li i.fa,.elBulletList_theme5 li i.far,.elBulletList_theme5 li i.fas,.elBulletList_theme5 li i.fab,.elBulletList_theme5 li i.fad,.elBulletList_theme5[data-list-type=ordered] li::before {
      padding: 11px 9px;
      background: #f9f9f9;
      border-right: 1px solid #eee;
      border-bottom: 1px solid #eee;
      margin-right: 6px;
      width: auto;
      margin-left: 0 !important;
      display: inline-block
  }
  
  .elBulletList_theme5 li i.fa:last-child,.elBulletList_theme5[data-list-type=ordered] li::before {
      border-bottom: none
  }`,

    `
.elBulletList_theme6 {
      border-radius: 5px;
      overflow: hidden;
      border: 1px solid #186aa1;
      background: #fff
  }
  
  .elBulletList_theme6 li {
      padding: 0;
      margin-bottom: 0;
      border-bottom: 1px solid #186aa1
  }
  
  .elBulletList_theme6 li:first-child {
      border-top-right-radius: 5px
  }
  
  .elBulletList_theme6 li:last-child {
      border-top: none;
      border-bottom-right-radius: 4px
  }
  
  .elBulletList_theme6 li i.fa,.elBulletList_theme6 li i.far,.elBulletList_theme6 li i.fas,.elBulletList_theme6 li i.fab,.elBulletList_theme6 li i.fad,.elBulletList_theme6[data-list-type=ordered] li::before {
      padding: 11px 9px;
      background: #128ee6;
      background-image: -webkit-linear-gradient(top, #128ee6, #0074c7);
      background-image: -moz-linear-gradient(top, #128ee6, #0074c7);
      background-image: -ms-linear-gradient(top, #128ee6, #0074c7);
      background-image: -o-linear-gradient(top, #128ee6, #0074c7);
      background-image: linear-gradient(to bottom, #128ee6, #0074c7);
      color: #fff;
      border-right: 1px solid #186aa1;
      border-bottom: 1px solid #186aa1;
      margin-right: 6px;
      width: auto;
      margin-left: 0 !important;
      display: inline-block
  }
  
  .elBulletList_theme6 li i.fa:last-child,.elBulletList_theme6 li i.far:last-child,.elBulletList_theme6 li i.fas:last-child,.elBulletList_theme6 li i.fab:last-child,.elBulletList_theme6 li i.fad:last-child,.elBulletList_theme6[data-list-type=ordered] li::before {
      border-bottom: none
  }
`,

    `
.elBulletList_theme7 {
    border-radius: 5px;
    overflow: hidden;
    border: 1px solid #3cb371;
    background: #fff
}

.elBulletList_theme7 li {
    padding: 0;
    margin-bottom: 0;
    border-bottom: 1px solid #3cb371
}

.elBulletList_theme7 li:first-child {
    border-top-right-radius: 5px
}

.elBulletList_theme7 li:last-child {
    border-top: none;
    border-bottom-right-radius: 5px
}

.elBulletList_theme7 li i.fa,.elBulletList_theme7 li i.far,.elBulletList_theme7 li i.fas,.elBulletList_theme7 li i.fab,.elBulletList_theme7 li i.fad,.elBulletList_theme7[data-list-type=ordered] li::before {
    padding: 11px 9px;
    background: #3fcc7c;
    background-image: -webkit-linear-gradient(top, #3fcc7c, #3cb371);
    background-image: -moz-linear-gradient(top, #3fcc7c, #3cb371);
    background-image: -ms-linear-gradient(top, #3fcc7c, #3cb371);
    background-image: -o-linear-gradient(top, #3fcc7c, #3cb371);
    background-image: linear-gradient(to bottom, #3fcc7c, #3cb371);
    color: #fff;
    border-right: 1px solid #3cb371;
    border-bottom: 1px solid #3cb371;
    margin-right: 6px;
    width: auto;
    margin-left: 0 !important;
    display: inline-block
}
  `,
  ]

  const secondListItem = document.querySelector(`#${element.id} li:nth-child(2)`)
  if (secondListItem) {
    const secondListItemStyle = window.getComputedStyle(secondListItem)
    if (secondListItemStyle.marginTop) {
      bulletSpacing = parseInt(secondListItemStyle.marginTop)
    }
  }

  if (element.content.html && element.content.html.includes('elBulletList_theme')) {
    const themeClass = element.content.html.match(/elBulletList_theme\d+/g)
    const themeNumber = themeClass[0].match(/\d+/g)
    let css = cf_classic_themes[themeNumber[0] - 1]
    css = css.replace(/\.elBulletList_theme\d+/g, `.id-${id}`)
    bulletSpacing = 0
    app.copiedCSS += `\n\n/* CSS for Bullet List */\n`
    app.copiedCSS += css
    app.recommendations.push({
      type: 'Bullet List Theme',
      status: 'CSS',
      explainer: 'Custom CSS has been applied to the page to support the theme of this bullet list.',
    })
  }

  element.content.items.forEach((item, index) => {
    const itemID = app.makeId()
    const content = app.headlinePageTree(item.json, item.id)

    content.forEach((item, index) => {
      item.parentId = itemID
      item.fractionalIndex = 'a' + (index + 1).toString(36)
    })

    content[0] = {
      type: 'IconNode',
      attrs: {
        className: `${content[0].attrs.class} fa_icon`,
        contenteditable: 'false',
      },
      id: content[0].id,
      version: 0,
      parentId: itemID,
      fractionalIndex: content[0].fractionalIndex,
    }

    const data = {
      type: 'li',
      id: itemID,
      version: 0,
      parentId: mainId,
      fractionalIndex: 'a' + (index + 1).toString(36),
      children: content,
    }
    children.push(data)
  })

  if (
    document.querySelector(`#${element.id} .elBulletList b`) &&
    document.querySelector(`style#bold_style_${element.id}`)
  ) {
    const boldColorStyle = document.querySelector(`style#bold_style_${element.id}`).textContent
    boldColor = boldColorStyle.split('color:')[1].replace(';', '').replace('}', '').trim()
  }

  const firstIcon = document.querySelector(`#${element.id} .elBulletList i`)
  if (firstIcon) {
    iconColor = firstIcon.style.color
  }

  const firstLink = document.querySelector(`#${element.id} .elBulletList a`)
  if (firstLink) {
    linkColor = firstLink.style.color
  }

  const output = blueprint('BulletList/V1', data.id, data.parentId, data.index, element)

  output.attrs = {
    style: {
      'margin-top': document.querySelector(`#${element.id}`).style.marginTop || 0,
      'margin-left': document.querySelector(`#${element.id}`).style.marginLeft || 0,
      'margin-right': document.querySelector(`#${element.id}`).style.marginRight || 0,
      'text-align': css['text-align'] || 'left',
      'padding-top': parseInt(css['padding-top']) || 0,
      'padding-bottom': parseInt(css['padding-bottom']) || 0,
      'padding-left': 0,
      position: css['position'] || 'relative',
      'z-index': parseInt(css['z-index']) || 0,
      'font-size': parseInt(css['font-size']) || 16,
    },
    className: themeClassName,
    params: {
      'font-size--unit': 'px',
    },
  }

  output.selectors = {
    '.elBulletList': {
      attrs: {
        'data-style-guide-content': 'm',
        style: {
          color: css['color'] || 'inherit',
          'text-align': css['text-align'] || 'left',
          'padding-top': parseInt(css['padding-top']) || 0,
          'padding-bottom': parseInt(css['padding-bottom']) || 0,
          position: css['position'] || 'relative',
          'z-index': parseInt(css['z-index']) || 0,
          'font-size': parseInt(css['font-size']) || 16,
        },
      },
      params: {
        'style-guide-override-content': true,
        'font-size--unit': 'px',
      },
    },
    '.elBulletList b,\n.elBulletList strong': {
      attrs: {
        style: {
          color: boldColor,
        },
      },
    },
    '.elBulletList .fa,\n.elBulletList .fas,\n.elBulletList .fa-fw': {
      attrs: {
        style: {
          color: iconColor,
        },
      },
    },
    '.elBulletList .elTypographyLink': {
      attrs: {
        style: {
          color: linkColor,
        },
      },
    },
  }

  if (bulletSpacing !== null) {
    output.selectors['.elBulletList li:not(:first-child)'] = {
      params: {
        'margin-top--unit': 'px',
      },
      attrs: {
        style: {
          'margin-top': bulletSpacing,
        },
      },
    }
  }

  output.children = [
    {
      type: 'ContentEditableNode',
      attrs: {
        'data-align-selector': '.elBulletList',
      },
      id: mainId,
      version: 0,
      parentId: id,
      fractionalIndex: 'a0',
      children: children,
    },
  ]

  if (element.content.visible) {
    output.attrs['data-show-only'] = element.content.visible
  }

  output.attrs = Object.assign(output.attrs, animations.attrs(document.querySelector(`[id="${element.id}"]`)))
  output.params = Object.assign(
    output.params,
    animations.params(document.querySelector(`[id="${element.id}"]`))
  )

  return output
}
