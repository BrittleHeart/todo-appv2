# Introduction

Simple ***todo-app***, inspired by [CodingGarden](https://www.youtube.com/channel/UCLNgu_OupwoeESgtab33CCw)

Project is using server-side for database querying, and layout for showing iformations for users

## Setup

To start this project, you need to as first go to ->

* [ ] -> Go to **server/** folder, and change database settings as follows:
    * -> 
        ```javascript
            import {Sequelize} from 'sequelize'

            /** 
            * FOR SQLITE
            */
            const connection = new Sequelize({
                dialect: 'sqlite',
                storage: 'path/to/database.sqlite'
            })

            /** 
            * FOR MYSQL | POSTGRES | MARIADB
            */
            const connection = new Sequelize('database', 'user', 'password', {
                host: 'host',
                dialect: 'mysql',

                pool: {
                    max: 5,
                    min: 0,
                    acquire: 30000,
                    idle: 10000
                }
            })

            export default connection
        ```
* [ ] -> Change the configuration files for ***logging***, and ***mailing*** located at **config/** folder if you need to, but this is not required.
* [ ] -> build the server for development / production with (Watch -> Development || Build -> Production)
    * -> 
        ```bash
            npm run build || npm run watch
        ```
* [ ] -> Start the server
    * ->
        ```bash
            npm start
        ```

### Project development Setup

* Server-side
    * [ ] -> Write the ***TodoController*** for saving logic.
    * [ ] -> Setup the mysql database
    * [ ] -> Create the CRUD implmentation
    * [ ] -> Create the backup for todo with maybe some file setup
* Frontend-side
    * [ ] -> Create the ***Vue3*** project
    * [ ] -> Create the main page like Hello in my todo-appv2 project
    * [ ] -> Create the login route
        * [ ] -> Create form for log in
        * [ ] -> Check user's passed data before letting him to login
        * [ ] -> If login successed, save the token sent by Server
        * [ ] -> Redirect to Todos
    * [ ] -> Create register route
        * [ ] -> Create form for register
        * [ ] -> Check user's passed data before letting him to register
        * [ ] -> If register successed, save the token sent by Server
        * [ ] -> Redirect to Todos
    * [ ] -> Create todo route
        * [ ] -> Check if token exists in the local storage
        * [ ] -> Show all Todos
        * [ ] -> Let user to add ned todo
