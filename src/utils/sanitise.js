/**
 * If a OBJKT is missing a relevant property, we filter it out.
 * As example http://localhost:3000/objkt/2862 (has no token_info)
 */
export const SanitiseOBJKT = (objkt) => {
  return objkt.filter((o) => {
    if (!o.token_info) {
      console.warn('objkt flagged as corrupt', o.token_id)
      return false
    }
    return true
  })
}
