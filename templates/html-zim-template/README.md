
Welcome to the ZIM NFT template for hic et nunc. 

ZIM is a JavaScript Canvas Framework at https://zimjs.com
Information about ZIM and interactive NFTs can be found at https://zimjs.com/nft

We have found that the FIT scaling mode works just fine for NFTs on hic et nunc.
The FULL works as well but then apply frame.on("scale", ()=>{}) for scaling.
All things in ZIM seem to work fine - make sure assets and script calls are local.
These can be put in folders inside the ZIP file if desired, i.e. assets/ and scripts/.
Links out via zgo(), async(), Ajax() or bind() will not work but fail silently. 

Dr Abstract
https://www.hicetnunc.xyz/DrAbstract/creations

-----------

Information for the templates in general:

All HTML content needs to be minted in a zip file. You can have multiple files inside your zip, however there are a few requirements you can't miss.

The HTML file can only be called index.html
The file should have a thumbnail image to be displayed until the user clicks to interact on your OBJKT. The image can be png, jpg or a gif. you just need to update the reference inside the HTML file.
At the moment calls to external sites are being blocked, even if they seem to work locally when you are testing. So any dependency needs to be included locally in the zip.
Regardless of what content you want to display (three.js, pixi.js, canvas, p5.js, shaders etc), it should always be full width and full height (window.innerWidth and window.innerHeight) so please dont forget to include your own resize function.

Customisation
If you want to create OBJKT's with different seeds, you can access the creator and viewer wallet ids. This values will only be injected once the piece has been minted they will not work locally. if the user is not sync, the viewer comes in as false

const creator = new URLSearchParams(window.location.search).get('creator')
// if the viewer is not authenticated to a wallet, this value will be false
const viewer = new URLSearchParams(window.location.search).get('viewer')
Hope you guys enjoy! Hicetnunc team