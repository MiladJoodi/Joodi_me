---
sidebar_position: 3
---

# Button

Usage:
```tsx
    <Button
            style={{padding: "2px 6px"}}
            variant="primary"
            onClick={()=>alert("hello")}
            >
                Add to Cart
    </Button>
```


Create a file at `components/Button.tsx`:

```tsx
import React, { ComponentProps } from 'react'
type TVariant = "primary" | "secondary" | "danger" | "warning" | "success"

type TButton = ComponentProps<"button"> & {
    variant?: TVariant
}

function Button({children, variant, style, ...rest}: TButton) {

  return (
    <button {...rest} style={{...style, ...checkVariant(variant)}}>
        {children}
    </button>
  )
}

export default Button;

function checkVariant(variant?:TVariant){
  if(variant === "primary"){
    return {backgroundColor: "blue", color: "white"};
  } else if(variant === "secondary"){
    return {backgroundColor: "gray", color: "black"};
  } 
  else if(variant === "danger"){
    return {backgroundColor: "gray", color: "black"}
  }
  else if(variant === "success"){
    return {backgroundColor: "gray", color: "black"}
  }
  else if(variant === "warning"){
    return {backgroundColor: "yellow", color: "white"}
  }
}
```
