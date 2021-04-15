<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="less">
#app {
  padding-bottom: constant( safe-area-inset-bottom); /* 兼容 iOS < 11.2 */
  padding-bottom: env( safe-area-inset-bottom); /* 兼容 iOS >= 11.2 */
}
</style>
