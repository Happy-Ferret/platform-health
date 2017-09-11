import dotenv from 'dotenv';
import http from 'http';
// import logger from 'koa-logger';
import Router from 'koa-router';
import staticCache from 'koa-static-cache';
import webpackDevMiddleware from 'koa-webpack-dev-middleware';
import webpackHotMiddleware from 'koa-webpack-hot-middleware';
import webpack from 'webpack';
import Koa from 'koa';

dotenv.config();

/* eslint-disable import/first */
import webpackConfig from './../webpack.config.babel';

import { router as perf } from './perf';
/* eslint-enable import/first */

const app = new Koa();

// app.use(logger());

const api = new Router();
api.use('/perf', perf.routes());

const index = new Router();
index.use('/api', api.routes());
app.use(index.routes());

app.use(async (ctx, next) => {
  const route = ctx.path;
  if (/^\/[a-zA-Z/]*$/.test(route)) {
    ctx.path = '/index.html';
  }
  await next();
  ctx.path = route;
});

/* istanbul ignore if */
if (process.env.NODE_ENV !== 'test') {
  if (process.env.NODE_ENV === 'production') {
    app.use(staticCache('./dist', {
      maxAge: 24 * 60 * 60,
    }));
  } else {
    const compiler = webpack(webpackConfig);
    app.use(webpackDevMiddleware(compiler, {
      publicPath: webpackConfig.output.publicPath,
      noInfo: true,
      hot: true,
      // lazy: true,
      historyApiFallback: true,
    }));
    app.use(webpackHotMiddleware(compiler));
  }

  const server = http.createServer(app.callback());
  server.on('listening', () => {
    const { address, port } = server.address();
    console.log('http://%s:%d/ in %s', address, port, process.env.NODE_ENV || 'dev');
  });
  server.listen(process.env.PORT || 3000);
}

export default app;
