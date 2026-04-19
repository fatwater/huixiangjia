import React, { useState, useEffect } from 'react'
import { Table, Button, Space, Tag, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { PlusOutlined } from '@ant-design/icons'
import { tenantApi } from '../../api/tenant'

function TenantList() {
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
      const res = await tenantApi.list({
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
      await tenantApi.delete(id)
      message.success('删除成功')
      loadData()
    } catch (error) {
      message.error('删除失败')
    }
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: '租户名称', dataIndex: 'name' },
    { title: '企业微信 CorpID', dataIndex: 'corp_id' },
    {
      title: '状态',
      dataIndex: 'status',
      render: (status) => (
        <Tag color={status === 1 ? 'green' : 'red'}>
          {status === 1 ? '启用' : '禁用'}
        </Tag>
      )
    },
    { title: '创建时间', dataIndex: 'created_at' },
    {
      title: '操作',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => navigate(`/tenant/${record.id}`)}>
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
        <h1 className="page-title">租户管理</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/tenant/add')}>
          新增租户
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

export default TenantList
