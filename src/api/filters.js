export const FilterToken = (items) => {
  return items.filter((e) => {
    return (
      e.token_id !== 1130 ||
      e.token_id !== 1131 ||
      e.token_id !== 1417 ||
      e.token_id !== 1418 ||
      e.token_id !== 1419 ||
      e.token_id !== 641 ||
      e.token_id !== 1547
    )
  })
}
