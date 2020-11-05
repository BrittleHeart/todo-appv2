<template>
  <div class="dashboard">
    <h1>Dashboard</h1>
    <p>Hello {{userName}} 😎</p>
  </div>
</template>

<script>
import {decode} from '../utils/decodeJWTToken'

export default {
  data: () => ({
    userName: ''
  }),
  created() {
    const token = localStorage.getItem('token')
    const decodedToken = decode(token)
    this.userName = decodedToken.name
  }
}
</script>
