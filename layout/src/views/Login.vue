<template>
  <div class="login">
    <p v-if="loggedIn">Loading ..</p>
    <p v-if="formError">{{formError}}</p>
    <form @submit.prevent="login()" v-if="!loggedIn && !invalidCredentials">
      <div class="form-group">
        <label for="email">Email:</label>
        <input 
          type="text" 
          name="email" 
          id="email" 
          placeholder="Type your email.." 
          v-model="user.email" 
          required 
          role="input">
        
        <h5 class="text-muted">Type your email (min: 5 characters):</h5>
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input 
          type="password" 
          name="password" 
          id="password" 
          placeholder="Type your password.." 
          v-model="user.password" 
          required 
          role="input">
        <h5 class="text-muted">Type your email (min: 7 characters):</h5>

      </div>
      <button type="submit" class="button">Sign in</button>
    </form>
    <div v-if="invalidCredentials">
      <h1>Invalid credentials</h1>
      <button @click="invalidCredentials = false">Try again</button>
    </div>
  </div>
</template>

<script>
import Joi from 'joi'
import axios from 'axios'

const schema = Joi.object().keys({
  email: Joi.string().trim().min(5).max(255).email({minDomainSegments: 2, tlds: {allow: ['pl', 'com']}}).required(),
  password: Joi.string().trim().min(7).max(255).required()
})

export default {
  data: () => ({
    user: {
      email: '',
      password: '',
    },
    formError: '',
    loggedIn: false,
    invalidCredentials: false
  }),
  methods: {
    async login() {
      this.formError = '' 

      if(this.isUserValid()) {
        try {
          const response = await axios.post('http://localhost:3000/api/v1/authenticate', this.user)

          if(!response.data.access_token)
            return this.invalidCredentials = true

          switch(response.status)
          {
            case 400:
              this.formError = "Bad request"
              break;
            case 500:
              this.formError = "Server error"
              break;
          }

          if(response.status === 200 && response.data.access_token) {
            window.localStorage.setItem("token", response.data.access_token)
            this.loggedIn = true
            return setTimeout(() => this.$router.push('/dashboard'), 1000)
          }
        } catch(error) {
          return this.formError = error
        }
      }
    },
    isUserValid() {
      const validateSchema = schema.validate(this.user)

      if(!validateSchema.error)
        return true;
        
      if(validateSchema.error.message.includes('email'))
        this.formError = 'Email value must valid'
      else
        this.formError = 'Password value must valid'
        
      return false
    }
  }
}
</script>
