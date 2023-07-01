const input = data => {
  const element = data.element
  const output = blueprint('Input/V1', data.id, data.parentId, data.index, element)
  const css = properties.css(element.id, 'input')

  output.params = {
    label: element.content.placeholder,
    labelType: 'on-border',
    '--style-background-color': '#fff',
  }

  output.attrs = {
    type: element.content.name,
    style: {
      'margin-top': parseInt(element.css['margin-top']) || 0,
    },
  }

  output.selectors = {
    '.elInput': {
      attrs: {
        name: element.content.name,
        type: element.content.name,
        className: element.content.required,
        'data-custom-type': element.content.custom_type,
      },
    },
    '.inputHolder, .borderHolder': {
      attrs: {
        style: {
          'padding-top': '12px',
          'padding-bottom': '12px',
          'font-size': parseInt(css['font-size']) || 16,
        },
      },
      params: {
        '--style-padding-horizontal': '12px',
        '--style-border-width': '1px',
        '--style-border-style': 'solid',
        '--style-border-color': 'rgba(0, 0, 0, 0.2)',
        'font-size--unit': 'px',
      },
    },
    '&.elFormItemWrapper .labelText': {
      attrs: {
        style: {
          'font-size': parseInt(css['font-size']) || 16,
        },
      },
      params: {
        'font-size--unit': 'px',
      },
    },
    '&.elFormItemWrapper.elFormItemWrapper.elInputFocused .labelText': {
      attrs: {
        style: {
          'font-size': parseInt(css['font-size']) - 3 || 16,
        },
      },
      params: {
        'font-size--unit': 'px',
      },
    },
    '&.elFormItemWrapper.hasValue .labelText': {
      attrs: {
        style: {
          'font-size': parseInt(css['font-size']) - 3 || 16,
        },
      },
      params: {
        'font-size--unit': 'px',
      },
    },
    '.elInput::placeholder': {
      attrs: {
        style: {
          'font-size': parseInt(css['font-size']) || 16,
        },
      },
      params: {
        'font-size--unit': 'px',
      },
    },
    '&.elFormItemWrapper, .inputHolder, .borderHolder': {
      attrs: {
        'data-skip-corners-settings': 'false',
        style: {
          'border-radius': '4px',
        },
      },
    },
  }

  inputRequiredCSS(element.id, data.id)

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

        app.copiedCSS += `\n\n/* CSS for Input */\n`
        app.copiedCSS += `.id-${id}[data-page-element="Input/V1"] .elInput {
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
