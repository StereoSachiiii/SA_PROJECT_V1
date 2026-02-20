import { Outlet } from 'react-router-dom'
import Navbar from '../Components/Navbar'

export default function EmployeeLayout() {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  )
}