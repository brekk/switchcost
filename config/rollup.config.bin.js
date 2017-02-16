const base = require(`./rollup.config.base`)

module.exports = Object.assign({}, base, {
  entry: `src/cli.js`,
  targets: [
    {
      dest: `cli.js`,
      format: `cjs`
    }
  ]
})
