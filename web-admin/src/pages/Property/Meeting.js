import React, { useState, useEffect } from 'react'
import { Table, Button, Space, Tag, message, Modal, Form, Input, InputNumber, Select } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import request from '../../api'

function PropertyMeeting() {
  const [loading, setLoading] = useState(false)
  const [dataSource, setDataSource] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [editingRecord, setEditingRecord] = useState(null)
  const [form] = Form.useForm()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await request.get('/property/meeting-rooms')
      setDataSource(res.data?.list || [])
    } catch (error) {
      message.error('加载失败')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setEditingRecord(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = (record) => {
    setEditingRecord(record)
    form.setFieldsValue(record)
    setModalVisible(true)
  }

  const handleSubmit = async () => {
    const values = await form.validateFields()
    try {
      if (editingRecord) {
        await request.put(`/property/meeting-rooms/${editingRecord.id}`, values)
      } else {
        await request.post('/property/meeting-rooms', values)
      }
      message.success('保存成功')
      setModalVisible(false)
      loadData()
    } catch (error) {
      message.error('保存失败')
    }
  }

  const handleDelete = async (id) => {
    try {
      await request.delete(`/property/meeting-rooms/${id}`)
      message.success('删除成功')
      loadData()
    } catch (error) {
      message.error('删除失败')
    }
  }

  const columns = [
    { title: '会议室名称', dataIndex: 'name' },
    { title: '楼层', dataIndex: 'floor' },
    { title: '容纳人数', dataIndex: 'capacity' },
    { title: '设施', dataIndex: 'facilities', render: (v) => v?.join(', ') },
    {
      title: '状态',
      dataIndex: 'status',
      render: (status) => (
        <Tag color={status === 1 ? 'green' : 'red'}>
          {status === 1 ? '可用' : '不可用'}
        </Tag>
      )
    },
    {
      title: '操作',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>编辑</Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>删除</Button>
        </Space>
      )
    }
  ]

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">会议室管理</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增会议室
        </Button>
      </div>
      <Table columns={columns} dataSource={dataSource} rowKey="id" loading={loading} />

      <Modal
        title={editingRecord ? '编辑会议室' : '新增会议室'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="会议室名称" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="楼层" name="floor" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="容纳人数" name="capacity" rules={[{ required: true }]}>
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item label="设施" name="facilities">
            <Select mode="tags" placeholder="选择或输入设施" />
          </Form.Item>
          <Form.Item label="状态" name="status" initialValue={1}>
            <Select>
              <Select.Option value={1}>可用</Select.Option>
              <Select.Option value={0}>不可用</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default PropertyMeeting
