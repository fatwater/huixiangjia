import React, { useState, useEffect } from 'react'
import { Table, Button, Space, Tag, message, Modal, Form, Input, Select } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { accessApi } from '../../api/access'

function AccessDevice() {
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
      const res = await accessApi.getDevices()
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
        await accessApi.updateDevice(editingRecord.id, values)
      } else {
        await accessApi.createDevice(values)
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
      await accessApi.deleteDevice(id)
      message.success('删除成功')
      loadData()
    } catch (error) {
      message.error('删除失败')
    }
  }

  const columns = [
    { title: '设备名称', dataIndex: 'name' },
    { title: '设备编号', dataIndex: 'device_no' },
    { title: '位置', dataIndex: 'location' },
    { title: '设备类型', dataIndex: 'type' },
    {
      title: '状态',
      dataIndex: 'status',
      render: (status) => (
        <Tag color={status === 1 ? 'green' : 'red'}>
          {status === 1 ? '在线' : '离线'}
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
        <h1 className="page-title">设备管理</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增设备
        </Button>
      </div>
      <Table columns={columns} dataSource={dataSource} rowKey="id" loading={loading} />

      <Modal
        title={editingRecord ? '编辑设备' : '新增设备'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="设备名称" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="设备编号" name="device_no" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="位置" name="location">
            <Input />
          </Form.Item>
          <Form.Item label="设备类型" name="type" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="door">门禁</Select.Option>
              <Select.Option value="gate">闸机</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="状态" name="status" initialValue={1}>
            <Select>
              <Select.Option value={1}>在线</Select.Option>
              <Select.Option value={0}>离线</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default AccessDevice
