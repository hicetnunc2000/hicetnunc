let urlParams = new URLSearchParams(window.location.search);
const urlTag = 't'

  // push the state in URL
const updateTagHistory = () => {
  window.history.replaceState("", "",
    `${window.location.origin}${window.location.pathname}${urlParams.has(urlTag) ? `?${urlParams}` : ''}${window.location.hash}`
  )
}

const filterUnique = (e, index, array) => {
  return array.indexOf(e) === index
}

const sortByCount = (a, b) => {
  return b.count - a.count
}

export const getTagsParams = () => {
  return urlParams.getAll(urlTag)
}

export const existsTagsParam = () => {
  return urlParams.getAll(urlTag).length > 0
}

export const setTagParam = (tag) => {
  urlParams.append(urlTag, tag)

  updateTagHistory()
}

export const unsetTagParam = (tag) => {
  // prepare a target parameter object
  const newUrlParams = new URLSearchParams(window.location.search)
  newUrlParams.delete(urlTag)

  // remove the tag and update the above target object
  getTagsParams()
  .filter(oldTag => oldTag !== tag)
  .forEach((newTag) => {
    newUrlParams.append(urlTag, newTag);
  })
  // replace current parameters
  urlParams = newUrlParams

  updateTagHistory()
}

export const enableAllTagsParams = (tags) => {
  // prepare a target parameter object
  const newUrlParams = new URLSearchParams(window.location.search)
  newUrlParams.delete(urlTag)

  tags.forEach((newTag) => {
    newUrlParams.append(urlTag, newTag);
  })
  // replace current parameters
  urlParams = newUrlParams

  updateTagHistory()
}

export const removeAllTagsParams = () => {
  urlParams.delete(urlTag)
  updateTagHistory()
}

export const buildTagObjects = (ref) => {
  // array compositon is splitted in two just to count tags
  // probably there's a better way
  const tagsObject = {}
  const urlTags = getTagsParams()

  let tagsArray = ref.map(e => e.token_info.tags).flat()
  tagsArray = tagsArray.filter(filterUnique)
    .map((name) => {
      const countTotal = (total, current) => {
        return current === name ? total + 1 : total
      };

      return {
        name: name,
        count: tagsArray.reduce(countTotal, 0),
        // if exists query for tags in url use the query to determine the active state
        active: existsTagsParam() ? urlTags.indexOf(name) >= 0 : true,
      }
    })
    .sort(sortByCount)
    .forEach((tag) => tagsObject[tag.name] = tag)

  return tagsObject
}

export const disableAllTags = (tags) => {
  const targetTags = { ...tags }
  for (const tag in targetTags) {
    targetTags[tag].active = false
  }
  removeAllTagsParams()
  return targetTags
}

export const enableAllTags = (tags) => {
  const targetTags = { ...tags }
  const tagList = []
  for (const tag in targetTags) {
    targetTags[tag].active = true
    tagList.push(tag)
  }
  // a link without tags enable all tags by default
  // doesn't make sense to share a page with all objkts filtered out, right? :)
  // to avoid HUGE URLs when all tags are enabled parameters are empty
  removeAllTagsParams()
  return targetTags
}
