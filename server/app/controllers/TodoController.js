import * as os from 'os'
import * as fs from 'fs'
import * as path from 'path'
import Todo from '../Todo'
const yup = require('yup')

class TodoController {
    saveToFile(req) {
        const userInfo = {
            user_platform: os.type(),
            userBrowser: req.headers['user-agent'],
            user_ip: os.networkInterfaces()
        }

        const directory = path.resolve(__dirname,'../storage/')
        const token = req.header('Authorization')

        fs.mkdir(`${directory}/users_info/${token}/`, () => {})

        return fs.appendFile(`${directory}/users_info/${token}/info.json`, `${JSON.stringify(userInfo, null, 2)}\n\n\n`, () => {})
    }

    /**
     * Selects all the data from database
     * 
     * @param {Object} req 
     * @param {Object} res 
     * @return {Response<Express>} response
     */
    async index(req, res) {
        const todos = await Todo.findAll()

        if(!todos.length)
            return res.status(200).json({todos, status: 200})
        
        return res.status(200).json({todos})
    }

    /**
     * Shows the Todo data where :id = todo id
     * 
     * @param {Object} req 
     * @param {Object} res 
     * @return {Response<Express>} response
     */
    async show(req, res) {
        const {id} = req.params

        if(!id || isNaN(id))
            return res.status(400).json({status: 400, message: 'Id param must exists and must be integer'})

        const todo = await Todo.findOne({where: {todoId: id}})

        if(!todo)
            return res.status(404).json({todos: [], status: 404})
        
        return res.status(200).json({todo})
    }

    /**
     * Creates new Todo
     * 
     * @param {Object} req 
     * @param {Object} res 
     * @return {Response<Express>} response
     */
    async store(req, res) {
        const {name, content} = req.body

        const schema = yup.object().shape({
            name: yup.string().min(4).max(40).trim().required(),
            content: yup.string().min(5).max(255).trim().required(),
        })

        try {await schema.validate({name, content})}
        catch(error) {return res.status(500).json({message: error.message})}

        const todo = await Todo.create({name, content, is_completed: false})

        if(!todo)
            return res.status(500).json({message: 'Could not create an Todo', status: 500})

        this.saveToFile(req)

        return res.status(201).json({todo})
    }

    /**
     * Updated the Todo content
     * 
     * @param {Object} req 
     * @param {Object} res 
     * @return {Response<Express>} response
     */
    async update(req, res) {
        const {name, content} = req.body
        const {id} = req.params

        if(!id || isNaN(id))
            return res.status(400).json({status: 400, message: 'Id param must exists and must be integer'})

        const schema = yup.object().shape({
            name: yup.string().min(4).max(10).trim().required(),
            content: yup.string().min(5).max(255).trim().required(),
        })

        const escpaed_name = escape(name)
        const escpaed_content = escape(content)

        try {await schema.validate({name, content})}
        catch(error) {return res.status(500).json({message: error.message})}

        const todo = await Todo.findOne({where: {todoId: id}})
        
        if(!todo.length)
            return res.status(404).json({todo, status: 404})
        
        const update_todo = await todo.update({name: escpaed_name, content: escpaed_content})

        if(!update_todo)
            return res.status(500).json({message: 'Could not update the todo', status: 500})

        return res.status(200).json({update_todo})
    }

    async markAsDone(req, res) {
        const {id} = req.params

        if(!id || isNaN(id))
            return res.status(400).json({status: 400, message: 'Id param must exists and must be integer'})

        const todo = await Todo.findOne({where: {todoId: id}})
        
        if(todo.length === 0)
            return res.status(404).json({todo, status: 404})
            
        const doneTodo = await todo.update({is_completed: true})
    
        if(!doneTodo)
            return res.status(500).json({message: 'Could not update the todo', status: 500})
    
        return res.status(200)
    }

    /**
     * Deletes todo with :id = todo id
     * 
     * @param {Object} req 
     * @param {Object} res 
     * @return {Response<Express>} response
     */
    async destroy(req, res) {
        const {id} = req.params

        if(!id || isNaN(id))
            return res.status(400).json({status: 400, message: 'Id param must exists and must be integer'})

        const todo = await Todo.findOne({where: {todoId: id}})

        if(!todo)
            return res.status(404).json({status: 404, message: `Wait! Todo with id = ${id} does not exists`})

        await Todo.destroy({where: {todoId: id}})

        return res.status(200).json({status: 200, message: `Todo with id = ${id} has been deleted`})
    }
}

export default TodoController