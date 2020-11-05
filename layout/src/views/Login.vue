<template>
  <div class="home">
    <h1>This is an login page</h1>
  </div>
</template>

<script>
import * as yup from 'yup'

export default {
  data: () => ({
    user: {
      email: '',
      password: '',
    }
  })
}
</script>
