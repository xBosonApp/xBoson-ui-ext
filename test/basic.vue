<template>
  <div class="example">{{ msg }}</div>
</template>

<script>
export default {
  data () {
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