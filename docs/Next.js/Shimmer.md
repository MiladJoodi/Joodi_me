---
sidebar_position: 3
---

# Shimmer

How to create a image shimmer effect on Next.js?

![title](https://s30.picofile.com/file/8474195000/shimer.jpg)

Create a file at `src/utils/shimmer.ts`:

```tsx
export const shimmer=(w:number,h:number)=>`
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f6f7f8" offset="0%" />
      <stop stop-color="#edeef1" offset="20%" />
      <stop stop-color="#f6f7f8" offset="40%" />
      <stop stop-color="#f6f7f8" offset="100%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f6f7f8" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;


export const toBase64=(str:string)=>typeof window==="undefined"?Buffer.from(str).toString("base64"):window.btoa(str)

```




Set placeholder at Image:
```
<Image
        src={item?.image || "/placeholder.png"}
        placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
        width={390}
        height={480}
        alt="Picture of the author"
        className="w-[350px] h-[450px]"
        style={{
            maxWidth: "100%",
            height: "auto",
          }}
      />
```

don't forget import toBase64 and shimmer in Image component
like this: 

```jsx
import { shimmer, toBase64 } from "@/utils/shimmer";
```



