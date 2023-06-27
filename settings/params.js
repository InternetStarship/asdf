const params = (css, type = null, id = null, params = {}) => {
  if (css === undefined || css === null) return false

  const borderRadiusCorner = properties.borderRadius(css, 'check')
  const data = {
    // '--style-padding-horizontal--unit': checkParamType(css['padding-left']),
    'margin-top--unit': checkParamType(css['margin-top']),
    'padding-top--unit': checkParamType(css['padding-top']),
    'padding-bottom--unit': checkParamType(css['padding-bottom']),
    'border-radius--unit': checkParamType(
      css['border-top-left-radius'] ||
        css['border-top-right-radius'] ||
        css['border-bottom-left-radius'] ||
        css['border-bottom-right-radius']
    ),
    'border-top-right-radius--unit': checkParamType(css['border-top-right-radius']),
    'border-top-left-radius--unit': checkParamType(css['border-top-left-radius']),
    'border-bottom-right-radius--unit': checkParamType(css['border-bottom-right-radius']),
    'border-bottom-left-radius--unit': checkParamType(css['border-bottom-left-radius']),
    'border-top-width--unit': checkParamType(css['border-top-width']),
    'border-bottom-width--unit': checkParamType(css['border-bottom-width']),
    'border-left-width--unit': checkParamType(css['border-left-width']),
    'border-right-width--unit': checkParamType(css['border-right-width']),
    'border-width--unit': checkParamType(css['border-width']),
    // '--style-margin-horizontal--unit': checkParamType(css['margin-left'] || css['margin-right']),
    'width--unit': checkParamType(css['width']),
    'letter-spacing--unit': checkParamType(css['letter-spacing']),
    'line-height--unit': checkParamType(css['line-height']),
    'font-size--unit': checkParamType(css['font-size']),
    'separate-corners': !borderRadiusCorner,
  }

  if (css['background-color'] !== undefined) {
    data['--style-background-color'] = css['background-color']
  }

  if (css['background-image'] !== undefined && type !== 'input') {
    data['--style-background-image-url'] = css['background-image']
      .replace('url(', '')
      .replace(')', '')
      .replace(/"/g, '')
  }

  const backgroundPosition = css['background-position']

  if (backgroundPosition) {
    const checkCSS = backgroundPosition.split(' ')
    const position = {
      vertical: 0,
      horizontal: 0,
    }

    if (checkCSS[0].includes('%')) {
      if (parseInt(checkCSS[0]) === 50) {
        position.vertical = 'center'
      }

      if (parseInt(checkCSS[0]) === 100) {
        position.vertical = 'top'
      }

      if (parseInt(checkCSS[0]) === 0) {
        position.vertical = 'bottom'
      }
    }

    if (checkCSS[1].includes('%')) {
      if (parseInt(checkCSS[1]) === 50) {
        position.horizontal = 'center'
      }

      if (parseInt(checkCSS[1]) === 100) {
        position.horizontal = 'left'
      }

      if (parseInt(checkCSS[1]) === 0) {
        position.horizontal = 'right'
      }
    }

    data['--style-background-position'] = `${position.horizontal} ${position.vertical} !important`
  }

  // if (type === 'section') {
  //   const paddingLeft = document.querySelector(`.container[id="${id}"] .containerInner`).style.paddingLeft
  //   if (paddingLeft) {
  //     data['--style-padding-horizontal'] = parseInt(paddingLeft)
  //   }
  // } else if (type === 'column') {
  //   if (css['padding-left'] !== undefined) {
  //     data['--style-margin-horizontal'] = parseInt(css['margin-left'])
  //     data['--style-padding-horizontal'] = parseInt(css['padding-left'])
  //   }
  // } else if (type === 'headline') {
  //   if (document.querySelector(`.elHeadlineWrapper[id="${id}"]`)) {
  //     const paddingLeft = document.querySelector(`.elHeadlineWrapper[id="${id}"]`).style.paddingLeft
  //     data['--style-padding-horizontal'] = parseInt(paddingLeft) || 0
  //   } else {
  //     data['--style-padding-horizontal'] = parseInt(css['padding-left'])
  //   }
  // } else if (type === 'input') {
  //   if (document.querySelector(`.elInputWrapper[id="${id}"] elInput`)) {
  //     const paddingLeft = document.querySelector(`.elInputWrapper[id="${id}"] elInput`).style.paddingLeft
  //     data['--style-padding-horizontal'] = parseInt(paddingLeft) || 0
  //   } else {
  //     data['--style-padding-horizontal'] = parseInt(css['padding-left'])
  //   }
  // } else {
  //   if (css['padding-left'] !== undefined) {
  //     data['--style-padding-horizontal'] = parseInt(css['padding-left'])
  //   }
  // }

  if (css['box-shadow']) {
    const boxShadow = css['box-shadow']
    const shadowArray = boxShadow.match(/(?:[^\s\(\)]+|\([^\(\)]*\))+/g)

    if (shadowArray[0] !== 'none') {
      if (shadowArray.includes('inset')) {
        data['--style-box-shadow-style-type'] = 'inset'
      }
      data['--style-box-shadow-color'] = shadowArray[0]
      data['--style-box-shadow-distance-x'] = parseInt(shadowArray[1])
      data['--style-box-shadow-distance-y'] = parseInt(shadowArray[2])
      data['--style-box-shadow-blur'] = parseInt(shadowArray[3])
      data['--style-box-shadow-spread'] = parseInt(shadowArray[4])

      data['--style-box-shadow-spread--unit'] = checkParamType(shadowArray[4])
      data['--style-box-shadow-blur--unit'] = checkParamType(shadowArray[3])
      data['--style-box-shadow-distance-y--unit'] = checkParamType(shadowArray[2])
      data['--style-box-shadow-distance-x--unit'] = checkParamType(shadowArray[1])
    }
  }

  if (css['text-shadow']) {
    const textShadow = css['text-shadow']
    const shadowArray = textShadow.match(/(?:[^\s\(\)]+|\([^\(\)]*\))+/g)
    if (shadowArray[0] !== 'none') {
      data['--style-text-shadow-x'] = parseInt(shadowArray[1])
      data['--style-text-shadow-y'] = parseInt(shadowArray[2])
      data['--style-text-shadow-blur'] = parseInt(shadowArray[3])
      data['--style-text-shadow-color'] = shadowArray[0]
    }
  }

  const borderColor = properties.borderColor(css)
  if (borderColor['border-color']) {
    data['--style-border-color'] = borderColor['border-color']
  } else {
    data['--style-border-color'] = 'transparent'
  }

  const borderStyle = properties.borderStyle(css)
  if (borderStyle['border-style']) {
    data['--style-border-style'] =
      borderStyle['border-style'] === 'none' ? 'solid' : borderStyle['border-style']
  } else {
    data['--style-border-style'] = 'solid'
  }

  if (type === 'row') {
    console.log(borderStyle['border-style'], borderColor['border-color'], type, 'check me')
  }

  const borderWidth = properties.borderWidth(css)
  // if (borderWidth['border-width']) {
  //   data['--style-border-width'] = borderWidth['border-width']
  // }

  if (borderWidth['border-bottom-width']) {
    data['--style-border-bottom-width'] = `${parseInt(borderWidth['border-bottom-width'])}px`
  } else {
    data['--style-border-bottom-width'] = '0px'
  }

  if (borderWidth['border-top-width']) {
    data['--style-border-top-width'] = `${parseInt(borderWidth['border-top-width'])}px`
  } else {
    data['--style-border-top-width'] = '0px'
  }

  if (borderWidth['border-left-width']) {
    data['--style-border-left-width'] = `${parseInt(borderWidth['border-left-width'])}px`
  } else {
    data['--style-border-left-width'] = '0px'
  }

  if (borderWidth['border-right-width']) {
    data['--style-border-right-width'] = `${parseInt(borderWidth['border-right-width'])}px`
  } else {
    data['--style-border-right-width'] = '0px'
  }

  // // check if 0 and make 0px

  // if (parseInt(css['border-bottom-width']) === 0) {
  //   data['--style-border-bottom-width'] = '0px'
  // }

  // if (parseInt(css['border-top-width']) === 0) {
  //   data['--style-border-top-width'] = '0px'
  // }

  // if (parseInt(css['border-left-width']) === 0) {
  //   data['--style-border-left-width'] = '0px'
  // }

  // if (parseInt(css['border-right-width']) === 0) {
  //   data['--style-border-right-width'] = '0px'
  // }

  return { ...data, ...params }
}

const checkParamType = type => {
  if (type === undefined) return 'px'

  const check = type.match(/px|%/)
  if (check) {
    return check[0]
  }
  return 'px'
}
