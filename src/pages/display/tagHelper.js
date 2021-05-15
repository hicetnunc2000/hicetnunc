import { getTags, existsTags } from './query'

const filterUnique = (e, index, array) => {
  return array.indexOf(e) === index
}

const sortByCount = (a, b) => {
  return b.count - a.count
}

export const buildTagObjects = (ref) => {
  // array compositon is splitted in two just to count tags
  // probably there's a better way
  const tagsCreations = {}
  const urlTags = getTags()

  let tagsCreationsArray = ref.map(e => e.token_info.tags).flat()
  tagsCreationsArray = tagsCreationsArray.filter(filterUnique)
    .map((name) => {
      const countTotal = (total, current) => {
        return current === name ? total + 1 : total
      };

      return {
        name: name,
        count: tagsCreationsArray.reduce(countTotal, 0),
        // if exists query for tags in url use the query to determine the active state
        active: existsTags() ? urlTags.indexOf(name) >= 0 : true,
      }
    })
    .sort(sortByCount)
    .forEach((tag) => tagsCreations[tag.name] = tag)

  return tagsCreations
}
