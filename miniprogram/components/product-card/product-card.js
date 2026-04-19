Component({
  properties: {
    product: { type: Object }
  },

  methods: {
    onTap() {
      this.triggerEvent('tap', { product: this.data.product })
    }
  }
})
