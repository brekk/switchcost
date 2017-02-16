// const istanbul = require(`rollup-plugin-istanbul`)
const progress = require(`rollup-plugin-progress`)
const commonjs = require(`rollup-plugin-commonjs`)
const cleanup = require(`rollup-plugin-cleanup`)
const resolve = require(`rollup-plugin-node-resolve`)
const buble = require(`rollup-plugin-buble`)
const json = require(`rollup-plugin-json`)
const pkg = require(`../package.json`)
const external = Object.keys(pkg.dependencies)

module.exports = {
  external,
  globals: {
    [`ramda`]: `R`
  },
  plugins: [
    progress(),
    commonjs({
      // sourceMap: false,
      include: `node_modules/**`,
      extensions: [`.js`]
    }),
    resolve({
      jsnext: true,
      main: true
    }),
    json(),
    buble(),
    cleanup({
      comments: `none`
    })
  ],
  sourceMap: true,
  exports: `named`,
  moduleName: pkg.name
}
