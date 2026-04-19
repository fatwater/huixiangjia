Component({
  data: {
    active: 'index',
    list: [
      { pagePath: 'pages/index/index', text: '首页', icon: 'home', activeIcon: 'home-fill' },
      { pagePath: 'pages/property/meeting/meeting', text: '物业', icon: 'building', activeIcon: 'building-fill' },
      { pagePath: 'pages/merchant/list/list', text: '商家', icon: 'shop', activeIcon: 'shop-fill' },
      { pagePath: 'pages/groupbuy/list/list', text: '团购', icon: 'shopping-cart', activeIcon: 'shopping-cart-fill' },
      { pagePath: 'pages/profile/profile', text: '我的', icon: 'user', activeIcon: 'user-fill' }
    ]
  },

  lifetimes: {
    attached() {
      this.updateActive()
    }
  },

  pageLifetimes: {
    show() {
      this.updateActive()
    }
  },

  methods: {
    updateActive() {
      const pages = getCurrentPages()
      const currentPage = pages[pages.length - 1]
      if (currentPage) {
        const route = currentPage.route
        const active = this.getActiveTab(route)
        if (active !== this.data.active) {
          this.setData({ active })
        }
      }
    },

    getActiveTab(route) {
      if (route.includes('index')) return 'index'
      if (route.includes('property') || route.includes('meeting')) return 'property'
      if (route.includes('merchant')) return 'merchant'
      if (route.includes('groupbuy')) return 'groupbuy'
      if (route.includes('profile')) return 'profile'
      return 'index'
    },

    switchTab(e) {
      const { index } = e.currentTarget.dataset
      const item = this.data.list[index]
      wx.switchTab({ url: `/${item.pagePath}` })
    }
  }
})
