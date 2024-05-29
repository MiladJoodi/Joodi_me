---
sidebar_position: 3
---

# Container


Create a file at `components/Container.tsx`:

```tsx
import React from 'react'

interface IContainer{
    children: React.ReactNode
}

function Container({children} : IContainer) {
  return (
    <div className='container mx-auto'>
        {children}
    </div>
  )
}

export default Container
```