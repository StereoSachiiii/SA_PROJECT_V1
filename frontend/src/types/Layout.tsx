import { Outlet } from 'react-router-dom'
import Navbar from '../Components/Navbar'

export default function Layout() {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  )
}