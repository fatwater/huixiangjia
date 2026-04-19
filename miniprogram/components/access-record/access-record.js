Component({
  properties: {
    record: { type: Object }
  },

  methods: {
    onTap() {
      this.triggerEvent('tap', { record: this.data.record })
    }
  }
})
