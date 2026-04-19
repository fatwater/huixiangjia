import React, { useState, useEffect } from 'react'
import { Table, Tag, message, Button, Space } from 'antd'
import request from '../../api'

function GroupbuyOrder() {
  const [loading, setLoading] = useState(false)
  const [dataSource, setDataSource] = useState([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })

  useEffect(() => {
    loadData()
  }, [pagination.current, pagination.pageSize])

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await request.get('/groupbuy/orders', {
        params: {
          tenant_id: 1,
          page: pagination.current,
          pageSize: pagination.pageSize
        }
      })
      setDataSource(Array.isArray(res) ? res : res.list || res.data?.list || [])
      setPagination(prev => ({ ...prev, total: res.total || 0 }))
    } catch (error) {
      message.error('加载失败')
    } finally {
      setLoading(false)
    }
  }

  const statusMap = {
    0: { text: '已取消', color: 'default' },
    1: { text: '待支付', color: 'orange' },
    2: { text: '待提货', color: 'blue' },
    3: { text: '已完成', color: 'green' }
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    {
      title: '订单号',
      dataIndex: 'orderNo',
      width: 180,
      render: (no) => <code style={{ fontSize: 12 }}>{no}</code>
    },
    {
      title: '商品',
      render: (_, record) => (
        record.product ? record.product.title : '-'
      )
    },
    { title: '数量', dataIndex: 'quantity', width: 70 },
    {
      title: '金额',
      dataIndex: 'totalAmount',
      width: 90,
      render: (v) => <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>¥{v}</span>
    },
    {
      title: '提货码',
      dataIndex: 'pickupCode',
      width: 100,
      render: (code) => code ? <Tag color="cyan">{code}</Tag> : '-'
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (status) => {
        const item = statusMap[status] || { text: '未知', color: 'default' }
        return <Tag color={item.color}>{item.text}</Tag>
      }
    },
    {
      title: '下单时间',
      dataIndex: 'createdAt',
      width: 160,
      render: (time) => time ? new Date(time).toLocaleString('zh-CN') : '-'
    }
  ]

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h2>团购订单管理</h2>
      </div>
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        loading={loading}
        pagination={{
          ...pagination,
          onChange: (current, pageSize) => setPagination(prev => ({ ...prev, current, pageSize }))
        }}
      />
    </div>
  )
}

export default GroupbuyOrder
