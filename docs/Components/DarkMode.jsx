---
sidebar_position: 3
---

# Dark Mode

![title](https://s32.picofile.com/file/8478474742/pk.png)


Create a file at `components/DarkMode.jsx`:

```jsx
"use client";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocalStorage } from "react-use";

const DarkMode = () => {
  const [dark, setDark] = useState(false);
  const [value, setValue, remove] = useLocalStorage("dark-mode", false);

  useEffect(() => {
    if (value) {
      setDark(value);
    }
  }, [value]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const root = window.document.documentElement;
      if (dark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
    setValue(dark);
  }, [dark]);

  return (
    <div className="cursor-pointer" onClick={() => setDark(!dark)}>
      {dark ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}
    </div>
  );
};

export default DarkMode;

```
