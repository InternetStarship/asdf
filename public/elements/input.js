const input = data => {
  const element = data.element
  const id = data.id
  const parentId = data.parentId
  const index = data.index
  const css = properties.css(element.id, 'input')
  const borderRadius = properties.borderRadius(css)
  const theParams = params(css, 'input', element.id)
  theParams['label'] = element.content.placeholder || ''
  delete theParams['--style-background-color']

  theParams['width--unit'] = '%'

  // inputRequiredCSS(element.id, id)

  const output = {
    type: 'Input/V1',
    id: id,
    version: 0,
    parentId: parentId,
    fractionalIndex: `a${index}`,
    attrs: {
      'data-skip-shadow-settings': 'false',
      type: element.content.name,
      style: {
        width: 100,
        'margin-top': parseInt(element.css['margin-top']) || 0,
      },
    },
    params: theParams,
    selectors: {
      '.elInput': {
        attrs: {
          name: element.content.name,
          type: element.content.name,
          className: element.content.required,
          style: {
            'margin-top': 0,
            'text-align': css['text-align'] || 'left',
            'padding-top': parseInt(css['padding-top']) || 0,
            'padding-bottom': parseInt(css['padding-bottom']) || 0,
            position: css['position'] || 'relative',
            'z-index': parseInt(css['z-index']) || 0,
            'font-size': parseInt(css['font-size']) || 16,
            color: css['color'] || '#000000',
          },
          params: {
            'font-size--unit': 'px',
          },
        },
      },
      '.inputHolder, .borderHolder': {
        attrs: {
          'data-skip-corners-settings': 'false',
          style: {
            'margin-top': 0,
            'text-align': css['text-align'] || 'left',
            'padding-top': parseInt(css['padding-top']) || 0,
            'padding-bottom': parseInt(css['padding-bottom']) || 0,
            position: css['position'] || 'relative',
            'z-index': parseInt(css['z-index']) || 0,
            'font-size': parseInt(css['font-size']) || 16,
            color: css['color'] || '#000000',
          },
          params: {
            'font-size--unit': 'px',
          },
        },
        params: params(css, 'input', element.id),
      },
    },
  }
  output.selectors['.inputHolder, .borderHolder'].attrs.style = Object.assign(
    output.selectors['.inputHolder, .borderHolder'].attrs.style,
    borderRadius
  )
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

function inputRequiredCSS(elementId, id) {
  const input = document.querySelector(`#${elementId} .elInput`)

  const colors = ['elInputIColor', 'elInputIBlack', 'elInputIWhite']
  const types = ['elInputIName', 'elInputIEmail', 'elInputIPhone', 'elInputIAddress']
  const images = ['name', 'email', 'phone', 'address']
  const bgColor = ['elInputBG1', 'elInputBG2', 'elInputBG3', 'elInputBG4', 'elInputBG5']

  colors.map(color => {
    let version = ''
    if (color === 'elInputIBlack') version = '2'
    if (color === 'elInputIWhite') version = '3'

    types.map((type, index) => {
      if (input.classList.contains(color) && input.classList.contains(type)) {
        let bg_color = ''
        let bg_gradient = ''
        let bg_position = '97%'

        if (input.classList.contains('elInputILeft')) bg_position = '3%'
        bgColor.map(bg => {
          if (input.classList.contains(bg)) {
            if (bg === 'elInputBG1') bg_color = '#ffffff'
            if (bg === 'elInputBG2') bg_color = '#F1F1F1'
            if (bg === 'elInputBG3') bg_color = 'rgba(0,0,0,0.5)'
            if (bg === 'elInputBG4') {
              bg_color = ''
              bg_gradient = ', linear-gradient(top, #fff, #efefef)'
            }
            if (bg === 'elInputBG5') {
              bg_color = ''
              bg_gradient = ', linear-gradient(to bottom, #ebebeb 0%, #f6f6f6 9%, white 100%)'
            }
          }
        })

        app.copiedCSS += `
        .id-${id}[data-page-element="Input/V1"] .elInput {
          background: url('https://app.clickfunnels.com/images/${images[index]}${version}.png') no-repeat ${bg_color} ${bg_position}${bg_gradient}  !important;
        }
        .id-${id} .inputHolder, 
        .id-${id} .borderHolder {
            background: none !important;
        }
        `
      }
    })
  })
}
