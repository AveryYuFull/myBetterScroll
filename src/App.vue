<template>
  <div id="app">
    <b-list></b-list>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld'
import BList from './components/List';

export default {
    name: 'App',
    components: {
    // HelloWorld
        BList
    }
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
