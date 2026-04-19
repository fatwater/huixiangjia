// miniprogram/utils/date.js

const FORMAT_DEFAULT = 'YYYY-MM-DD'
const FORMAT_TIME = 'YYYY-MM-DD HH:mm'
const FORMAT_FULL = 'YYYY-MM-DD HH:mm:ss'

function formatDate(date, format = FORMAT_DEFAULT) {
  if (!date) return ''

  const d = date instanceof Date ? date : new Date(date)

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

function getToday() {
  return formatDate(new Date())
}

function getTomorrow() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return formatDate(d)
}

function getDateRange(days = 7) {
  const dates = []
  for (let i = 0; i < days; i++) {
    const d = new Date()
    d.setDate(d.getDate() + i)
    dates.push({
      value: formatDate(d),
      label: formatDate(d, 'MM-DD'),
      week: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][d.getDay()]
    })
  }
  return dates
}

function isToday(dateStr) {
  return dateStr === getToday()
}

function isTomorrow(dateStr) {
  return dateStr === getTomorrow()
}

function getWeekDay(dateStr) {
  const d = new Date(dateStr)
  return ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][d.getDay()]
}

module.exports = {
  formatDate,
  getToday,
  getTomorrow,
  getDateRange,
  isToday,
  isTomorrow,
  getWeekDay,
  FORMAT_DEFAULT,
  FORMAT_TIME,
  FORMAT_FULL
}
