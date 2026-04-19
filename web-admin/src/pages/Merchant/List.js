import React, { useState, useEffect } from 'react'
import { Table, Button, Space, Tag, message, Modal, Input, Select } from 'antd'
import { useNavigate } from 'react-router-dom'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import request from '../../api'

function MerchantList() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [dataSource, setDataSource] = useState([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [searchKeyword, setSearchKeyword] = useState('')

  useEffect(() => {
    loadData()
  }, [pagination.current, pagination.pageSize])

  const loadData = async () => {
    setLoading(true)
    try {
      const params = {
        tenant_id: 1,
        page: pagination.current,
        pageSize: pagination.pageSize
      }
      if (searchKeyword) {
        params.keyword = searchKeyword
      }
      const res = await request.get('/merchants', { params })
      setDataSource(Array.isArray(res) ? res : res.list || res.data?.list || [])
      setPagination(prev => ({ ...prev, total: res.total || 0 }))
    } catch (error) {
      message.error('加载失败')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, current: 1 }))
    loadData()
  }

  const handleDelete = async (id) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该商家吗？',
      onOk: async () => {
        try {
          await request.delete(`/merchants/${id}`)
          message.success('删除成功')
          loadData()
        } catch (error) {
          message.error('删除失败')
        }
      }
    })
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    {
      title: '商家名称',
      dataIndex: 'name',
      render: (name, record) => (
        <Space>
          {record.coverImage && (
            <img src={record.coverImage} alt="" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} />
          )}
          <span>{name}</span>
        </Space>
      )
    },
    { title: '分类', dataIndex: 'category', width: 100 },
    { title: '地址', dataIndex: 'address', ellipsis: true },
    { title: '联系电话', dataIndex: 'phone', width: 120 },
    {
      title: '评分',
      dataIndex: 'avgRating',
      width: 80,
      render: (v) => v ? `${v}分` : '-'
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (status) => (
        <Tag color={status === 1 ? 'green' : 'red'}>
          {status === 1 ? '上架' : '下架'}
        </Tag>
      )
    },
    {
      title: '操作',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => navigate(`/merchant/add?id=${record.id}`)}>
            编辑
          </Button>
          <Button type="link" size="small" danger onClick={() => handleDelete(record.id)}>
            删除
          </Button>
        </Space>
      )
    }
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>商家管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/merchant/add')}>
          新增商家
        </Button>
      </div>

      <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
        <Input
          placeholder="搜索商家名称"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onPressEnter={handleSearch}
          style={{ width: 200 }}
          prefix={<SearchOutlined />}
        />
        <Button onClick={handleSearch}>搜索</Button>
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
