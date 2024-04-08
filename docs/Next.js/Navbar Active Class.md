---
sidebar_position: 3
---

# Navbar active class

Don't forget "use client"


![title](https://s30.picofile.com/file/8474190300/ac.jpg)

Create a file at `_components/Header.tsx`:

```tsx
import Image from "next/image";
import Link from "next/link";
import Navlink from "./Navlink";

const headerLinks = [
  {
    title: "Home",
    url: "/"
  },
  {
    title: "About",
    url: "/about"
  },
  {
    title: "Works",
    url: "/works"
  },
  {
    title: "Contact",
    url: "/contact"
  },
]

const Header = () => {

  return (
    <div className="bg-red-100 container mx-auto py-3 sm:py-4 px-4 sm:px-6 lg:px-32 flex flex-col sm:flex-row justify-between items-center gap-2">
      {/* logo */}
      <div>
        <Image
          src="/logo.svg"
          width={300}
          height={200}
          alt="Picture of the author"
          className="w-[155px] h-[50px]"
        />
      </div>

      {/*  */}
      <div className="flex gap-3 md:gap-6 text-lg">
        {headerLinks.map((link)=>(
          <Navlink item={link} key={link.title}  />
        ))}
      </div>
    </div>
  );
};

export default Header;

```


Create : `Navlink.tsx`
```tsx
"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavlinkProps = {
    title: string,
    url: string
}

const Navlink = ({item}:{ item: NavlinkProps }) => {

    const pathname = usePathname();
    console.log(pathname)

    return (
        <Link href={item.url} className={`p-4 ${pathname === item.url && 'text-liver-color'}`}>{item.title}</Link>
    );
}

export default Navlink;
```



