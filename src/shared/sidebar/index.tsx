import Link from "next/link"
import type React from "react"

interface SidebarProps {
  className?: string
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  return (
    <aside className={`bg-gray-100 w-64 p-4 ${className || ""}`}>
      <h2 className="text-lg font-semibold mb-4">Sidebar</h2>
      <nav>
        <ul>
          <li className="mb-2">
            <Link href="#" className="hover:text-blue-500">
              Dashboard
            </Link>
          </li>
          <li className="mb-2">
            <Link href="#" className="hover:text-blue-500">
              Products
            </Link>
          </li>
          <li className="mb-2">
            <Link href="#" className="hover:text-blue-500">
              Customers
            </Link>
          </li>
          <li className="mb-2">
            <Link href="#" className="hover:text-blue-500">
              Orders
            </Link>
          </li>
          <li>
            <Link href="#" className="hover:text-blue-500">
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
