<template>
  <div class="example">{{ msg }}</div>
</template>

<script>
import * as vue from 'vue'
export default {
  data () {
    console.log(vue)
    return {
      msg: 'Hello world!'
    }
  }
}
</script>

<style scoped>
.example {
  color: red;
}
</style>

<style lang='less'>
@width: 10px;
@height: @width + 10px;

#header {
  width: @width;
  height: @height;
}
</style>