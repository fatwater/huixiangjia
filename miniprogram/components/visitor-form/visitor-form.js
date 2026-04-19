Component({
  properties: {},

  data: {
    formData: {
      visitor_name: '',
      phone: '',
      visit_date: '',
      purpose: ''
    },
    dateRange: []
  },

  lifetimes: {
    attached() {
      const dateUtil = require('../../utils/date')
      this.setData({ dateRange: dateUtil.getDateRange(30) })
    }
  },

  methods: {
    onFieldChange(e) {
      const { field } = e.currentTarget.dataset
      this.setData(`formData.${field}`, e.detail.value)
    },

    onDateChange(e) {
      this.setData('formData.visit_date', e.detail.value)
    },

    validate() {
      const { visitor_name, phone, visit_date, purpose } = this.data.formData
      if (!visitor_name.trim()) {
        wx.showToast({ title: '请输入访客姓名', icon: 'none' })
        return false
      }
      if (!phone.trim() || !/^1\d{10}$/.test(phone)) {
        wx.showToast({ title: '请输入正确的手机号', icon: 'none' })
        return false
      }
      if (!visit_date) {
        wx.showToast({ title: '请选择访问日期', icon: 'none' })
        return false
      }
      if (!purpose.trim()) {
        wx.showToast({ title: '请输入访问目的', icon: 'none' })
        return false
      }
      return true
    },

    getFormData() {
      return this.data.formData
    },

    reset() {
      this.setData({
        formData: {
          visitor_name: '',
          phone: '',
          visit_date: '',
          purpose: ''
        }
      })
    }
  }
})
