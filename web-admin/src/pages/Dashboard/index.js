import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Statistic } from 'antd'
import {
  TeamOutlined,
  HomeOutlined,
  ShopOutlined,
  ShoppingOutlined
} from '@ant-design/icons'
import request from '../../api'

function Dashboard() {
  const [stats, setStats] = useState({
    tenantCount: 0,
    employeeCount: 0,
    bookingCount: 0,
    orderCount: 0
  })

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const res = await request.get('/dashboard/stats')
      setStats(res.data || {
        tenantCount: 0,
        employeeCount: 0,
        bookingCount: 0,
        orderCount: 0
      })
    } catch (error) {
      console.error('加载统计数据失败', error)
    }
  }

  const cards = [
    {
      title: '租户数量',
      value: stats.tenantCount,
      icon: <TeamOutlined />,
      color: '#1890ff'
    },
    {
      title: '员工数量',
      value: stats.employeeCount,
      icon: <HomeOutlined />,
      color: '#52c41a'
    },
    {
      title: '预约数量',
      value: stats.bookingCount,
      icon: <ShopOutlined />,
      color: '#faad14'
    },
    {
      title: '订单数量',
      value: stats.orderCount,
      icon: <ShoppingOutlined />,
      color: '#722ed1'
    }
  ]

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">数据概览</h1>
      </div>
      <Row gutter={16}>
        {cards.map((card, index) => (
          <Col span={6} key={index}>
            <Card>
              <Statistic
                title={card.title}
                value={card.value}
                prefix={<span style={{ color: card.color }}>{card.icon}</span>}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default Dashboard
