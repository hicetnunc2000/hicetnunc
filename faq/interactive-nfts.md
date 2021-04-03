# Interactive NFT Guide

## About

Hit et nunc enables you to publish web-based interactive and generative artworks by uploading a zip archive. If you're starting on a new project, have a look at our starter [templates](https://github.com/hicetnunc2000/hicetnunc/tree/main/templates). The following guide walks you through the process of minting your first interactive NFT.

## Getting Started

Whether you're starting fresh or have an existing artwork, there are some important guidelines you'll need to follow in order to successfully mint:

### Folder Structure

Put all your project files into a single folder if they are not already in one. The main file in your project needs to be called `index.html`.

### Cover Image

Your work is required to have a cover image. This can be any image inside your project folder. In the `<head>` tag of your `index.html` file, add the following meta tag, replacing the value of the `property` attribute with the relative path to your cover image:

```html
<meta property="og:image" content="path/to/your/cover.jpg" />
```

The cover image can be a JPEG, PNG, or GIF.

### Resources

You will need to include all libraries, scripts, styles, and other assets referenced in your code inside your project folder. References to most external resources will  be blocked. While there are some exceptions to this, it's generally best practice to bundle everything and avoid external dependencies. More information about whitelisted external resources is coming soon.

### User Data

Your project will be displayed within a sandboxed iframe, meaning it won't have access to any user data from the [hicetnunc.xyz](http://hicetnunc.xyz) site. However, the viewer and creator addresses are passed into the iframe via URL query parameters:

```
?viewer={VIEWER_ADDRESS}&creator={CREATOR_ADDRESS}
```

You can parse these query parameters in javascript and use them in your project as you wish:

```jsx
const creator = new URLSearchParams(window.location.search).get('creator')
const viewer = new URLSearchParams(window.location.search).get('viewer')
```

### Minting

- Once your project folder is ready to be minted, go ahead and compress it into a zip file.
- Head to [https://hicetnunc.xyz/mint](https://hicetnunc.xyz/mint), fill out the information for your work, and upload your zip file.
- You should now see a preview of your work embedded on the page. Make sure to test it thoroughly to make sure it works as expected.
- If everything looks good, make sure your wallet is synced and press the "mint" button at the bottom of the page.
- Congratulations! You have just minted your first interactive NFT 🎉

## Known Issues

- If you are using Brave and notice the HTML preview not working on the mint page, you will need to disable your shields for this site, or reconfigure them to allow service workers.

## Help

If you find a bug, please open an issue on [Github](https://github.com/hicetnunc2000/hicetnunc/issues). Otherwise, seek help on [Discord](https://discord.com/invite/jKNy6PynPK).