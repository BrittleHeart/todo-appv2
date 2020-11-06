<template>
  <div id="app">
    <div id="nav" class="nav" role="navigation">
      <h1 class="nav__header">Todo App V2 👻</h1>
      <ul class="nav__list">
        <li class="nav__list--item">
          <router-link to="/" class="nav__item--link">
            <span class="nav__item--icon">
              <font-awesome-icon icon="home"></font-awesome-icon>
            </span>
            Home
          </router-link>
        </li>
        <li class="nav__list--item" v-if="!token">
          <router-link to="/login" class="nav__item--link" >
            <span class="nav__item--icon">
              <font-awesome-icon icon="user"></font-awesome-icon>
            </span>
            Login
          </router-link>
        </li>
        <li class="nav__list--item" v-if="!token">
          <router-link to="/register" class="nav__item--link" >
            <span class="nav__item--icon">
              <font-awesome-icon icon="user-plus"></font-awesome-icon>
            </span>
            Register
          </router-link>
        </li>
        <li class="nav__list--item" v-if="token">
          <span class="nav__item--icon">
            <font-awesome-icon icon="sign-out-alt"></font-awesome-icon>
          </span>
          <a @click="logout()" class="nav__item--link">Logout</a>
        </li>
      </ul>
    </div>
    <router-view/>
  </div>
</template>

<style>
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  line-height: 1;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
body {
  max-width: 100vw;
  background-color: #e4e4e4;
}
#app {
  width: 100%;
  max-width: 100%;
}

#app .nav {
  width: 100%;
  max-width: 100%;
  padding: 10px 7px;
  background-color: rgba(56, 56, 56, 0.829);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: rgb(244, 244, 244);
}

#app .nav .nav__list {
  list-style: none;
}

#app .nav .nav__list--item {
  display: inline-block;
  margin: 0 20px;
}

#app .nav .nav__item--icon {
  margin: 0 7px 0 0;
}

#app .nav .nav__item--link {
  text-decoration: none;
  color:  rgb(244, 244, 244);
  padding: 8px;
  transition: background-color .5s ease;
}

#app .nav .nav__item--link:hover {
  background-color: rgba(120, 250, 120, .5);
}

.router-link-exact-active {
  border-left: 3px solid rgba(120, 250, 120, .9);
  transition: background-color .7s ease-in-out;
  background-color:  rgba(120, 250, 120, .5);
  font-weight: 600;
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
