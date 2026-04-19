Component({
  properties: {
    merchant: { type: Object }
  },

  methods: {
    onTap() {
      this.triggerEvent('tap', { merchant: this.data.merchant })
    }
  }
})
