const pool = require('../db')
const jwt = require('jsonwebtoken')

const getUsers = (request, response) => {
    pool.query('SELECT * FROM usertable', (error, results) => {

        if (error) {
            throw error
        }

        response.status(200).json(results.rows)
    })
}

const getUserById = (request, response) => {
    const usernumber = parseInt(request.params.id)
    pool.query('SELECT * FROM usertable WHERE usernumber = $1', [usernumber], (error, results) => {
        if(error){
            throw error
        }

        if(results.rows.length == 0) {
            response.status(404).send({ message: "User Not Found" })
        }
        else {
            response.status(200).json(results.rows)
        }
    })
}

const createUser = (request, response) => {
    
    const { contestnumber, usersitenumber, usernumber, username, userfullname, userdesc, usertype, userenabled, usermultilogin, userpassword,
        userip, userlastlogin, usersession, usersessionextra, userlastlogout, userpermitip, userinfo, updatetime, usericpcid
    } = request.body

    pool.query('SELECT * FROM usertable WHERE usernumber = $1', [usernumber], (error, results) => {
        if(error){
            throw error
        }

        if(results.rows.length == 0) {
            pool.query(
                'INSERT INTO usertable ( contestnumber, usersitenumber, usernumber, username, userfullname, userdesc, usertype, userenabled, usermultilogin, userpassword, userip, userlastlogin, usersession, usersessionextra, userlastlogout, userpermitip, userinfo, updatetime, usericpcid) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, EXTRACT(EPOCH from NOW()), $18)',
                [contestnumber, usersitenumber, usernumber, username, userfullname, userdesc, usertype, userenabled, usermultilogin, userpassword, 
                    userip, userlastlogin, usersession, usersessionextra, userlastlogout, userpermitip, userinfo, usericpcid],
                (error, results) => {
        
                    if (error) {
                        throw error
                    }
        
                    response.status(201).send({ message: `User added with ID: ${usernumber}` })
                }
            )
        }
        else {
            response.status(409).send({ message: `User with ID: ${usernumber} already exists` })
        }
    })
}

const updateUser = (request, response) => {
    const id = parseInt(request.params.id)
    const { usernumber, username, userfullname, userdesc, usertype, userenabled, usermultilogin, userpassword,
        userip, userlastlogin, usersession, usersessionextra, userlastlogout, userpermitip, userinfo, updatetime, usericpcid
    } = request.body

	if(usernumber != id){
		response.status(404).send({ message: `Contest ID (${id}) doesn't match with request body (${contestnumber})` })
	} else {
		pool.query(
            'UPDATE usertable SET username = $2, userfullname = $3, userdesc = $4, usertype = $5, userenabled = $6, usermultilogin = $7, userpassword = $8, userip = $9, userlastlogin = $10, usersession = $11, usersessionextra = $12, userlastlogout = $13, userpermitip = $14, userinfo = $15, updatetime = EXTRACT(EPOCH from NOW()), usericpcid = $16 WHERE usernumber = $1',
            [ usernumber, username, userfullname, userdesc, usertype, userenabled, usermultilogin, userpassword, 
                userip, userlastlogin, usersession, usersessionextra, userlastlogout, userpermitip, userinfo, usericpcid],
		  (error, results) => {
		   if (error) {
			 throw error
		   }
		   response.status(200).send({ message: `Contest modified with ID: ${id}` })
		  }
		)
	}
}

const deleteUser = (request, response) => {
    const usernumber = parseInt(request.params.id)

    pool.query('DELETE FROM usertable WHERE usernumber = $1', [usernumber],(error, results) => {
        if(error){
            throw error
        }

        response.status(200).send({ message: `Contest deleted with ID: ${usernumber}` })
    })
}

const login = (request, response) => {
    
    const { username, password } = request.body

    pool.query(
        'SELECT usernumber, username, userpassword FROM usertable WHERE username = $1 LIMIT 1', 
        [ username ], (error, results) => {
            if(results.rowCount == 0) {
                response.status(401).send({ message: `No user found with username = ${username}` })
            }
            else {
                
                let user = results.rows[0]

                if(password == user.userpassword) {
                    let token = jwt.sign({
                        usernumber: user.usernumber,
                        username: user.username
                    }, 
                    process.env.JWT_KEY, {
                        expiresIn: "12h"
                    })

                    response.status(200).send({
                        message: 'You have successfully logged in',
                        token: token
                    })
                }
                else {
                    response.status(401).send({ message: `Access denied` })
                }
            }
        }
    )
}

const logout = (request, response) => {
    
    response.cookie('jwt', '', { maxAge: 1 })

    response.status(200).send({
        message: 'You have successfully logged out'
    })
}

module.exports = { getUsers, createUser, getUserById, deleteUser, updateUser, login, logout };