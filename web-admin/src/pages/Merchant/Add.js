import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Card, message, Select, Space, Row, Col, InputNumber, Upload } from 'antd'
import { useParams, useNavigate } from 'react-router-dom'
import { PlusOutlined, UploadOutlined } from '@ant-design/icons'
import request from '../../api'

const { TextArea } = Input

function MerchantAdd() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const isEdit = !!id

  useEffect(() => {
    if (isEdit) {
      loadData()
    }
  }, [id])

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await request.get(`/merchants/${id}`)
      form.setFieldsValue(res)
    } catch (error) {
      message.error('加载失败')
    } finally {
      setLoading(false)
    }
  }

  const onFinish = async (values) => {
    setLoading(true)
    try {
      const data = {
        ...values,
        tenant_id: 1
      }

      if (isEdit) {
        await request.put(`/merchants/${id}`, data)
      } else {
        await request.post('/merchants', data)
      }
      message.success('保存成功')
      navigate('/merchant')
    } catch (error) {
      message.error('保存失败')
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    '餐饮', '咖啡', '健身', '购物', '休闲', '超市', '水果', '药店', '干洗', '家政', '其他'
  ]

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h2>{isEdit ? '编辑商家' : '新增商家'}</h2>
      </div>
      <Card>
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ status: 1 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="商家名称" name="name" rules={[{ required: true, message: '请输入商家名称' }]}>
                <Input placeholder="请输入商家名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="分类" name="category" rules={[{ required: true, message: '请选择分类' }]}>
                <Select placeholder="选择分类">
                  {categories.map(cat => (
                    <Select.Option key={cat} value={cat}>{cat}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="地址" name="address" rules={[{ required: true, message: '请输入地址' }]}>
                <Input placeholder="如：A栋 1层" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="联系电话" name="phone">
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="营业时间" name="businessHours">
                <Input placeholder="如：09:00-21:00" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="优惠信息" name="discount">
                <Input placeholder="如：员工价85折" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="商家封面图" name="coverImage">
            <Input placeholder="输入图片URL" />
          </Form.Item>

          <Form.Item label="商家介绍" name="description">
            <TextArea rows={4} placeholder="请输入商家介绍" />
          </Form.Item>

          <Form.Item label="状态" name="status">
            <Select>
              <Select.Option value={1}>上架</Select.Option>
              <Select.Option value={0}>下架</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                保存
              </Button>
              <Button onClick={() => navigate('/merchant')}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default MerchantAdd
