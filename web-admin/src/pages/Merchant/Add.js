import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Card, message, Select, Space } from 'antd'
import { useParams, useNavigate } from 'react-router-dom'
import { merchantApi } from '../../api/merchant'

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
      const res = await merchantApi.detail(id)
      form.setFieldsValue(res.data)
    } catch (error) {
      message.error('加载失败')
    } finally {
      setLoading(false)
    }
  }

  const onFinish = async (values) => {
    setLoading(true)
    try {
      if (isEdit) {
        await merchantApi.update(id, values)
      } else {
        await merchantApi.create(values)
      }
      message.success('保存成功')
      navigate('/merchant')
    } catch (error) {
      message.error('保存失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{isEdit ? '编辑商家' : '新增商家'}</h1>
      </div>
      <Card>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item label="商家名称" name="name" rules={[{ required: true }]}>
            <Input placeholder="请输入商家名称" />
          </Form.Item>
          <Form.Item label="分类" name="category" rules={[{ required: true }]}>
            <Select placeholder="选择分类">
              <Select.Option value="餐饮">餐饮</Select.Option>
              <Select.Option value="超市">超市</Select.Option>
              <Select.Option value="水果">水果</Select.Option>
              <Select.Option value="药店">药店</Select.Option>
              <Select.Option value="干洗">干洗</Select.Option>
              <Select.Option value="家政">家政</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="地址" name="address" rules={[{ required: true }]}>
            <Input placeholder="请输入地址" />
          </Form.Item>
          <Form.Item label="联系电话" name="phone">
            <Input placeholder="请输入联系电话" />
          </Form.Item>
          <Form.Item label="优惠信息" name="coupon_info">
            <TextArea rows={3} placeholder="请输入优惠信息" />
          </Form.Item>
          <Form.Item label="商家介绍" name="description">
            <TextArea rows={4} placeholder="请输入商家介绍" />
          </Form.Item>
          <Form.Item label="状态" name="status" initialValue={1}>
            <Select>
              <Select.Option value={1}>启用</Select.Option>
              <Select.Option value={0}>禁用</Select.Option>
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
