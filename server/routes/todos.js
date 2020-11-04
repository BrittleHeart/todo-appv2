import {app} from '../server'
import TodoController from '../app/controllers/TodoController'
import { verifyJWTToken } from '../app/middlewares/verifyJWTToken'

const todo = new TodoController()

app.get('/api/v1/todos', verifyJWTToken, async (req, res) => await todo.index(req, res))
app.get('/api/v1/todos/:id', verifyJWTToken, async (req, res) => await todo.show(req, res))
app.post('/api/v1/todos/', verifyJWTToken, async (req, res) => await todo.store(req, res))
app.put('/api/v1/todos/:id', verifyJWTToken, async (req, res) => await todo.update(req, res))
app.delete('/api/v1/todos/:id', verifyJWTToken, async(req, res) => await todo.destroy(req, res))