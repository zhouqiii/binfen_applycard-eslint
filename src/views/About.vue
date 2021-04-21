<template>
  <div>
    <h1>This is an about page</h1>
    <div @click="conMSg">this is test console</div>
  </div>
</template>
<script>

export default {
  name: 'About',
  methods: {
    conMSg() {
      console.log('11');
    },
  },
};

</script>

<style scoped>

</style>
