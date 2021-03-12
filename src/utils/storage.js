export const getItem = (prop) => {
  return JSON.parse(localStorage.getItem(prop))
}

export const setItem = (prop, value) => {
  localStorage.setItem(prop, JSON.stringify(value))

  return getItem(prop)
}

export const removeItem = (prop) => {
  localStorage.removeItem(prop)
}
