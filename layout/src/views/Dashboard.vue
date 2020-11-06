<template>
  <div class="dashboard">
    <section class="dashboard__heading">
      <h1 class="dashboard__header">Dashboard</h1>
      <p class="dashboard__user">Hello {{userName}} 😎</p>
    </section>
    <section class="dashboard__todos">
      <section class="todos__list--wrapper">
        <h2 class="todos__list__header">All todos</h2>
        <ul class="todos__list" v-if="todos.length > 0">
          <li class="todos__list--item" v-for="(todo, index) in todos" :key="todo.todoId" :class="{'done': todo.is_completed, 'notDone': !todo.is_completed}">
            <span >{{todo.name}}</span>
            <span class="actions">
              <i class="item__action" @click="done(todo.todoId, index, todo)">Mark as done</i>
              <i class="item__action">Edit</i>
              <i class="item__action" @click="deleteTodo(todo.todoId, index)">Delete</i>
            </span>
          </li>
        </ul>
        <h5 class="no-content" v-else>No content</h5>
      </section>
      <section class="todos__form">
        <h2 class="todos__form__header">Add new Todo</h2>
        <form class="form" @submit.prevent="saveTodo()">
          <div class="form-group">
            <p class="error" v-if="formError">{{formError}}</p>
          </div>
          <div class="form-group">
            <label for="name">Name: </label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              placeholder="Type a name of todo" 
              v-model="todo.name"
              autocomplete="off">
          </div>
          <div class="form-group">
            <label for="content">Content:</label>
            <input 
              type="text" 
              id="content" 
              name="content" 
              placeholder="Type a name of todo" 
              v-model="todo.content"
              autocomplete="off">
          </div>
          <div class="action">
            <button type="submit" class="button" v-if="sending">
              <div class="spinner">
                <font-awesome-icon icon="spinner" class="spinner--icon"></font-awesome-icon>
              </div>
            </button>
            <button type="submit" class="button" v-else>
              Add new
            </button>
          </div>
        </form>
      </section>
    </section>
  </div>
</template>

<script>
import {decode} from '../utils/decodeJWTToken'
import axios from 'axios'
import Joi from 'joi'

export default {
  data: () => ({
    todo: {
      name: '',
      content: ''
    },
    userName: '',
    formError: '',
    sending: false,
    todos: []
  }),
  methods: {
    async saveTodo() {
      if(this.validate()) {
        this.formError = ''
        this.sending = true
        try {
          const response = await axios.post('http://localhost:3000/api/v1/todos', 
          this.todo, {headers: {Authorization: localStorage.getItem('token')}})

          this.sending = false

          switch(response.status)
          {
            case 400:
              this.formError = "Bad request"
              break;
            case 500:
              this.formError = "Server error"
              break;
          }

          this.todo.name = ''
          this.todo.content = ''

          const {data} = response
          if(response.status === 201 && data.todo)
            return this.todos.push(data.todo)
          else
            return this.formError = 'Could not add new Todo'
        } catch(error) {this.formError = error}
      }
    },

    validate() {
      const schema = Joi.object().keys({
        name: Joi.string().trim().min(4).max(40).required(),
        content: Joi.string().trim().min(5).max(255).required()
      })

      const validate = schema.validate(this.todo)

      if(!validate.error)
        return true
      
      if(validate.error.message.includes('name'))
        this.formError = 'Name must be valid'
      else
        this.formError = 'Content must be valid'

      return false
    },
    async deleteTodo(todoIndex, index) {
        try {
          const findTodo = this.todos.find(todo => todo.todoId === todoIndex)
          console.log(findTodo);
          const response = await axios.delete(`http://localhost:3000/api/v1/todos/${findTodo.todoId}`, {headers: {Authorization: localStorage.getItem('token')}})
          
          if(response.status === 200)
            this.todos.splice(index, 1);
        } catch (e) {this.formError = e}
    },
    async done(todoIndex, index, todo) {
      try {
          let findTodo = this.todos.find(todo => todo.todoId === todoIndex)
          const response = await axios.put(`http://localhost:3000/api/v1/todos/${findTodo.todoId}/done`, {}, {headers: {Authorization: localStorage.getItem('token')}})

          return todo.is_completed = true
        } catch (e) {this.formError = e}
        
    }
  },
  created() {
    axios.get('http://localhost:3000/api/v1/todos', {headers: {Authorization: localStorage.getItem('token')}})
            .then(response => {
              const {data} = response

              if(data.todos.length > 0)
                return this.todos = data.todos
            })
            .catch(error => this.formError = error)
    const token = localStorage.getItem('token')
    const decodedToken = decode(token)
    this.userName = decodedToken.name
  }
}
</script>

<style scoped>
.dashboard {
  width: 100%;
  max-width: 100%;
}

.done {border-left: 3px solid green;}
.notDone {border-left: 3px solid rgba(130, 130, 130, .6);}

.dashboard .dashboard__heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  width: 30%;
  max-width: 30%;
  margin: 30px auto;
  border-bottom: 1px solid rgba(130, 130, 130, .6);
  font-size: 1.5rem;
}

.dashboard .dashboard__todos {
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}

@keyframes spinAround {
    0% {
        transform: translate3D(-50%, -50%, 0) rotate(0deg);
    }
    100% {
        transform: translate3D(-50%, -50%, 0) rotate(360deg);
    }
}

.dashboard .dashboard__todos .todos__form .spinner {
  font-size: 3rem;
  width: 50%;
  max-width: 50%;
  position: absolute;
  left: 50%;
  right: 50%;
  transform: translate(0, -50%);
  margin: 0 auto;
  animation:  1.5s infinite spinAround;
  position: absolute;
}

.dashboard .dashboard__todos .todos__list--wrapper {
  width: 50%;
  max-width: 50%;
  margin: 0 auto;
  border-right: 1px solid rgba(130, 130, 130, .6);
}

.todos__list--wrapper .todos__list__header {
  width: 90%;
  max-width: 90%;
  font-size: 3rem;
  line-height: 2;
}

.todos__list--wrapper .todos__list {
  list-style: none;
}

.todos__list--wrapper .todos__list--item {
  display: flex;
  margin: 20px 0;
  justify-content: space-between;
  width: 70%;
  max-width: 70%;
  padding: 10px 7px;
  background-color: rgba(251, 251, 251, .6);
}

.todos__list--wrapper .todos__list--item .actions .item__action {
  margin: 0 10px;
  cursor: pointer;
}

.todos__list--wrapper .todos__list--item .actions .item__action:hover:first-child {
  color: grey;
}

.todos__list--wrapper .todos__list--item .actions .item__action:hover:nth-child(2) {
  color: blue;
}

.todos__list--wrapper .todos__list--item .actions .item__action:hover:nth-child(3) {
  color: red;
}

.dashboard .dashboard__todos .todos__form {
  width: 40%;
  max-width: 60%;
  margin: 0 auto;
}

.dashboard .dashboard__todos .todos__form .todos__form__header {
  font-size: 3rem;
  line-height: 2;
}

.todos__form .form {
  width: 100%;
  max-width: 100%;
}

.todos__form .form .action {
  display: flex;
  align-items: flex-end;
}

.todos__form .form .action button {
    width: 15%;
    padding: 10px;
    background: none;
    border: 1px solid rgba(60, 60, 60, .76);
    border-radius: 3px;
    font-size: 1.2rem;
    color: rgba(60, 60, 60, .7);
    cursor: pointer;
    transition: background-color, color .6s ease;
    position: relative;
}

.todos__form .form .action button:hover {
  background-color: rgba(60, 60, 60, .7);
  color: white;
}

.todos__form .form .form-group {
  margin: 30px auto;
}

.todos__form .form .form-group label {
  font-size: 1.4rem;
  display: block;
  margin: 10px auto;
}

.todos__form .form .form-group input {
  width: 90%;
  max-width: 90%;
  padding: 10px;
  margin: 10px 0;
}

.error {
  width: 90%;
  max-width: 90%;
  margin: 20px 0;
  background-color: rgb(230, 36, 36);
  color: white;
  padding: 15px;
  border-radius: 5px;
  font-weight: 600;
}

.no-content {
  font-size: 2rem;
  text-align: center;
  color:  rgba(130, 130, 130, .6);
}
</style>