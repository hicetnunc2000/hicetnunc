const creator = new URLSearchParams(window.location.search).get('creator')
const viewer = new URLSearchParams(window.location.search).get('viewer')
console.log('minted by', creator, 'viewer', viewer)
