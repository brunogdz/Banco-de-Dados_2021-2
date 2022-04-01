const pool = require('../db')

const getAnswer = (request, response) => {
    pool.query('SELECT * FROM answertable', (error, results) => {

        if (error) {
            throw error
        }

        response.status(200).json(results.rows)
    })
}

const getAnswerById = (request, response) => {
    const contestnumber = parseInt(request.params.id)
    pool.query('SELECT * FROM answertable WHERE contestnumber = $1', [contestnumber], (error, results) => {
        if(error){
            throw error
        }

        if(results.rows.length == 0) {
            response.status(404).send({ message: "Contest Not Found"})
        }
        else {
            response.status(200).json(results.rows)
        }
    })
}

const createAnswer = (request, response) => {
    
    const {
        contestnumber,
        answernumber,
        runanswer,
        yes,
        fake,
        updatetime,
    } = request.body

    pool.query('INSERT INTO answertable (contestnumber, answernumber, runanswer, yes, fake, updatetime) VALUES ($1, $2, $3, $4, $5, EXTRACT(EPOCH from NOW()))',
        [contestnumber, answernumber, runanswer, yes, fake],
        (error, results) => {

            if (error) {
                throw error
            }

            response.status(201).send({ message: `Answer added with ID: ${contestnumber}`})
        }
    )
}

const updateAnswer = (request, response) => {
    const id = parseInt(request.params.id)
    const {
        contestnumber,
        answernumber,
        runanswer,
        yes,
        fake,
        updatetime,
    } = request.body

	if(contestnumber != id){
		response.status(404).send({ message: `Contest ID (${id}) doesn't match with request body (${contestnumber})`})
	} else {
		pool.query(
			  'UPDATE answertable SET answernumber = $2, runanswer = $3, yes = $4, fake = $5, updatetime = EXTRACT(EPOCH from NOW()) WHERE contestnumber = $1',
			[contestnumber, answernumber, runanswer, yes, fake],
		  (error, results) => {
		   if (error) {
			 throw error
		   }
		   response.status(200).send({ message: `Contest modified with ID: ${id}`})
		  }
		)
	}
  }

const deleteAnswer = (request, response) => {
    const contestnumber = parseInt(request.params.id)

    pool.query('DELETE FROM answertable WHERE contestnumber = $1', [contestnumber],(error, results) => {
        if(error){
            throw error
        }

        response.status(200).send({ message: `Contest deleted with ID: ${contestnumber}`})
    })
}

module.exports = { getAnswer, createAnswer, getAnswerById, deleteAnswer, updateAnswer};