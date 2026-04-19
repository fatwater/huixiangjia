import React, { useState, useEffect } from 'react'
import { Table, Button, Space, Tag, message, Modal, Upload } from 'antd'
import { PlusOutlined, UploadOutlined } from '@ant-design/icons'
import { userApi } from '../../api/user'

function EmployeeList() {
  const [loading, setLoading] = useState(false)
  const [dataSource, setDataSource] = useState([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })

  useEffect(() => {
    loadData()
  }, [pagination.current, pagination.pageSize])

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await userApi.list({
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

  const handleImport = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    try {
      await userApi.import(formData)
      message.success('导入成功')
      loadData()
    } catch (error) {
      message.error('导入失败')
    }
    return false
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: '姓名', dataIndex: 'name' },
    { title: '手机号', dataIndex: 'phone' },
    { title: '企业微信ID', dataIndex: 'wx_userid' },
    {
      title: '角色',
      dataIndex: 'role',
      render: (role) => (
        <Tag color={role === 'admin' ? 'blue' : 'default'}>
          {role === 'admin' ? '管理员' : '员工'}
        </Tag>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (status) => (
        <Tag color={status === 1 ? 'green' : 'red'}>
          {status === 1 ? '启用' : '禁用'}
        </Tag>
      )
    },
    { title: '创建时间', dataIndex: 'created_at' }
  ]

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">员工管理</h1>
        <Space>
          <Upload beforeUpload={handleImport} showUploadList={false}>
            <Button icon={<UploadOutlined />}>批量导入</Button>
          </Upload>
          <Button type="primary" icon={<PlusOutlined />}>
            新增员工
          </Button>
        </Space>
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

export default EmployeeList
