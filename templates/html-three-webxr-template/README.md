# HTML Three.js WebXR Template

This template is very similar to the ThreeJS template, with the minimal modifications to enable a ThreeJS-powered VR scene. 

To learn more about how to create immersive WebXR content with ThreeJS, see [How To Create VR Content](https://threejs.org/docs/#manual/en/introduction/How-to-create-VR-content)

All HTML content needs to be minted in a zip file. You can have multiple files inside your zip, however there are a few requirements you can't miss.

1. The HTML file can only be called index.html
2. The file should have a thumbnail image to be displayed until the user clicks to interact on your NFT. The image can be png, jpg or a gif. you just need to update the <metadata> reference inside the HTML file.
3. At the moment calls to external sites are being blocked, even if they seem to work locally when you are testing. So any dependency needs to be included locally in the zip.

Regardless of what content you want to display (three.js, pixi.js, canvas, p5.js, shaders etc), it should always be full width and full height (window.innerWidth and window.innerHeight) so please dont forget to include your own resize function.

Hope you guys enjoy!
Hicetnunc team
