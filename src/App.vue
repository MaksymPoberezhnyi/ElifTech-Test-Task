<template>
  <div>
    <Header/>
    <Index/>
    <Footer/>
  </div>
</template>

<script>
// eslint-disable-next-line no-useless-escape
import Header from "@/components/layout/Header.vue"
import Index from "@/components/comments/Index.vue"
import Footer from "@/components/layout/Footer.vue"

export default {
  name: 'App', 
  components: {
    Header,
    Index,
    Footer
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.containter {
  width: 80%;
  margin: 20px auto;
}
</style>
