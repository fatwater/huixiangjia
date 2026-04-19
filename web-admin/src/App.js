import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './pages/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import TenantList from './pages/Tenant/List'
import TenantDetail from './pages/Tenant/Detail'
import EmployeeList from './pages/Employee/List'
import PropertyMeeting from './pages/Property/Meeting'
import MerchantList from './pages/Merchant/List'
import MerchantAdd from './pages/Merchant/Add'
import GroupbuyProduct from './pages/Groupbuy/Product'
import GroupbuyOrder from './pages/Groupbuy/Order'
import AccessDevice from './pages/Access/Device'
import { useAuth } from './hooks/useAuth'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" />
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="tenant" element={<TenantList />} />
        <Route path="tenant/:id" element={<TenantDetail />} />
        <Route path="employee" element={<EmployeeList />} />
        <Route path="property/meeting" element={<PropertyMeeting />} />
        <Route path="merchant" element={<MerchantList />} />
        <Route path="merchant/add" element={<MerchantAdd />} />
        <Route path="groupbuy/product" element={<GroupbuyProduct />} />
        <Route path="groupbuy/order" element={<GroupbuyOrder />} />
        <Route path="access/device" element={<AccessDevice />} />
      </Route>
    </Routes>
  )
}

export default App
