import React, { useState, useEffect } from 'react'
import { Table, Button, Space, Tag, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { PlusOutlined } from '@ant-design/icons'
import { merchantApi } from '../../api/merchant'

function MerchantList() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [dataSource, setDataSource] = useState([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })

  useEffect(() => {
    loadData()
  }, [pagination.current, pagination.pageSize])

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await merchantApi.list({
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

  const handleDelete = async (id) => {
    try {
      await merchantApi.delete(id)
      message.success('删除成功')
      loadData()
    } catch (error) {
      message.error('删除失败')
    }
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: '商家名称', dataIndex: 'name' },
    { title: '分类', dataIndex: 'category' },
    { title: '地址', dataIndex: 'address' },
    { title: '联系电话', dataIndex: 'phone' },
    {
      title: '状态',
      dataIndex: 'status',
      render: (status) => (
        <Tag color={status === 1 ? 'green' : 'red'}>
          {status === 1 ? '启用' : '禁用'}
        </Tag>
      )
    },
    {
      title: '操作',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => navigate(`/merchant/add?id=${record.id}`)}>
            编辑
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            删除
          </Button>
        </Space>
      )
    }
  ]

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">商家管理</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/merchant/add')}>
          新增商家
        </Button>
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

export default MerchantList
