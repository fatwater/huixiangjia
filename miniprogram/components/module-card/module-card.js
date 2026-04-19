Component({
  properties: {
    title: { type: String },
    icon: { type: String },
    color: { type: String, default: '#1890ff' },
    badge: { type: Number, value: 0 }
  },

  methods: {
    onTap() {
      this.triggerEvent('tap')
    }
  }
})
