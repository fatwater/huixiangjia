Component({
  properties: {
    room: { type: Object },
    date: { type: String },
    selectedSlot: { type: String }
  },

  methods: {
    onTap() {
      this.triggerEvent('tap', { room: this.data.room })
    }
  }
})
