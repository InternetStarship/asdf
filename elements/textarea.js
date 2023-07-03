const textarea = data => {
  const element = data.element
  const output = app.blueprint('TextArea/V1', data.id, data.parentId, data.index, element)
  const css = app.properties.css(element.id, 'input')

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
    '.elTextarea': {
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

  app.cssForInput(element.id, 'TextArea')
  output.attrs.id = element.id

  return output
}
