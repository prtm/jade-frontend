<template>
  <HomePage />
</template>

<script>
import HomePage from "./pages/HomePage.vue";

export default {
  name: "App",
  components: {
    HomePage,
  },
};
</script>

<style>
#app {
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
html,
body {
  height: 100%;
  background-color: #171717;
}
</style>
