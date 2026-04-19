import React, { useState, useEffect } from 'react'
import { Table, Button, Space, Tag, message, Modal, Form, Input, InputNumber, DatePicker } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import request from '../../api'

function GroupbuyProduct() {
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
      const res = await request.get('/groupbuy/products', { params: { tenant_id: 1, page: 1, pageSize: 100 } })
      setDataSource(Array.isArray(res) ? res : res.list || res.data?.list || [])
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
    const data = {
      ...values,
      tenant_id: 1
    }

    try {
      if (editingRecord) {
        await request.put(`/groupbuy/products/${editingRecord.id}`, data)
      } else {
        await request.post('/groupbuy/products', data)
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
      content: '确定要删除该商品吗？',
      onOk: async () => {
        try {
          await request.delete(`/groupbuy/products/${id}`)
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
      title: '商品',
      dataIndex: 'title',
      render: (title, record) => (
        <Space>
          {record.coverImage && (
            <img src={record.coverImage} alt="" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }} />
          )}
          <span>{title}</span>
        </Space>
      )
    },
    {
      title: '价格',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>¥{record.groupbuyPrice}</span>
          <span style={{ color: '#999', textDecoration: 'line-through', fontSize: 12 }}>¥{record.originalPrice}</span>
        </Space>
      )
    },
    { title: '库存', dataIndex: 'stock', width: 70 },
    { title: '已售', dataIndex: 'soldCount', width: 70 },
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
          <Button type="link" size="small" onClick={() => handleEdit(record)}>编辑</Button>
          <Button type="link" size="small" danger onClick={() => handleDelete(record.id)}>删除</Button>
        </Space>
      )
    }
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>团购商品管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增商品
        </Button>
      </div>
      <Table columns={columns} dataSource={dataSource} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />

      <Modal
        title={editingRecord ? '编辑商品' : '新增商品'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
        okText="保存"
        cancelText="取消"
      >
        <Form form={form} layout="vertical" initialValues={{ status: 1, stock: 100, soldCount: 0, minGroupSize: 2 }}>
          <Form.Item label="商品标题" name="title" rules={[{ required: true, message: '请输入商品标题' }]}>
            <Input placeholder="如：星巴克礼品卡 100元" />
          </Form.Item>

          <Form.Item label="封面图URL" name="coverImage">
            <Input placeholder="输入图片URL" />
          </Form.Item>

          <Form.Item label="商品详情" name="description">
            <Input.TextArea rows={3} placeholder="请输入商品详情" />
          </Form.Item>

          <Form.Item label="原价" name="originalPrice" rules={[{ required: true, message: '请输入原价' }]}>
            <InputNumber min={0} precision={2} style={{ width: '100%' }} placeholder="0.00" />
          </Form.Item>

          <Form.Item label="团购价" name="groupbuyPrice" rules={[{ required: true, message: '请输入团购价' }]}>
            <InputNumber min={0} precision={2} style={{ width: '100%' }} placeholder="0.00" />
          </Form.Item>

          <Form.Item label="最小成团人数" name="minGroupSize">
            <InputNumber min={1} max={100} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="库存" name="stock">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="状态" name="status">
            <Button.Group>
              <Button type={form.getFieldValue('status') === 1 ? 'primary' : 'default'} onClick={() => form.setFieldValue('status', 1)}>上架</Button>
              <Button type={form.getFieldValue('status') === 0 ? 'primary' : 'default'} danger onClick={() => form.setFieldValue('status', 0)}>下架</Button>
            </Button.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default GroupbuyProduct
