const { DateTime } = require("luxon")



//const diff = date1.diff(date2, ["years", "months", "days", "hours", "minutes", "seconds"])

//24 de agosto de 2021 14:59:24 BRT






let d = DateTime.now().setZone('America/Recife').toISO()
let j = DateTime.now().setZone('America/Recife').toISO()
let k = DateTime.now().setZone('America/Recife').toISO()

let p = DateTime.fromISO(d).toLocaleString(DateTime.DATETIME_FULL)
const a = DateTime.fromISO("2021-08-24T18:17:37.461-03:00")

const l1 = DateTime.fromISO('2021-08-24T18:17:37.461-03:00')
const l2 = DateTime.fromISO('2021-08-24T20:05:45.298-03:00')

const date1 = DateTime.fromISO(d)
const date2 = DateTime.fromISO(a)

const diff = l1.diff(l2, ["minutes"])

console.log(diff.toObject())