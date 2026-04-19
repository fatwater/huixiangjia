import React, { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu, Avatar, Dropdown } from 'antd'
import {
  DashboardOutlined,
  ApartmentOutlined,
  TeamOutlined,
  HomeOutlined,
  ShopOutlined,
  ShoppingOutlined,
  LockOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons'
import { useAuth } from '../../hooks/useAuth'
import './Layout.css'

const { Header, Sider, Content } = Layout

function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuth()

  const menuItems = [
    { key: '/dashboard', icon: <DashboardOutlined />, label: '数据概览' },
    { key: '/tenant', icon: <ApartmentOutlined />, label: '租户管理' },
    { key: '/employee', icon: <TeamOutlined />, label: '员工管理' },
    { key: '/property/meeting', icon: <HomeOutlined />, label: '物业配置' },
    { key: '/merchant', icon: <ShopOutlined />, label: '商家管理' },
    { key: '/groupbuy/product', icon: <ShoppingOutlined />, label: '团购管理' },
    { key: '/access/device', icon: <LockOutlined />, label: '门禁配置' }
  ]

  const userMenuItems = [
    { key: 'logout', label: '退出登录' }
  ]

  const handleMenuClick = ({ key }) => {
    navigate(key)
  }

  const handleUserMenuClick = ({ key }) => {
    if (key === 'logout') {
      logout()
    }
  }

  return (
    <Layout className="app-layout">
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo">
          {collapsed ? '会想家' : '会想家管理后台'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header className="header">
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: () => setCollapsed(!collapsed)
          })}
          <div className="header-right">
            <Dropdown menu={{ items: userMenuItems, onClick: handleUserMenuClick }}>
              <Avatar style={{ backgroundColor: '#1890ff', cursor: 'pointer' }}>
                管
              </Avatar>
            </Dropdown>
          </div>
        </Header>
        <Content className="content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default AppLayout
