import './App.css'
import {Routes,Route} from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import axios from 'axios'
import {Toaster} from 'react-hot-toast'
import { UserContextProvider } from '../context/userContext'
// import Dashboard from './pages/Dashboard'
import UserDashboard from './pages/UserDashboard'
import ServiceProviderDashboard from './pages/ServiceProviderDashboard'

axios.defaults.baseURL = 'http://localhost:8000'
axios.defaults.withCredentials = true
function App(){
  return (
    <UserContextProvider>
      <Navbar />
      <Toaster position='bottom-right' toastOptions={{duration:2000}}/>
      <Routes>
        <Route path= '/' element={<Home/>} />
        <Route path= '/register' element={<Register/>} />
        <Route path= '/login' element={<Login/>} />
        {/* <Route path= '/' element={<Login/>} /> */}
        {/* <Route path ='/dashboard' element={<Dashboard/>} /> */}
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/service-provider-dashboard" element={<ServiceProviderDashboard />} />
      </Routes>
    </UserContextProvider>
  )
}

export default App