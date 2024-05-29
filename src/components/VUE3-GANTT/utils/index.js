// Processing date range
export const computedDaysRange = (daysArr, endDay = null) => {
    let result = daysArr
    if (typeof endDay === 'string') {
      result = fethDaysRange(daysArr, endDay)
    }
    return result?.map(item => fetchDayDetail(item))
  }
  
  // Get detailed information for a specified date
  export const fetchDayDetail = (current) => {
    let currentDate = null
    if (typeof current === 'string') {
      currentDate = new Date(current)
    } else if (current instanceof Date) {
      currentDate = current
    }
    const weekName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  
    return {
      year: String(currentDate.getFullYear()).padStart(4, '0'),
      month: String(currentDate.getMonth() + 1).padStart(2, '0'),
      day: String(currentDate.getDate()).padStart(2, '0'),
      week: weekName[currentDate.getDay()]
    }
  }

  
  // Get the date of each day of the specified month 2022-02
  export const fethDays = (str) => {
    const month = str.replace(/\//g, '-')
    const monthArr = month.split('-').map(item => parseInt(item, 10))
    if (monthArr.length !== 2) throw new Error('Invalid month parameter:', str)
    const count = new Date(monthArr[1], monthArr[0], 0).getDate()
    return Array.from({ length: count }, (_, index) => index + 1)
}

  
  // Get the date of each day in the specified range
  export const fethDaysRange = (start, stop) => {
    const current = new Date(start.replace(/\//g, '-'))
    const end = new Date(stop)
    current.setHours(0, 0, 0, 0)
    const result = []
    while (end.getTime() >= current.getTime()) {
      const res = fetchDayDetail(current)
      result.push(`${res.year}-${res.month}-${res.day}`)
      current.setDate(current.getDate() + 1)
    }
    return result
  }
  
  // Range dates are sorted by month
  export const splitDaysForMonth = (daysArr) => {
    const res = {}
    daysArr?.forEach(item => {
      const name = item.year + '-' + item.month
      if (res[name]) {
        res[name].push(item)
      } else {
        res[name] = [item]
      }
    })
    return Object.values(res)
  }
  
  // Query whether the specified date is within the specified range
  export const todayInRange = (today, range) => {
    return fethDaysRange(...range).includes(today)
  }
  
  // Get a list of dates in a specified month
  export const fetchMonthRangeDay = (str) => {
    const dateList = String(str).replace('/', '-').split('-')
    return fethDays(str)?.map(item => {
      return String(dateList[0]).padStart(4, '0') + '-' + String(dateList[1]).padStart(2, '0') + '-' + String(item).padStart(2, '0')
    })
  }
  
  export const fetchToday = () => {
    const now = new Date()
    const currentYear = String(now.getFullYear()).padStart(4, '0')
    const currentMonth = String(now.getMonth() + 1).padStart(2, '0')
    const currentDay = String(now.getDate()).padStart(2, '0')
    return `${currentYear}-${currentMonth}-${currentDay}`
  }
  
  export const fetchThreeDays = (now = new Date()) => {
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth() + 1
    const currentDate = `${currentYear}-${ String(currentMonth).padStart(2, '0')}`
    let prevDate = ''
    if (currentMonth === 1) {
      prevDate = `${String(currentYear - 1).padStart(4, '0')}-12`
    } else {
      prevDate = `${String(currentYear).padStart(4, '0')}-${String(currentMonth - 1).padStart(2, '0')}`
    }
    let nextDate = ''
    if (currentMonth === 12) {
      nextDate = `${String(currentYear + 1).padStart(4, '0')}-01`
    } else {
      nextDate = `${String(currentYear).padStart(4, '0')}-${String(currentMonth + 1).padStart(2, '0')}`
    }
  
    const prev = fetchMonthRangeDay(prevDate)
    const current = fetchMonthRangeDay(currentDate)
    const next = fetchMonthRangeDay(nextDate)
    let result = [...prev, ...current, ...next]
    result.prev = prev
    result.current = current
    result.next = next
    return result
  }
  
  const dateSplitForValue = (data)  =>  {
    if (!data.length) return {}
    const start = data[0].days[0]
    const endTime = data?.map(item => new Date(item.days.at(-1)).getTime()).sort((a, b) => a - b).at(-1)
    const endDate = fetchDayDetail(new Date(endTime))
    const end = `${endDate.year}-${endDate.month}-${endDate.day}`
    const res = {}
    fethDaysRange(start, end).forEach(key => {
         const current = data?.map((item, index) => {
            if (item.days.includes(key)) return index
            return false
        }).filter(item => item !== false)
        if (current.length) {
          res[key] = current
        }
    })
    return res
  }
  
  export const workListSplitForRepeat = (arr, repeatMode) => {
    const resArr = arr?.map(schedule => {
      if (schedule.type !== 'normal') return schedule
      const obj = dateSplitForValue(schedule.schedule)
      const values = Object.values(obj)
      const keys = Object.keys(obj)
      if (!keys.length) return schedule
      // const resMap = [...new Set(values.map(item => JSON.stringify(item)))].map(item => JSON.parse(item))
      const resMap = []
      for (let i = 0; i < values.length; i++) {
        if (JSON.stringify(resMap.at(-1)) !== JSON.stringify(values[i])) {
            resMap.push(values[i])
            resMap.at(-1).days = [ keys[i] ]
        } else {
            if (resMap.at(-1)) {
                if (resMap.at(-1).days) {
                    resMap.at(-1).days.push(keys[i])
                } else {
                    resMap.at(-1).days = [ keys[i] ]
                }
            }
        }
      }
      let result = new Array(resMap.length).fill({})
      result = result?.map((item, index) => {
          let r = {}
          if (resMap[index].length === 1) {
              r = {
                  ...schedule.schedule[resMap[index][0]],
                  days: resMap[index].days,
                  daysSource: schedule.schedule[resMap[index][0]].days
              }
              if (r.list) {
                let desc = ''
                let name = ''
                if (typeof repeatMode.desc === 'function') {
                  desc = repeatMode.desc(r.list)
                } else {
                  desc = repeatMode.desc
                }
                if (typeof repeatMode.name === 'function') {
                  name = repeatMode.name(r.list)
                } else {
                  name = repeatMode.name
                }
                r = {
                  ...r,
                  // desc, name, backgroundColor: repeatMode.backgroundColor, textColor: repeatMode.textColor,
                }
              }
          } else {
              const list = resMap[index]?.map(v => schedule.schedule[v])
              let desc = ''
              let name = ''
              if (typeof repeatMode.desc === 'function') {
                desc = repeatMode.desc(list)
              } else {
                desc = repeatMode.desc
              }
              if (typeof repeatMode.name === 'function') {
                name = repeatMode.name(list)
              } else {
                name = repeatMode.name
              }
              r = {
                  desc,
                  backgroundColor: repeatMode.backgroundColor,
                  textColor: repeatMode.textColor,
                  name,
                  list,
                  days: resMap[index].days,
              }
          }
          // r.days = values.map((v, i) => {
          //     if (JSON.stringify(v) === JSON.stringify(resMap[index])) {
          //         return keys[i]
          //     }
          // }).filter(v => v)
          // console.log('*********', r)
          return r
      })
      schedule.schedule = result
      return schedule
    })
    // console.log('resArr--->', resArr)
    return resArr
  }
  
  export const fetchNextMonthRange = (date = new Date()) => {
    return fetchThreeDays(date).next
  }
  
  export const fetchPrevMonthRange = (date = new Date()) => {
    return fetchThreeDays(date).prev
  }
  
  export const fetchTodayMonthRange = (date = new Date()) => {
    return fetchThreeDays(date).current
  }
  
   export const getMonthRange = (monthYear) => {
    // Extract month and year from the input string
    const [monthName, year] = monthYear.split(' ');
    
    // Map month names to their corresponding numeric values
    const monthMap = {
        "January": 1, "February": 2, "March": 3, "April": 4, "May": 5, "June": 6,
        "July": 7, "August": 8, "September": 9, "October": 10, "November": 11, "December": 12
    };

    // Get the numeric value of the month from the map
    const month = monthMap[monthName];

    // Calculate the start and end dates of the month
    const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];
    
    return { startDate, endDate };
};
