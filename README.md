# binfen_ApplyCardNew
新的脚手架重新写网申页面
# consolidated-bill

## binfen-base

缤纷基础脚手架,基于vant less eslint postcss-pxtorem svg-sprite-loader

filter.js 定义常用过滤器 (vue3 不支持过滤器,官方建议用计算属性或方法代替过滤器)

storage.js 封装了带有有效期的缓存

request.js 封装了项目常用的拦截器及基本配置

commonBase.js 定义常用数据处理函数

commonApp.js 定义常用与app交互的函数

commonWX.js 定义微信分享等与微信相关函数,需注册 jweixin-npm

组件封装:

svg-icon svg小图标

nav-bar-base 顶部导航

no-content 页面异常

payment-password 支付密码

样式:

var.less 定义变量

theme.less 自定义主题

mixin.less 混合器

index.less 全局样式

其他样式可在index.less 中引入或者在组件中单独引入

## Project setup

    npm install

### Compiles and hot-reloads for development

    npm run serve

### Compiles and minifies for production

    npm run build

### Run your tests

    npm run test

### Lints and fixes files

    npm run lint

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
