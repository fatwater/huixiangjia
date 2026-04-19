import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Card, message, Space } from 'antd'
import { useParams, useNavigate } from 'react-router-dom'
import { tenantApi } from '../../api/tenant'

function TenantDetail() {
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
      const res = await tenantApi.detail(id)
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
        await tenantApi.update(id, values)
      } else {
        await tenantApi.create(values)
      }
      message.success('保存成功')
      navigate('/tenant')
    } catch (error) {
      message.error('保存失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{isEdit ? '编辑租户' : '新增租户'}</h1>
      </div>
      <Card>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item label="租户名称" name="name" rules={[{ required: true }]}>
            <Input placeholder="请输入租户名称" />
          </Form.Item>
          <Form.Item label="企业微信 CorpID" name="corp_id" rules={[{ required: true }]}>
            <Input placeholder="请输入企业微信 CorpID" />
          </Form.Item>
          <Form.Item label="状态" name="status" initialValue={1}>
            <Input type="number" placeholder="1-启用 0-禁用" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                保存
              </Button>
              <Button onClick={() => navigate('/tenant')}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default TenantDetail
