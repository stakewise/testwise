const path = require('path')


require('@babel/register')({
  ignore: [
    path.resolve('build'),
    /node_modules/,
  ],
  extensions: [ '.js', '.ts', '.tsx' ],
})
