---
sidebar_position: 3
---

# Sidebar


Hamburger Sidebar
Create a file at `components/Sidebar.tsx`:

```tsx
"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Home, FileText, Mail, Settings, Menu, X } from "lucide-react"
import Link from "next/link"

const menuItems = [
  { id: 1, label: "Home", icon: Home, link: "/" },
  { id: 2, label: "Documents", icon: FileText, link: "/documents" },
  { id: 3, label: "Messages", icon: Mail, link: "/messages" },
  { id: 4, label: "Settings", icon: Settings, link: "/settings" },
]

export default function AdvancedSidebar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => setIsOpen(!isOpen)

  const sidebarVariants = {
    open: {
      width: "240px",
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    closed: {
      width: "80px",
      transition: { duration: 0.3, ease: "easeInOut" }
    }
  }

  const textVariants = {
    open: {
      opacity: 1,
      x: 0,
      display: "inline-flex",
      transition: { delay: 0.1, duration: 0.2 }
    },
    closed: {
      opacity: 0,
      x: -10,
      transitionEnd: { display: "none" },
      transition: { duration: 0.2 }
    }
  }

  return (
    <motion.nav
      className="fixed top-0 left-0 h-screen bg-gray-800 text-white z-50"
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      variants={sidebarVariants}
    >
      <div className="flex flex-col h-full">
        <button
          onClick={toggleSidebar}
          className="p-4 self-end focus:outline-none"
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={isOpen ? "open" : "closed"}
              initial={{ opacity: 0, rotate: -180 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 180 }}
              transition={{ duration: 0.2 }}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.div>
          </AnimatePresence>
        </button>
        <ul className="flex-1 pt-4">
          {menuItems.map((item) => (
            <li key={item.id} className="mb-4">
              <Link href={item.link} className="flex items-center px-4 py-2 hover:bg-gray-700 rounded-lg transition-colors duration-200">
                <item.icon size={24} />
                <motion.span
                  className="ml-4 whitespace-nowrap"
                  variants={textVariants}
                >
                  {item.label}
                </motion.span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </motion.nav>
  )
}
```
