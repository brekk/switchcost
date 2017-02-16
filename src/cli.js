import {switchcost} from './switchcost'

const inputs = process.argv.slice(2)
const [a, b] = inputs

// eslint-disable-next-line
switchcost({}, a, b).fork(console.log, console.warn)
