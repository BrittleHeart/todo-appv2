<template>
  <div class="login">
    <h1 class="login__header">Sign In</h1>
    <div v-if="loggedIn" class="login__loader">
      <font-awesome-icon icon="spinner" class="icon"></font-awesome-icon>
    </div>
    <p v-if="formError" class="error">{{formError}}</p>
    <form @submit.prevent="login()" v-if="!loggedIn && !invalidCredentials" class="form">
      <div class="form-group">
        <label for="email">Email:</label>
        <input 
          type="text" 
          name="email" 
          id="email" 
          placeholder="Type your email.." 
          v-model="user.email" 
          required
          autocomplete="off"
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
          autocomplete="off"
          role="input">
        <h5 class="text-muted">Type your password (min: 7 characters):</h5>

      </div>
      <div class="action">
        <button type="submit" class="button">Sign in</button>
      </div>
    </form>
    <div v-if="invalidCredentials" class="form__invalid">
      <h1 class="invalid__header">Invalid credentials</h1>
      <button @click="invalidCredentials = false" class="button">Try again</button>
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
            return setTimeout(() => {this.$router.push('/dashboard'), 2000})
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

<style scoped>
  @keyframes spinAround {
      0% {
          transform: translate3d(-50%, -50%, 0) rotate(0deg);
      }
      100% {
          transform: translate3d(-50%, -50%, 0) rotate(360deg);
      }
  }

  .login {
    width: 30%;
    max-width: 30%;
    margin: 50px auto;
    text-align: center;
    background-color: rgba(250, 250, 250, .9);
    padding: 10px;
    border-radius: 20px;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    position: relative;
  }

  .login .error {
    width: 90%;
    max-width: 90%;
    margin: 20px auto;
    background-color: rgb(230, 36, 36);
    color: white;
    padding: 15px;
    border-radius: 5px;
    font-weight: 600;
  }

  .login .login__loader {
    font-size: 3rem;
    width: 50%;
    max-width: 50%;
    position: absolute;
    left: 50%;
    right: 50%;
    transform: translate(0, -50%);
    margin: 50px auto;
    animation:  1.5s linear infinite spinAround;
  }

  .login .form__invalid {
    margin: 20px auto;
  }

  .login .form__invalid button {
    font-size: 1.6rem;
  }

  .login .form__invalid .invalid__header {
    font-size: 3rem;
    line-height: 2;
    margin-bottom: 20px;
  }

  .login__header {
    width: 90%;
    max-width: 90%;
    margin: 0 auto;
    font-size: 3rem;
    border-bottom: 1px solid #ccc;
    padding: 10px;
  }

  .login .form {
    margin: 30px auto;
    width: 60%;
    max-width: 60%;
  }

  .login .form .form-group {
    line-height: 2;
    margin: 40px auto;
  }

  .login .form .form-group label {
    display: block;
    text-align: left;
    font-size: 1.4rem;
  }

  .login .form .form-group input {
    width: 100%;
    max-width: 100%;
    padding: 5px;
    margin: 10px auto;
    outline: none;
  }

  .login .form .form-group h5 {
    text-align: left;
  }

  .action {
    display: flex;
    align-items: flex-end;
  }
  .button {
    width: 30%;
    padding: 5px;
    background: none;
    border: 1px solid rgba(60, 60, 60, .76);
    font-size: 1.2rem;
    color: rgba(60, 60, 60, .7);
    cursor: pointer;
    transition: background-color, color .6s ease;
  }

  .button:hover {
    background-color: rgba(60, 60, 60, .7);
    color: white;
  }
</style>