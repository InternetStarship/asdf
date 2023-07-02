const icon = data => {
  const element = data.element
  const output = blueprint('Icon/V1', data.id, data.parentId, data.index, element)
  const css = properties.css(element.id, 'icon')
  const href = document.querySelector(`#${element.id} .eliconelement`).getAttribute('href')

  const cf_classic_themes = [
    `
  .iconelement_theme_1 {
    padding: 0;
    margin: 0;
    color: inherit;
    text-align: center;
    font-size: 55px;
    line-height: 1em;
    display: block;
    text-shadow: 1px 1px 0 #fff,3px 3px 3px rgba(0,0,0,0.075)
}

.iconelement_theme_1 i {
  display: inline-block;
    width: auto;
    background: #f9f9f9;
    border-radius: 200px;
    padding: 20px 26px;
    border-bottom: 2px solid rgba(0,0,0,0.075)
}`,
    `
.iconelement_theme_2 {
    padding: 0;
    margin: 0;
    color: inherit;
    text-align: center;
    font-size: 55px;
    line-height: 1em;
    display: block;
    text-shadow: 3px 2px 5px rgba(0,0,0,0.15);
    color: #fff
}

.iconelement_theme_2 i {
  display: inline-block;
    width: auto;
    background: #0074c7;
    border-radius: 4px;
    padding: 10px 16px;
    color: #fff;
    border: 2px solid rgba(0,0,0,0.15);
    border-bottom: 4px solid rgba(0,0,0,0.15)
}`,
    `
.iconelement_theme_3 {
    padding: 0;
    margin: 0;
    color: inherit;
    text-align: center;
    font-size: 55px;
    line-height: 1em;
    display: block;
    text-shadow: 3px 2px 5px rgba(0,0,0,0.15)
}

.iconelement_theme_3 i {
  display: inline-block;
    width: auto;
    background: #fafafa;
    border-radius: 4px;
    padding: 10px 16px;
    border: 2px solid rgba(0,0,0,0.075);
    border-bottom: 4px solid rgba(0,0,0,0.075)
}`,
    `
.iconelement_theme_4 {
    padding: 0;
    margin: 0;
    color: inherit;
    text-align: center;
    font-size: 55px;
    line-height: 1em;
    display: block;
    text-shadow: 3px 2px 5px rgba(0,0,0,0.15)
}

.iconelement_theme_4 i {
  display: inline-block;
    width: auto;
    background: #fafafa;
    border-radius: 4px;
    padding: 10px 16px;
    border: 2px solid rgba(0,0,0,0.075);
    border-bottom: 4px solid rgba(0,0,0,0.075)
}`,
    `
.iconelement_theme_5 {
    padding: 0;
    margin: 0;
    color: inherit;
    text-align: center;
    font-size: 55px;
    line-height: 1em;
    display: block
}

.iconelement_theme_5 i {
  display: inline-block;
    width: auto;
    border-radius: 200px;
    padding: 19px 26px;
    border: 2px solid rgba(0,0,0,0.15)
}`,
    `
.iconelement_theme_6 {
    padding: 0;
    margin: 0;
    color: inherit;
    text-align: center;
    font-size: 55px;
    line-height: 1em;
    display: block
}

.iconelement_theme_6 i {
  display: inline-block;
    width: auto;
    border-radius: 4px;
    padding: 10px 10px;
    border: 2px solid rgba(0,0,0,0.15)
}`,
    `
.iconelement_theme_7 {
    padding: 0;
    margin: 0;
    color: inherit;
    text-align: center;
    font-size: 55px;
    line-height: 1em;
    display: block;
    text-shadow: 3px 2px 5px rgba(0,0,0,0.15)
}

.iconelement_theme_7 i {
  display: inline-block;
    width: auto;
    background: #3cb371;
    border-radius: 4px;
    padding: 10px 16px;
    color: #fff;
    background: #6abe18;
    background: -moz-linear-gradient(top, #cbe951, #9dd254 5%, #5eac11);
    background: -webkit-gradient(linear, left top, left bottom, color-stop(0, #cbe951), color-stop(0.03, #9dd254), to(#5eac11));
    filter: progid:DXImageTransform.Microsoft.gradient(startColorStr='#9dd254', EndColorStr='#5eac11');
    -ms-filter: "progid:DXImageTransform.Microsoft.gradient(startColorStr='#9dd254', EndColorStr='#5eac11')";
    -moz-border-radius: 5px;
    -webkit-border-radius: 5px;
    border-radius: 5px;
    border: 1px solid #53a40c;
    border-bottom: 1px solid #468f0a;
    color: #FFF !important;
    text-shadow: 0 1px 1px #316903
}`,
    `
.iconelement_theme_8 {
    padding: 0;
    margin: 0;
    color: inherit;
    text-align: center;
    font-size: 55px;
    line-height: 1em;
    display: block;
    text-shadow: 3px 2px 5px rgba(0,0,0,0.15)
}

.iconelement_theme_8 i {
  display: inline-block;
    width: auto;
    padding: 10px 16px;
    text-shadow: 0 1px 0 #fff;
    background: #f5f5f5;
    background: -webkit-gradient(linear, left top, left bottom, from(#f9f9f9), to(#f0f0f0));
    background: -moz-linear-gradient(top, #f9f9f9, #f0f0f0);
    border: 1px solid #dedede;
    border-color: #dedede #d8d8d8 #d3d3d3;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
    -webkit-box-shadow: 0 1px 2px #eaeaea, inset 0 1px 0 #fbfbfb;
    -moz-box-shadow: 0 1px 2px #eaeaea, inset 0 1px 0 #fbfbfb;
    box-shadow: 0 1px 2px #eaeaea, inset 0 1px 0 #fbfbfb;
    background: #e6433d;
    background: -webkit-gradient(linear, left top, left bottom, from(#f8674b), to(#d54746));
    background: -moz-linear-gradient(top, #f8674b, #d54746);
    border-color: #d1371c #d1371c #9f220d;
    color: #fff;
    text-shadow: 0 1px 1px #961a07;
    -webkit-box-shadow: 0 1px 2px #d6d6d6, inset 0 1px 0 #ff9573;
    -moz-box-shadow: 0 1px 2px #d6d6d6, inset 0 1px 0 #ff9573;
    box-shadow: 0 1px 2px #d6d6d6
}`,
    `
.iconelement_theme_9 {
    padding: 0;
    margin: 0;
    color: inherit;
    text-align: center;
    font-size: 55px;
    line-height: 1em;
    display: block;
    text-shadow: 3px 2px 5px rgba(0,0,0,0.15)
}

.iconelement_theme_9 i {
  display: inline-block;
    width: auto;
    padding: 10px 16px;
    -moz-box-shadow: inset 0px -7px 8px -7px #ffd59e;
    -webkit-box-shadow: inset 0px -7px 8px -7px #ffd59e;
    box-shadow: inset 0px -7px 8px -7px #ffd59e;
    background: -webkit-gradient(linear, left top, left bottom, color-stop(0.05, #f9d67d), color-stop(1, #f3b156));
    background: -moz-linear-gradient(top, #f9d67d 5%, #f3b156 100%);
    background: -webkit-linear-gradient(top, #f9d67d 5%, #f3b156 100%);
    background: -o-linear-gradient(top, #f9d67d 5%, #f3b156 100%);
    background: -ms-linear-gradient(top, #f9d67d 5%, #f3b156 100%);
    background: linear-gradient(to bottom, #f9d67d 5%, #f3b156 100%);
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#f9d67d', endColorstr='#f3b156', GradientType=0);
    background-color: #f9d67d;
    -moz-border-radius: 8px;
    -webkit-border-radius: 8px;
    border-radius: 8px;
    border: 1px solid #dda755;
    display: inline-block;
    font-weight: bold;
    color: #9d540b !important;
}
`,
    `
.iconelement_theme_10 {
    padding: 0;
    margin: 0;
    color: inherit;
    text-align: center;
    font-size: 55px;
    line-height: 1em;
    display: block;
    text-shadow: 3px 2px 5px rgba(0,0,0,0.15)
}

.iconelement_theme_10 i {
  display: inline-block;
    width: auto;
    background: #3cb371;
    border-radius: 4px;
    padding: 10px 16px;
    background: -webkit-linear-gradient(top, #f4f5f7 0%, #e1e2e6 90%, #cfd1d4 100%);
    background: -moz-linear-gradient(top, #f4f5f7 0%, #e1e2e6 90%, #cfd1d4 100%);
    background: -o-linear-gradient(top, #f4f5f7 0%, #e1e2e6 90%, #cfd1d4 100%);
    background: -ms-linear-gradient(top, #f4f5f7 0%, #e1e2e6 90%, #cfd1d4 100%);
    background: linear-gradient(top, #f4f5f7 0%, #e1e2e6 90%, #cfd1d4 100%);
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#f4f5f7', endColorstr='#cfd1d4', GradientType=0);
    border: 1px solid #949494;
    -webkit-box-shadow: inset 0px 1px 0px #fff,0px 1px 1px rgba(0,0,0,0.15);
    -moz-box-shadow: inset 0px 1px 0px #fff,0px 1px 1px rgba(0,0,0,0.15);
    box-shadow: inset 0px 1px 0px #fff,0px 1px 1px rgba(0,0,0,0.15);
    color: #555454;
    text-shadow: 0px 1px 0px #fff;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px
}
`,
    `
.iconelement_theme_11 {
    padding: 0;
    margin: 0;
    color: inherit;
    text-align: center;
    font-size: 55px;
    line-height: 1em;
    display: block;
    text-shadow: 3px 2px 5px rgba(0,0,0,0.15)
}

.iconelement_theme_11 i {
  display: inline-block;
    width: auto;
    background: #3cb371;
    border-radius: 4px;
    padding: 10px 16px;
    background: -webkit-gradient(linear, left top, left bottom, color-stop(0, #ffd683), color-stop(0.03, #f5b026), to(#f48423));
    filter: progid:DXImageTransform.Microsoft.gradient(startColorStr='#f5b026', EndColorStr='#f48423');
    -ms-filter: "progid:DXImageTransform.Microsoft.gradient(startColorStr='#f5b026', EndColorStr='#f48423')";
    -moz-border-radius: 5px;
    -webkit-border-radius: 5px;
    border-radius: 5px;
    border: 1px solid #e6791c;
    border-bottom: 1px solid #d86f15;
    color: #FFF;
    text-shadow: 0 1px 1px #6f3a02
}`,
    `
.iconelement_theme_12 {
    padding: 0;
    margin: 0;
    color: inherit;
    text-align: center;
    font-size: 55px;
    line-height: 1em;
    display: block;
    text-shadow: 3px 2px 5px rgba(0,0,0,0.15)
}

.iconelement_theme_12 i {
  display: inline-block;
    width: auto;
    background: #3cb371;
    border-radius: 4px;
    padding: 10px 16px;
    color: #fff;
    -moz-box-shadow: inset 0px 1px 0px 0px #7a8eb9;
    -webkit-box-shadow: inset 0px 1px 0px 0px #7a8eb9;
    box-shadow: inset 0px 1px 0px 0px #7a8eb9;
    background: -webkit-gradient(linear, left top, left bottom, color-stop(0.05, #637aad), color-stop(1, #5972a7));
    background: -moz-linear-gradient(top, #637aad 5%, #5972a7 100%);
    background: -webkit-linear-gradient(top, #637aad 5%, #5972a7 100%);
    background: -o-linear-gradient(top, #637aad 5%, #5972a7 100%);
    background: -ms-linear-gradient(top, #637aad 5%, #5972a7 100%);
    background: linear-gradient(to bottom, #637aad 5%, #5972a7 100%);
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#637aad', endColorstr='#5972a7', GradientType=0);
    background-color: #637aad;
    border: 1px solid #314179
}`,
    `
.iconelement_theme_13 {
    padding: 0;
    margin: 0;
    color: inherit;
    text-align: center;
    font-size: 55px;
    line-height: 1em;
    display: block;
    text-shadow: 3px 2px 5px rgba(0,0,0,0.15)
}

.iconelement_theme_13 i {
  display: inline-block;
    width: auto;
    background: #3cb371;
    border-radius: 4px;
    padding: 10px 16px;
    color: #fff;
    background: -webkit-linear-gradient(top, #777 0%, #585858 90%, #454545 100%);
    background: -moz-linear-gradient(top, #777 0%, #585858 90%, #454545 100%);
    background: -o-linear-gradient(top, #777 0%, #585858 90%, #454545 100%);
    background: -ms-linear-gradient(top, #777 0%, #585858 90%, #454545 100%);
    background: linear-gradient(top, #777 0%, #585858 90%, #454545 100%);
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#777777', endColorstr='#454545', GradientType=0);
    border: 1px solid #323232;
    -webkit-box-shadow: inset 0px 1px 0px rgba(255,255,255,0.35),0px 1px 1px rgba(0,0,0,0.15);
    -moz-box-shadow: inset 0px 1px 0px rgba(255,255,255,0.35),0px 1px 1px rgba(0,0,0,0.15);
    box-shadow: inset 0px 1px 0px rgba(255,255,255,0.35),0px 1px 1px rgba(0,0,0,0.15);
    color: #fff;
    text-shadow: 0px -1px 0px rgba(0,0,0,0.22);
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px
}`,
  ]

  if (element.content.html.includes('iconelement_theme_')) {
    const themeClass = element.content.html.match(/iconelement_theme_\d+/g)
    const themeNumber = themeClass[0].match(/\d+/g)
    let css = cf_classic_themes[themeNumber[0] - 1]
    css = css.replace(/\.iconelement_theme_\d+/g, `#${element.id}`)
    app.generatedCSS += `\n\n/* CSS for Icon */\n`
    app.generatedCSS += css
    app.recommendations.push({
      type: 'Icon Theme',
      status: 'CSS',
      explainer: 'Custom CSS has been applied to the page to support the theme of this icon.',
    })
  }

  output.selectors = {
    '.fa_icon': {
      attrs: {
        className: element.content.fontAwesome,
        style: {
          'padding-top': '10px',
          'padding-bottom': '10px',
          'font-size': parseInt(css['font-size']) || 0,
        },
      },
      params: {
        'font-size--unit': 'px',
      },
    },
    '.iconElement': {
      attrs: {
        style: {
          'margin-top': parseInt(element.css['margin-top']) || 0,
          'text-align': css['text-align'] || 'center',
          'padding-top': parseInt(css['padding-top']) || 0,
          'padding-bottom': parseInt(css['padding-bottom']) || 0,
          position: css['position'] || 'relative',
          'z-index': parseInt(css['z-index']) || 0,
          opacity: parseInt(css['opacity']) || 1,
        },
      },
      params: params(css, 'element', element.id),
    },
    '.iconElement .fa, .iconElement .fas, .iconElement .fa-fw': {
      attrs: {
        style: {
          color: css['color'],
        },
      },
    },
  }

  if (href) {
    output.selectors['.iconElement'].params.href = href
  }

  output.attrs.id = element.id

  return output
}
