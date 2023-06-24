const blueprint = (type, id, parentId, index, element) => {
  const output = {
    type: type,
    id: id,
    version: 0,
    parentId: parentId,
    fractionalIndex: `a${index}`,
  }

  // Visbility
  if (element.content.visible) {
    output.attrs['data-show-only'] = element.content.visible
  }

  // Animations
  output.attrs = Object.assign(output.attrs, animations.attrs(document.querySelector(`[id="${element.id}"]`)))
  output.params = Object.assign(
    output.params,
    animations.params(document.querySelector(`[id="${element.id}"]`))
  )

  return output
}
