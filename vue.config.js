const path = require("path");
const resolve = dir => require("path").join(__dirname, dir);
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
module.exports = {
  publicPath: "./",
  // 后续开发直接改为生产包名
  outputDir: "dist",
  productionSourceMap: false,
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          // 直接覆盖变量
          'text-color': '#333333',
          'border-color': '#eee',
          // 'nav-bar-arrow-size': '22px',
          // 或者可以通过 less 文件覆盖（文件路径为绝对路径）
          hack: `true; @import "/src/assets/css/theme.less";`,
        },
      },
    },
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, "src/assets/css/mixin.less")] // 引入全局样式变量
    }
  },
  configureWebpack: config => {
    config.name = "项目名称";
    // config.resolve.alias.comps = require("path").join(__dirname, "src/components");
  },
  chainWebpack(config) {
    // 1、webpack中本来有处理svg的rule，需要过滤掉icons/svg
    config.module.rule("svg")
      .exclude.add(resolve("src/assets/icons"));
    // 2、svg-loader配置
    config.module.rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/assets/icons")).end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]"
      })
  },
  devServer: {
    // app是一个express的实例

    before(app) {
      app.use(bodyParser.urlencoded({
        extentded: false
      }));
      app.use(bodyParser.json());
      app.post("/testApi", (req, res) => {
        console.log(req.body);
        console.log(req.query)
        let resJson = {
          stat: "00",
          body: {
            name: "lisong",
            age: 18
          }
        }
        res.json(resJson)
      })
    }
  }
};
