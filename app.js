/*
 *   Copyright (c) 2023 Wynter Jones
 *   All rights reserved.
 */
const app = {
  base_url: 'https://members.funnelplugins.io',

  copiedCSS: '',
  copiedJS: '',
  idList: [],
  recommendations: [],
  iframeId: '',

  getEmail: async () => {
    return await chrome.storage.sync.get(['linkfunnels_loggedin_email_api'])
  },

  setEmail: email => {
    chrome.storage.sync.set({ linkfunnels_loggedin_email_api: email }, function () {
      return true
    })
  },

  isValidEmail: email => {
    const regexExp =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi

    return regexExp.test(email)
  },

  connect: async callback => {
    const queryOptions = { active: true, currentWindow: true }
    const tabs = await chrome.tabs.query(queryOptions)
    const port = chrome.tabs.connect(tabs[0].id, {
      name: 'FunnelPlugins.io',
    })

    callback(port)
  },

  htmlToDom: html => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = html
    return wrapper
  },

  makeId: () => {
    let id = ''
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < 5; i++) {
      id += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    const finalId = `6Z-${id}-0`
    if (!app.idLookupTable.includes(finalId)) {
      return finalId
    } else {
      app.makeId()
    }
  },

  idLookupTable: [],

  checkVisibility: element => {
    const hideOn = element.getAttribute('data-hide-on')
    if (hideOn === 'desktop') {
      return 'desktop'
    } else if (hideOn === 'mobile') {
      return 'mobile'
    } else if (!hideOn && element.style.display === 'none') {
      return 'none'
    } else {
      return null
    }
  },

  filtered: array => {
    return array.filter(function (x) {
      return x !== undefined && x !== false
    })
  },
}
