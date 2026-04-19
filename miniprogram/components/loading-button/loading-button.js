Component({
  properties: {
    text: { type: String, default: '提交' },
    loading: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false }
  },

  methods: {
    onTap() {
      if (!this.data.loading && !this.data.disabled) {
        this.triggerEvent('tap')
      }
    }
  }
})
