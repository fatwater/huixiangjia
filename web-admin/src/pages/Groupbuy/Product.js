import React, { useState, useEffect } from 'react'
import { Table, Button, Space, Tag, message, Modal, Form, Input, InputNumber, Image } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { groupbuyApi } from '../../api/groupbuy'

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
      const res = await groupbuyApi.getProducts()
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
        await groupbuyApi.updateProduct(editingRecord.id, values)
      } else {
        await groupbuyApi.createProduct(values)
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
      await groupbuyApi.deleteProduct(id)
      message.success('删除成功')
      loadData()
    } catch (error) {
      message.error('删除失败')
    }
  }

  const columns = [
    { title: '商品名称', dataIndex: 'name' },
    {
      title: '封面图',
      dataIndex: 'cover_image',
      render: (url) => url ? <Image src={url} width={60} height={60} /> : '-'
    },
    { title: '现价', dataIndex: 'price', render: (v) => `¥${v}` },
    { title: '原价', dataIndex: 'original_price', render: (v) => `¥${v}` },
    { title: '库存', dataIndex: 'stock' },
    { title: '已售', dataIndex: 'sales_count' },
    {
      title: '状态',
      dataIndex: 'status',
      render: (status) => (
        <Tag color={status === 1 ? 'green' : 'red'}>
          {status === 1 ? '上架' : '下架'}
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
        <h1 className="page-title">商品管理</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增商品
        </Button>
      </div>
      <Table columns={columns} dataSource={dataSource} rowKey="id" loading={loading} />

      <Modal
        title={editingRecord ? '编辑商品' : '新增商品'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="商品名称" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="封面图URL" name="cover_image">
            <Input />
          </Form.Item>
          <Form.Item label="现价" name="price" rules={[{ required: true }]}>
            <InputNumber min={0} precision={2} style={{ width: 200 }} />
          </Form.Item>
          <Form.Item label="原价" name="original_price">
            <InputNumber min={0} precision={2} style={{ width: 200 }} />
          </Form.Item>
          <Form.Item label="库存" name="stock" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: 200 }} />
          </Form.Item>
          <Form.Item label="商品描述" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item label="状态" name="status" initialValue={1}>
            <InputNumber min={0} max={1} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default GroupbuyProduct
