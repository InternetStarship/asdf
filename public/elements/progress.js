/*
 *   Copyright (c) 2023 Wynter Jones
 *   All rights reserved.
 */
const progress = data => {
  let pageDocument = document
  if (app.iframeId) {
    pageDocument = document.querySelector(`iframe#${app.iframeId}`).contentDocument
  }

  const element = data.element
  const id = data.id
  const parentId = data.parentId
  const index = data.index
  const output = {
    type: 'ProgressBar/V1',
    id: id,
    version: 0,
    parentId: parentId,
    fractionalIndex: `a${index}`,
    selectors: {
      '.progress': {
        attrs: {
          'data-skip-shadow-settings': 'false',
          'data-skip-corners-settings': 'false',
          style: {
            'border-radius': '4px',
          },
        },
        params: {
          '--style-box-shadow-distance-x': 0,
          '--style-box-shadow-distance-y': 0,
          '--style-box-shadow-blur': 4,
          '--style-box-shadow-spread': 0,
          '--style-box-shadow-color': 'rgba(0, 0, 0, 0.16)',
          '--style-box-shadow-style-type': 'inset',
          '--style-box-shadow-spread--unit': 'px',
          '--style-box-shadow-blur--unit': 'px',
          '--style-background-color': 'rgb(230, 190, 190)',
          '--style-border-style': 'solid',
          '--style-border-width': 1,
          '--style-border-color': '#000000',
        },
      },
      '.progress-bar': {
        params: {
          '--style-background-color': 'rgb(28, 56, 88)',
          'height--unit': 'px',
        },
        attrs: {
          style: {
            height: 30,
          },
        },
      },
    },
    params: {
      'progress-text': 'aAlmost Complete...',
      show_text_outside: 'false',
      'width--unit': 'px',
      progress: 30,
      'margin-top--unit': 'px',
    },
    attrs: {
      style: {
        width: 905,
        'margin-top': 15,
      },
    },
  }
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
