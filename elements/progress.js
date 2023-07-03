const progress = data => {
  const element = data.element
  const output = app.blueprint('ProgressBar/V1', data.id, data.parentId, data.index, element)
  const cssParent = app.properties.css(element.id)
  const css = app.properties.css(element.id, 'progress')
  const cssBar = app.properties.css(element.id, 'progress-bar')
  const borderRadius = app.properties.borderRadius(css)
  const borderRadiusBar = app.properties.borderRadius(cssBar)
  let fontWeight = cssBar['font-weight']
  if (fontWeight === 'normal') {
    fontWeight = '400'
  } else if (fontWeight === 'bold') {
    fontWeight = '600'
  } else if (fontWeight === 'bolder') {
    fontWeight = '800'
  } else if (fontWeight === 'lighter') {
    fontWeight = '200'
  }

  const classic_themes = [
    'elButtonGradient',
    'elButtonBottomBorder',
    'elButtonSubtle',
    'progress-bar-striped',
    'progress-bar-striped_active',
  ]
  const classic_themes_css = {
    elButtonGradient: {
      css: `
.replace-me .progress-bar { 
  box-shadow: inset 0 0 0 2px rgba(255,255,255,0.2);
  border: 1px solid rgba(0,0,0,0.1);
}`,
    },
    elButtonBottomBorder: {
      css: `
.replace-me .progress-bar { border-bottom: 3px solid rgba(0,0,0,0.2); }
`,
    },
    elButtonSubtle: {
      css: `
.replace-me .progress-bar {
  border: 1px solid rgba(0,0,0,0.1);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.2);
}`,
    },
    'progress-bar-striped': {
      css: `
.replace-me .progress-bar {
  background-image: linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent);
  background-size: 40px 40px;
}`,
    },
    'progress-bar-striped_active': {
      css: `
.replace-me .progress-bar {
  background-image: linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent);
  background-size: 40px 40px;
  animation: progress-bar-stripes 2s linear infinite reverse;
}
      
@-webkit-keyframes progress-bar-stripes {
  from {
      background-position: 40px 0
  }

  to {
      background-position: 0 0
  }
}

@keyframes progress-bar-stripes {
  from {
      background-position: 40px 0
  }

  to {
      background-position: 0 0
  }
}
    `,
    },
  }

  const domElement = document.querySelector(`#${element.id} .progress-bar`)

  classic_themes.forEach(theme => {
    if (domElement.classList.contains(theme)) {
      let css = classic_themes_css[theme].css
      css = css.replace(/\.replace-me/g, `#${element.id}`)
      app.generatedCSS += `\n\n/* CSS for Progress Bar */\n`
      app.generatedCSS += css
      app.recommendations.push({
        type: 'Progress Bar Theme',
        status: 'CSS',
        explainer: 'Custom CSS has been applied to the page to support the theme of this progress bar.',
      })
    }
  })

  output.selectors = {
    '.progress': {
      attrs: {
        'data-skip-shadow-settings': 'false',
        'data-skip-corners-settings': 'false',
        'data-skip-background-settings': 'false',
        style: {
          'margin-top': parseInt(cssParent['margin-top']) || 0,
        },
      },
      params: app.params(css, 'element', element.id),
    },
    '.progress-bar': {
      params: {
        '--style-background-color': cssBar['background-color'],
        'height--unit': 'px',
      },
      attrs: {
        style: {
          height: element.content.height,
          'padding-left': parseInt(cssBar['padding-left']) || 0,
        },
      },
    },
    '.progress-label': {
      attrs: {
        style: {
          'text-align': cssBar['text-align'],
          'font-size': cssBar['font-size'],
          'text-shadow': cssBar['text-shadow'],
          'font-weight': fontWeight,
        },
      },
    },
  }

  output.params = {
    'progress-text': element.content.label,
    show_text_outside: 'false',
    'width--unit': 'px',
    progress: element.content.percentage,
    'margin-top--unit': 'px',
  }

  output.attrs = {
    style: {
      width: element.content.width,
      'margin-top': parseInt(cssBar['margin-top']) || 0,
    },
  }

  output.selectors['.progress'].attrs.style = Object.assign(
    output.selectors['.progress'].attrs.style,
    borderRadius
  )

  output.selectors['.progress-bar'].attrs.style = Object.assign(
    output.selectors['.progress-bar'].attrs.style,
    borderRadiusBar
  )

  output.attrs.id = element.id

  return output
}
