import React, { useState, useEffect } from 'react'
import { Table, Tag } from 'antd'
import { groupbuyApi } from '../../api/groupbuy'

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
      const res = await groupbuyApi.getOrders({
        page: pagination.current,
        pageSize: pagination.pageSize
      })
      setDataSource(res.data?.list || [])
      setPagination(prev => ({ ...prev, total: res.data?.total || 0 }))
    } catch (error) {
      message.error('加载失败')
    } finally {
      setLoading(false)
    }
  }

  const statusMap = {
    pending: { text: '待支付', color: 'orange' },
    paid: { text: '已支付', color: 'green' },
    cancelled: { text: '已取消', color: 'default' },
    completed: { text: '已完成', color: 'blue' }
  }

  const columns = [
    { title: '订单号', dataIndex: 'id', width: 100 },
    { title: '商品', dataIndex: 'product_name' },
    { title: '数量', dataIndex: 'quantity', width: 80 },
    { title: '金额', dataIndex: 'total_amount', render: (v) => `¥${v}` },
    { title: '收货地址', dataIndex: 'address' },
    {
      title: '状态',
      dataIndex: 'status',
      render: (status) => {
        const { text, color } = statusMap[status] || {}
        return <Tag color={color}>{text}</Tag>
      }
    },
    { title: '下单时间', dataIndex: 'created_at' }
  ]

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">订单管理</h1>
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
