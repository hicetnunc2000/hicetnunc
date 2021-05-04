export function toHHMMSS(sec) {
  var hours = Math.floor(sec / 3600)
  var minutes = Math.floor((sec - hours * 3600) / 60)
  var seconds = sec - hours * 3600 - minutes * 60

  if (hours < 10) {
    hours = '0' + hours
  }
  if (minutes < 10) {
    minutes = '0' + minutes
  }
  if (seconds < 10) {
    seconds = '0' + seconds
  }
  return hours + ':' + minutes + ':' + seconds
}
