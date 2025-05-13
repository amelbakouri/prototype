'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'

export default function LayoutWithNavbar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideNavbar = ['/login', '/register', '/dashboard'].includes(pathname)

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  )
}
