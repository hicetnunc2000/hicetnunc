# HTML Template

All HTML content needs to be minted in a zip file. You can have multiple files inside your zip, however there are a few requirements you can't miss.

1. The HTML file can only be called index.html
2. The file should have a thumbnail image to be displayed until the user clicks to interact on your OBJKT. The image can be png, jpg or a gif. you just need to update the <metadata> reference inside the HTML file.
3. At the moment calls to external sites are being blocked, even if they seem to work locally when you are testing. So any dependency needs to be included locally in the zip.

Regardless of what content you want to display (three.js, pixi.js, canvas, p5.js, shaders etc), it should always be full width and full height (window.innerWidth and window.innerHeight) so please dont forget to include your own resize function.

## Customisation

If you want to create OBJKT's with different seeds, you can access the creator and viewer wallet ids. This values will only be injected once the piece has been minted
they will not work locally.
if the user is not sync, the viewer comes in as false

```javascript
const creator = new URLSearchParams(window.location.search).get('creator')
// if the viewer is not authenticated to a wallet, this value will be false
const viewer = new URLSearchParams(window.location.search).get('viewer')
```

Hope you guys enjoy!
Hicetnunc team
