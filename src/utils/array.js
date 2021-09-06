
// Fisher Yates Array Shuffle:
// https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export {shuffle}