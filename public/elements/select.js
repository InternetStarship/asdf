/*
 *   Copyright (c) 2023 Wynter Jones
 *   All rights reserved.
 */
const select = data => {
  let pageDocument = document
  if (app.iframeId) {
    pageDocument = document.querySelector(`iframe#${app.iframeId}`).contentDocument
  }

  const element = data.element
  const id = data.id
  const parentId = data.parentId
  const index = data.index
  const css = properties.css(element.id, 'select')
  const borderRadius = properties.borderRadius(css)
  const theParams = params(css, 'element', element.id)
  theParams['align'] = 'left'
  const output = {
    type: 'SelectBox/V1',
    id: id,
    version: 0,
    parentId: parentId,
    fractionalIndex: `a${index}`,
    params: theParams,
    attrs: {
      style: {
        'padding-top': 11,
        'padding-bottom': 11,
        'margin-left': '0px',
        width: element.content.width,
      },
    },
    selectors: {
      '.elSelect': {
        params: {
          'padding-top--unit': 'px',
          'padding-bottom--unit': 'px',
          '--style-padding-horizontal--unit': 'px',
          '--style-padding-horizontal': 30,
        },
        attrs: {
          style: {
            'padding-top': 13,
            'padding-bottom': 14,
          },
          className: 'required1',
          name: 'custom_type',
          'data-custom-type': 'dasdasdasd',
        },
      },
      '.elSelectArrow': {
        attrs: {
          style: {
            right: 30,
          },
        },
      },
      '.elSelect, .elSelectLabel': {
        attrs: {
          style: {
            'font-size': 18,
            'letter-spacing': 0.27,
            'text-decoration': 'underline',
          },
          'data-skip-text-shadow-settings': 'false',
        },
        params: {
          'font-size--unit': 'px',
          'letter-spacing--unit': 'rem',
          '--style-text-shadow-x': 2,
          '--style-text-shadow-y': 2,
          '--style-text-shadow-blur': 4,
          '--style-text-shadow-color': '#aab7c7',
        },
      },
      '.elSelectWrapper': {
        attrs: {
          'data-type': 'custom_type',
        },
      },
    },
    children: [
      {
        type: 'option',
        attrs: {
          value: 'something',
        },
        id: '6Z-6O4GA-21',
        version: 0,
        parentId: '6Z-6O4GA-20',
        fractionalIndex: 'a0',
        children: [
          {
            type: 'text',
            innerText: ' Option ',
            id: '6Z-6O4GA-22',
            version: 0,
            parentId: '6Z-6O4GA-21',
            fractionalIndex: 'a0',
          },
        ],
      },
    ],
  }
  output.selectors['.elSelect'].attrs.style = Object.assign(
    output.selectors['.elSelect'].attrs.style,
    borderRadius
  )
  if (element.content.visible) {
    output.attrs['data-show-only'] = element.content.visible
  }
  output.attrs = Object.assign(
    output.attrs,
    animations.attrs(pageDocument.querySelector(`[id="${element.id}"]`))
  )
  output.params = Object.assign(
    output.params,
    animations.params(pageDocument.querySelector(`[id="${element.id}"]`))
  )
  return output
}
