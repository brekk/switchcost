import size from 'npm-module-stats'
import Future from 'fluture'
import prettyBytes from 'pretty-bytes'
// import Magic from 'futurize'
// const futurize = Magic.futurize(Future)
import curry from 'ramda/src/curry'
import pipe from 'ramda/src/pipe'
import filter from 'ramda/src/filter'
import identity from 'ramda/src/identity'
import map from 'ramda/src/map'

const whatever = {[`@@functional/placeholder`]: true}

const {log: _log, error: _error} = console
const [log, error] = map((x) => x.bind(console), [
  _log,
  _error
])
const emote = curry((logger, a, filterer, b) => {
  // eslint-disable-next-line
  log(a, filterer(b))
  return b
})
// it's trace with a filter!
const hey = emote(log)
// it's trace!
const trace = hey(whatever, identity, whatever)

const barf = (e) => {
  error(e)
  if (e.stack) {
    log(e.stack)
  }
}

const getStats = (pkg) => (
  new Future(
    (reject, resolve) => {
      // eslint-disable-next-line
      size.getStats(pkg).then(resolve).catch(reject)
    }
  )
)
const getAllStats = map(getStats)

const addHumanReadableSizes = (x) => Object.assign({}, x, {
  prettySize: prettyBytes(x.size)
})

const decorateForHumans = curry((a, b, stats) => {
  // npm-module-stats is impure and does some funkiness with the returned results
  const raw = stats[0]
  // I've chosen to curry in the a & b names and filter instead of the below
  // which would prolly work if it was pure
  // const [a, b] = Object.keys(raw)
  const keys = Object.keys(raw)
  const [aKey, bKey] = filter((key) => {
    return key.indexOf(a) === 0 || key.indexOf(b) === 0
  }, keys)
  return map(addHumanReadableSizes, [raw[aKey], raw[bKey]])
})
const diff = curry((a, b) => Math.abs(a - b))

const reasonAboutData = (stats = []) => {
  const [a = {}, b = {}] = stats
  const {module: aName = ``, size: aSize = 0} = a
  const {module: bName = ``, size: bSize = 0} = b
  const sizeDifference = diff(aSize, bSize)
  return {
    a,
    b,
    meta: {
      sizeDifference,
      prettySizeDifference: prettyBytes(sizeDifference),
      smaller: a.size > b.size ? bName : aName
    }
  }
}

export const switchcost = curry(function _switchcost(
  environment, pkg1, pkg2
) {
  const [stats1, stats2] = getAllStats([pkg1, pkg2])
  return Future.both(stats1, stats2)
    .map(decorateForHumans(pkg1, pkg2))
    .map(reasonAboutData)
})
