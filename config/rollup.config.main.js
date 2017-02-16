const base = require(`./rollup.config.base`)

module.exports = Object.assign({}, base, {
  entry: `src/switchcost.js`,
  targets: [
    {
      dest: `index.js`,
      format: `cjs`
    },
    {
      dest: `index.es.js`,
      format: `es`
    }
  ]
})
