```js
// import 3 different sizes of the image and create a srcset from them
import srcsetAvif from '../example.jpg?w=500;700;900;1200&avif&srcset'
// do it a second time, but now as webp since safari can't display avif
import srcsetWebp from '../example.jpg?w=500;700;900;1200&webp&srcset'
// create a small placeholder and import its metadata
import { src as placeholder, width, height } from '../example.jpg?width=300&metadata'

document.querySelector('#app').innerHTML = `
  <h1>Hello Imagetools!</h1>
  <a href="https://github.com/JonasKruckenberg/imagetools/tree/main/docs" target="_blank">Documentation</a>
  
  <!-- Now we can use our images -->
  <picture>
    <source scrset="${srcsetAvif}" type="image/avif"/>
    <source srcset="${srcsetWebp}" type="image/webp"/>
    <img 
        src="${placeholder}"
        width="${width}" 
        height="${height}"
        alt="Women Lying Near to a Multicolored Glass Window Close-up Photography"/>
  </picture>
`
```
