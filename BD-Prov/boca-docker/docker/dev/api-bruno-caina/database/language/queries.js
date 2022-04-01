const pool = require('../db')

const getLanguages = (request, response) => {
    pool.query('SELECT * FROM langtable', (error, results) => {

        if (error) {
            throw error
        }

        response.status(200).json(results.rows)
    })
}

const getLanguageById = (request, response) => {
    const langnumber = parseInt(request.params.id)
    pool.query('SELECT * FROM langtable WHERE langnumber = $1', [langnumber], (error, results) => {
        if(error){
            throw error
        }

        if(results.rows.length == 0) {
            response.status(404).send({ message: "Language Not Found" })
        }
        else {
            response.status(200).json(results.rows)
        }
    })
}

const createLanguage = (request, response) => {
    
    const {
        contestnumber, 
        langnumber, 
        langname, 
        langextension, 
        updatetime
    } = request.body

    pool.query('SELECT * FROM langtable WHERE langnumber = $1', [langnumber], (error, results) => {
        if(error){
            throw error
        }

        if(results.rows.length == 0) {
            pool.query(
                'INSERT INTO langtable (contestnumber, langnumber, langname, langextension, updatetime) VALUES ($1, $2, $3, $4, EXTRACT(EPOCH from NOW()))',
                [contestnumber, langnumber, langname, langextension],
                (error, results) => {
        
                    if (error) {
                        throw error
                    }
        
                    response.status(201).send({ message: `Language added with ID: ${langnumber}` })
                }
            )
        }
        else {
            response.status(409).send({ message: `Language with ID: ${langnumber} already exists` })
        }
    })
}

const updateLanguage = (request, response) => {
    const id = parseInt(request.params.id)
    const {
        contestnumber, 
        langnumber, 
        langname, 
        langextension, 
        updatetime
    } = request.body

	if(langnumber != id){
		response.status(404).send({ message: `Language ID (${id}) doesn't match with request body (${langnumber})`})
	} else {
		pool.query(
            'UPDATE langtable SET contestnumber = $1, langname = $3, langextension = $4, updatetime = EXTRACT(EPOCH from NOW()) WHERE langnumber = $2',
			[contestnumber, langnumber, langname, langextension],
            (error, results) => {

                if (error) {
                    throw error
                }

                response.status(200).send({ message: `Language modified with ID: ${id}` })
            }
		)
	}
  }

const deleteLanguage = (request, response) => {
    const langnumber = parseInt(request.params.id)

    pool.query('DELETE FROM langtable WHERE langnumber = $1', [langnumber],(error, results) => {
        if(error){
            throw error
        }

        response.status(200).send({ message: `Language deleted with ID: ${langnumber}` })
    })
}

module.exports = { getLanguages, getLanguageById, createLanguage, updateLanguage, deleteLanguage};