<template>
  <div id="app">
    <h1>Vue Compile Share</h1>
    <Details></Details>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Details from "./components/details.vue";

export default Vue.extend({
  name: "app",
  components: {
    Details
  }
});
</script>

<style lang="stylus">
#app {
  font-family Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color red
  margin-top 60px
}
</style>
