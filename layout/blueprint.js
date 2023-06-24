const blueprint = (type, id, parentId, index, element) => {
  const output = {
    type: type,
    id: id,
    version: 0,
    parentId: parentId,
    fractionalIndex: `a${index}`,
    attrs: {},
    params: {},
  }

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
