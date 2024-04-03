---
sidebar_position: 3
---

# Sleep Function

you can use this cool manual js sleep function:


and  before the fetch, you can call it like:

await sleep(5000)


<!--Create a file at `utils/connectToDb.jsx`:-->

```tsx
const sleep = ms => new Promise(r => setTimeout(r, ms));
```
and then before the fetch, you can call it like:
```tsx
await sleep(5000)
```

![title](https://s30.picofile.com/file/8474045984/Snap.png)


