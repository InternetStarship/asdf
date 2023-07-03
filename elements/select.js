const select = data => {
  const element = data.element
  const output = app.blueprint('SelectBox/V1', data.id, data.parentId, data.index, element)
  const css = app.properties.css(element.id, 'select')
  let dataType = element.content.name
  let selectName = element.content.name
  let customType = element.content.custom_type
  let placeholder = null

  if (dataType === 'cfx_all_countries') {
    dataType = 'all_countries'
    selectName = 'country'
    placeholder = 'Select Country'
  } else if (dataType === 'cfx_states') {
    dataType = 'all_united_states'
    selectName = 'state'
    placeholder = 'Select State'
  } else if (dataType === 'cfx_canada') {
    dataType = 'all_canadian_provinces'
    selectName = 'state'
    placeholder = 'Select Province'
  } else {
    dataType = dataType.replace('cfx_', '')
  }

  output.attrs = {
    style: {
      'padding-top': 11,
      'padding-bottom': 11,
      'margin-left': '0px',
      width: element.content.width,
    },
  }

  const defaultOptionId = app.makeId()

  if (placeholder) {
    output.children = [
      {
        type: 'option',
        attrs: {
          value: 'DEFAULT',
        },
        id: defaultOptionId,
        version: 0,
        parentId: data.id,
        fractionalIndex: 'a0',
        children: [
          {
            type: 'text',
            innerText: placeholder,
            id: app.makeId(),
            version: 0,
            parentId: defaultOptionId,
            fractionalIndex: 'a0',
          },
        ],
      },
    ]
  } else {
    output.children = [
      {
        type: 'option',
        attrs: {
          value: '',
        },
        id: defaultOptionId,
        version: 0,
        parentId: data.id,
        fractionalIndex: 'a0',
        children: [
          {
            type: 'text',
            innerText: 'Select your option',
            id: app.makeId,
            version: 0,
            parentId: defaultOptionId,
            fractionalIndex: 'a0',
          },
        ],
      },
    ]

    element.content.items.forEach(item => {
      const optionId = app.makeId()
      output.children.push({
        type: 'option',
        attrs: {
          value: item.value,
        },
        id: optionId,
        version: 0,
        parentId: data.id,
        fractionalIndex: 'a1',
        children: [
          {
            type: 'text',
            innerText: item.text,
            id: app.makeId(),
            version: 0,
            parentId: optionId,
            fractionalIndex: 'a0',
          },
        ],
      })
    })
  }

  if (dataType === 'states_canada') {
    selectName = 'something'
    dataType = null
    customType = null
    output.children = []
    app.recommendations.push({
      type: 'Select',
      status: 'Not Supported',
      explainer: 'Select option for Canada & United States is not supported.',
    })
  }

  output.selectors = {
    '.elSelect': {
      attrs: {
        style: {
          'padding-top': '12px',
          'padding-bottom': '12px',
          'font-size': parseInt(css['font-size']) || 16,
        },
        className: element.content.required,
        name: selectName,
      },
    },
    '.elSelect, .elSelectLabel': {
      attrs: {
        style: {
          'font-size': parseInt(css['font-size']) || 16,
        },
        'data-skip-text-shadow-settings': 'false',
      },
    },
    '.elSelectWrapper': {
      attrs: {},
    },
  }

  if (customType) {
    output.selectors['.elSelect'].attrs['data-custom-type'] = customType
  }

  if (dataType) {
    output.selectors['.elSelectWrapper'].attrs['data-type'] = dataType
  }

  app.cssForInput(element.id, 'Select')
  output.attrs.id = element.id

  return output
}
