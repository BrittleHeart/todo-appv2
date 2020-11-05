<template>
  <div id="app">
    <div id="nav" v-if="!token">
      <router-link to="/">Home</router-link> |
      <router-link to="/login">Login</router-link> |
      <router-link to="/register">Register</router-link>
    </div>
    <div id="nav" v-else>
      <router-link to="/">Home</router-link> |
      <a @click="logout()">Logout</a> |
    </div>
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>

<script>
export default {
  data: () => ({
    token: localStorage.getItem('token')
  }),
  methods: {
    logout() {
      localStorage.removeItem('token')
      return this.$router.push('/login')
    }
  },
  watch: {
    token(newVal, oldVal) {
      return this.token ? true : false
    }
  }
}
</script>
