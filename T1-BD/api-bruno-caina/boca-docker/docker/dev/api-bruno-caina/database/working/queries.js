const pool = require('../db')

const getWorkings = (request, response) => {
    pool.query('SELECT * FROM workingtable', (error, results) => {

        if (error) {
            throw error
        }

        response.status(200).json(results.rows)
    })
}

const getWorkingById = (request, response) => {
    const workingnumber = parseInt(request.params.id)
    pool.query('SELECT * FROM workingtable WHERE workingnumber = $1', [workingnumber], (error, results) => {
        if(error){
            throw error
        }

        if(results.rows.length == 0) {
            response.status(404).send({ message: "Working Not Found" })
        }
        else {
            response.status(200).json(results.rows)
        }
    })
}

const createWorking = (request, response) => {
    
    const {
        workingnumber,
        name,
        startdate,
        enddate,
        lastanswerdate,
        maxfilesize,
        createdat,
        updatedat,
        ismultilogin,
        deletedat
    } = request.body

    pool.query('SELECT * FROM workingtable WHERE workingnumber = $1', [workingnumber], (error, results) => {
        if(error){
            throw error
        }

        if(results.rows.length == 0) {
            pool.query('INSERT INTO workingtable ( workingnumber, name, startdate, enddate, lastanswerdate, maxfilesize, createdat, updatedat, ismultilogin, deletedat) VALUES ($1, $2, $3, $4, $5, $6, EXTRACT(EPOCH from NOW()), EXTRACT(EPOCH from NOW()), $7, $8)',
                [workingnumber, name, startdate, enddate, lastanswerdate, maxfilesize, ismultilogin, deletedat],
                (error, results) => {
        
                    if (error) {
                        throw error
                    }
        
                    response.status(201).send({ message: `Working added with ID: ${workingnumber}` })
                }
            )
        }
        else {
            response.status(409).send({ message: `Working with ID: ${workingnumber} already exists` })
        }
    })
}

const updateWorking = (request, response) => {
    const id = parseInt(request.params.id)
    const {
        workingnumber,
        name,
        startdate,
        enddate,
        lastanswerdate,
        maxfilesize,
        createdat,
        updatedat,
        ismultilogin,
        deletedat
    } = request.body

	if(workingnumber != id){
		response.status(404).send({ message: `Working ID (${id}) doesn't match with request body (${workingnumber})`})
	} else {
		pool.query(
            'UPDATE workingtable SET name = $2, startdate = $3, enddate = $4, lastanswerdate = $5, maxfilesize = $6, createdat = $7, updatedat = EXTRACT(EPOCH from NOW()), ismultilogin = $8, deletedat = $9 WHERE workingnumber = $1',
			[workingnumber, name, startdate, enddate, lastanswerdate, maxfilesize, createdat, ismultilogin, deletedat],
		    (error, results) => {

                if (error) {
                    throw error
                }

                response.status(200).send({ message: `Working modified with ID: ${id}` })
            }
		)
	}
  }

const deleteWorking = (request, response) => {
    const workingnumber = parseInt(request.params.id)

    pool.query('DELETE FROM problemtable WHERE workingnumber = $1', [workingnumber],(error, results) => {
        if(error){
            throw error
        }
    })

    pool.query('DELETE FROM userworkingtable WHERE workingnumber = $1', [workingnumber],(error, results) => {
        if(error){
            throw error
        }
    })

    pool.query('DELETE FROM workingtable WHERE workingnumber = $1', [workingnumber],(error, results) => {
        if(error){
            throw error
        }

        response.status(200).send({ message: `Working deleted with ID: ${workingnumber}` })
    })
}

const getUsersByWorkingId = (request, response) => {
    const workingnumber = parseInt(request.params.id)

    pool.query(`SELECT u.* FROM userworkingtable uw join usertable u on u.usernumber = uw.usernumber WHERE workingnumber = ${workingnumber}`, 
        (error, results) => {
        if(error){
            throw error
        }

        if(results.rows.length == 0) {
            response.status(404).send({ message: `No users were found with Working ID: ${workingnumber}` })
        }
        else {
            response.status(200).json(results.rows)
        }
    })
}

const createUserWorkingByWorkingId = (request, response) => {
    
    const workingnumber = parseInt(request.params.id)
    const usernumber = request.body.usernumber

    pool.query(`INSERT INTO userworkingtable (workingnumber, usernumber) VALUES ($1, $2)`,
        [workingnumber, usernumber],
        (error, results) => {

            if (error) {
                throw error
            }

            response.status(201).send({ message: `User ${usernumber} was successfully created with Working ID: ${workingnumber}` })
        }
    )
}

// const createUserWorking = (request, response) => {
    
//     const workingnumber = parseInt(request.params.id)

//     let users = request.body.users
//     let usersValues = ''

//     for (let index = 0; index < users.length; index++)
//         if(index == users.length-1)
//             usersValues += `(${workingnumber}, ${users[index]})`
//         else
//             usersValues += `(${workingnumber}, ${users[index]}), `
    
//     pool.query(`INSERT INTO userworkingtable (workingnumber, usernumber) VALUES ${usersValues}`,
//         (error, results) => {

//             if (error) {
//                 throw error
//             }

//             response.status(201).send({ message: `Users ${users} were successfully created with Working ID: ${workingnumber}` })
//         }
//     )
// }

const deleteUserWorkingByWorkingId = (request, response) => {

    const workingnumber = parseInt(request.params.id)

    pool.query(`DELETE FROM userworkingtable WHERE workingnumber = ${workingnumber}`, 
        (error, results) => {

        if(error){
            throw error
        }

        response.status(200).send({ message: `All Users from working list of Working ID: ${workingnumber}` })
    })
}

const getWorkingsByUserId = (request, response) => {
    const usernumber = parseInt(request.params.id)

    pool.query(`SELECT w.* FROM userworkingtable uw join workingtable w on w.workingnumber = uw.workingnumber WHERE usernumber = ${usernumber}`, 
        (error, results) => {
        if(error){
            throw error
        }

        if(results.rows.length == 0) {
            response.status(404).send({ message: `No Workings were found with User ID: ${usernumber}` })
        }
        else {
            response.status(200).json(results.rows)
        }
    })
}

const createUserWorkingByUserId = (request, response) => {
    
    const usernumber = parseInt(request.params.id)
    const workingnumber = request.body.workingnumber

    pool.query(`INSERT INTO userworkingtable (workingnumber, usernumber) VALUES ($1, $2)`,
        [workingnumber, usernumber],
        (error, results) => {

            if (error) {
                throw error
            }

            response.status(201).send({ message: `User ${usernumber} was successfully created with Working ID: ${workingnumber}` })
        }
    )
}

const deleteUserWorkingByUserId = (request, response) => {

    const usernumber = parseInt(request.params.id)

    pool.query(`DELETE FROM userworkingtable WHERE usernumber = ${usernumber}`, 
        (error, results) => {

        if(error){
            throw error
        }

        response.status(200).send({ message: `All Workings were removed from UserWorking list of User ID: ${usernumber}` })
    })
}

module.exports = { 
    getWorkings, getWorkingById, createWorking, updateWorking, deleteWorking, 
    getUsersByWorkingId, createUserWorkingByWorkingId, deleteUserWorkingByWorkingId, 
    getWorkingsByUserId, createUserWorkingByUserId, deleteUserWorkingByUserId 
};