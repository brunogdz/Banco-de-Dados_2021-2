const pool = require('../db')

const getProblems = (request, response) => {
    pool.query('SELECT * FROM problemtable', (error, results) => {

        if (error) {
            throw error
        }

        response.status(200).json(results.rows)
    })
}

const getProblemById = (request, response) => {
    const problemnumber = parseInt(request.params.id)
    pool.query('SELECT * FROM problemtable WHERE problemnumber = $1', [problemnumber], (error, results) => {
        if(error){
            throw error
        }

        if(results.rows.length == 0) {
            response.status(404).send({ message: "Problem Not Found" })
        }
        else {
            response.status(200).json(results.rows)
        }
    })
}

const createProblem = (request, response) => {

    const { 
        contestnumber, problemnumber, problemname, problemfullname, problembasefilename, probleminputfilename, probleminputfile, 
        probleminputfilehash, fake, problemcolorname, problemcolor, updatetime, workingnumber
    } = request.body

    pool.query('SELECT * FROM problemtable WHERE problemnumber = $1', [problemnumber], (error, results) => {
        if(error){
            throw error
        }

        if(results.rows.length == 0) {
            pool.query(
                'INSERT INTO problemtable ( contestnumber, problemnumber, problemname, problemfullname, problembasefilename, probleminputfilename, probleminputfile, probleminputfilehash, fake, problemcolorname, problemcolor, updatetime, workingnumber) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, EXTRACT(EPOCH from NOW()), $12)',
                [contestnumber, problemnumber, problemname, problemfullname, problembasefilename, probleminputfilename, probleminputfile, 
                    probleminputfilehash, fake, problemcolorname, problemcolor, workingnumber],
                (error, results) => {
        
                    if (error) {
                        throw error
                    }
        
                    response.status(201).send({ message: `Problem added with ID: ${problemnumber}` })
                }
            )
        }
        else {
            response.status(409).send({ message: `Problem with ID: ${problemnumber} already exists` })
        }
    })
}

const updateProblem = (request, response) => {
    const id = parseInt(request.params.id)
    const { problemnumber, problemname, problemfullname, problembasefilename, probleminputfilename, probleminputfile, 
        probleminputfilehash, fake, problemcolorname, problemcolor, updatetime, workingnumber
    } = request.body

	if(problemnumber != id){
		response.status(404).send({ message: `Problem ID (${id}) doesn't match with request body (${problemnumber})` })
	} else {
		pool.query(
            'UPDATE problemtable SET problemname = $2, problemfullname = $3, problembasefilename = $4, probleminputfilename = $5, probleminputfile = $6, probleminputfilehash = $7, fake = $8, problemcolorname = $9, problemcolor = $10, updatetime = EXTRACT(EPOCH from NOW()), workingnumber = $11 WHERE problemnumber = $1',
            [ problemnumber, problemname, problemfullname, problembasefilename, probleminputfilename, probleminputfile, 
                probleminputfilehash, fake, problemcolorname, problemcolor, workingnumber],
		  (error, results) => {
		   if (error) {
			 throw error
		   }
		   response.status(200).send({ message: `Problem modified with ID: ${id}` })
		  }
		)
	}
}

const deleteProblem = (request, response) => {

    const problemnumber = parseInt(request.params.id)

    pool.query('DELETE FROM problemtable WHERE problemnumber = $1', [problemnumber],(error, results) => {
        if(error){
            throw error
        }

        response.status(200).send({ message: `Problem deleted with ID: ${problemnumber}`})
    })
}

const getProblemLanguages = (request, response) => {
    const problemnumber = parseInt(request.params.id)

    pool.query(
        'SELECT l.* FROM problemtable p JOIN problemlangtable pl ON pl.problemnumber = p.problemnumber JOIN langtable l ON l.langnumber = pl.langnumber WHERE p.problemnumber = $1',
        [problemnumber],
        (error, results) => {

        if (error) {
            throw error
        }

        response.status(200).json(results.rows)
    })
}

const createProblemLanguage = (request, response) => {
    const id_p = parseInt(request.params.id)
    
    const { langnumber } = request.body

    if(id_p == null || langnumber == null)
        response.status(400).send({ message: `Malformed request syntax` })

    pool.query('SELECT * FROM problemtable WHERE problemnumber = $1', [id_p], (error, results) => {
        if(error){
            throw error
        }

        if(results.rows.length == 0) {
            response.status(404).send({ message: `Problem with ID: ${id_p} doesn't exist` })
        } else {
            pool.query('SELECT * FROM langtable WHERE langnumber = $1', [langnumber], (error, results) => {
                if(error){
                    throw error
                }
        
                if(results.rows.length == 0) {
                    response.status(409).send({ message: `Language with ID: ${langnumber} doesn't exist` })
                } else {
                    pool.query(
                        'INSERT INTO problemlangtable (problemnumber, langnumber) VALUES ($1, $2)',
                        [id_p, langnumber],
                        (error, results) => {
                            if (error) {
                                response.status(404).send({ message: `Relation already exists` })
                            }

                            response.status(201).send({ message: `Language ID: ${langnumber} added to Problem ID: ${id_p} list` })
                        }
                    )
                }
                
            })
        }
    })
}

const deleteProblemLanguage = (request, response) => {

    const id_p = parseInt(request.params.id)

    pool.query('SELECT * FROM problemlangtable WHERE problemnumber = $1', [id_p], (error, results) => {
        if(error){
            throw error
        }

        if(results.rows.length == 0) {
            response.status(404).send({ message: `There are no relations with Problem ID: ${id_p}` })
        }
        else {
            pool.query('DELETE FROM problemlangtable WHERE problemnumber = $1', [id_p], (error, results) => {
                if(error){
                    throw error
                }

                response.status(200).send({ message: `Relation deleted` })
            })
        }
    })
}

module.exports = { getProblems, getProblemById, createProblem, updateProblem, deleteProblem, getProblemLanguages, createProblemLanguage, deleteProblemLanguage };