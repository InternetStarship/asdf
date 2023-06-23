const flex_container = (children, parentId, index) => {
  const id = app.makeId()
  children.forEach(item => {
    item.parentId = id
  })

  const output = {
    type: 'FlexContainer/V1',
    id: id,
    version: 0,
    parentId: parentId,
    fractionalIndex: `a${index}`,
    attrs: {
      className: 'elFlexNoWrapMobile elFlexNoWrap',
      style: {
        width: 100,
        'justify-content': 'flex-start',
        'flex-direction': 'row',
        'margin-top': 0,
        'padding-top': 0,
        'padding-bottom': 0,
        gap: 0,
      },
    },
    params: {
      'width--unit': '%',
      'gap--unit': 'em',
      'margin-top--unit': 'px',
      '--style-padding-horizontal--unit': 'px',
      '--style-padding-horizontal': 0,
    },
    children: children,
  }

  return output
}
