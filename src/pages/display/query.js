let urlParams = new URLSearchParams(window.location.search);
const urlTag = 't'

  // push the state in URL
const updateHistory = () => {
  window.history.pushState("", "",
    `${window.location.origin}${window.location.pathname}?${urlParams}${window.location.hash}`
  )
}

export const getTags = () => {
  return urlParams.getAll(urlTag)
}

export const setTag = (tag) => {
  urlParams.append(urlTag, tag)

  updateHistory()
}

export const unsetTag = (tag) => {
  // prepare a target parameter object
  const newUrlParams = new URLSearchParams(window.location.search)
  newUrlParams.delete(urlTag)

  // remove the tag and update the above target object
  getTags()
  .filter(oldTag => oldTag !== tag)
  .forEach((newTag) => {
    newUrlParams.append(urlTag, newTag);
  })
  // replace current parameters
  urlParams = newUrlParams

  updateHistory()
}
