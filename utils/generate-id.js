const generateID = () => {
  let id = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < 5; i++) {
    id += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  const finalId = `6Z-${id}-0`
  return finalId
}

module.exports = generateID
