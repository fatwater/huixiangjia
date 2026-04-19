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
      // 获取第一个租户的会议室列表
      const res = await request.get('/property/meeting-rooms', { params: { tenant_id: 1 } })
      setDataSource(Array.isArray(res) ? res : res.data || [])
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
    form.setFieldsValue({
      ...record,
      facilities: record.facilities ? record.facilities.split(',') : []
    })
    setModalVisible(true)
  }

  const handleSubmit = async () => {
    const values = await form.validateFields()
    const data = {
      ...values,
      tenant_id: 1,
      facilities: Array.isArray(values.facilities) ? values.facilities.join(',') : values.facilities
    }

    try {
      if (editingRecord) {
        await request.put(`/property/meeting-rooms/${editingRecord.id}`, data)
      } else {
        await request.post('/property/meeting-rooms', data)
      }
      message.success('保存成功')
      setModalVisible(false)
      loadData()
    } catch (error) {
      message.error('保存失败')
    }
  }

  const handleDelete = async (id) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该会议室吗？',
      onOk: async () => {
        try {
          await request.delete(`/property/meeting-rooms/${id}`)
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
    { title: '会议室名称', dataIndex: 'name' },
    { title: '位置', dataIndex: 'location' },
    { title: '容纳人数', dataIndex: 'capacity', width: 100 },
    {
      title: '设施',
      dataIndex: 'facilities',
      width: 200,
      render: (v) => v ? v.split(',').map((f, i) => <Tag key={i}>{f}</Tag>) : '-'
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (status) => (
        <Tag color={status === 1 ? 'green' : 'red'}>
          {status === 1 ? '可用' : '不可用'}
        </Tag>
      )
    },
    {
      title: '操作',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleEdit(record)}>编辑</Button>
          <Button type="link" size="small" danger onClick={() => handleDelete(record.id)}>删除</Button>
        </Space>
      )
    }
  ]

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>会议室管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增会议室
        </Button>
      </div>
      <Table columns={columns} dataSource={dataSource} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />

      <Modal
        title={editingRecord ? '编辑会议室' : '新增会议室'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        okText="保存"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item label="会议室名称" name="name" rules={[{ required: true, message: '请输入会议室名称' }]}>
            <Input placeholder="如：一号会议室" />
          </Form.Item>
          <Form.Item label="位置" name="location" rules={[{ required: true, message: '请输入位置' }]}>
            <Input placeholder="如：A栋 3层 301" />
          </Form.Item>
          <Form.Item label="容纳人数" name="capacity" rules={[{ required: true, message: '请输入容纳人数' }]}>
            <InputNumber min={1} max={100} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="设施" name="facilities">
            <Select mode="tags" placeholder="输入后按回车添加，如：投影仪、白板" />
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
