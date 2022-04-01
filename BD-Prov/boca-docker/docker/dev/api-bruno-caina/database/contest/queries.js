const pool = require('../db')

const getContests = (request, response) => {
    pool.query('SELECT * FROM contesttable', (error, results) => {

        if (error) {
            throw error
        }

        response.status(200).json(results.rows)
    })
}

const getContestById = (request, response) => {
    const contestnumber = parseInt(request.params.id)
    pool.query('SELECT * FROM contesttable WHERE contestnumber = $1', [contestnumber], (error, results) => {
        if(error){
            throw error
        }

        if(results.rows.length == 0) {
            response.status(404).send({ message: "Contest Not Found" })
        }
        else {
            response.status(200).json(results.rows)
        }
    })
}

const createContest = (request, response) => {
    
    const {
        contestnumber,
        conteststartdate,
        contestduration,
        contestlastmileanswer,
        contestlastmilescore,
        contestlocalsite,
        contestpenalty,
        contestmaxfilesize,
        contestactive,
        contestmainsite,
        contestname,
        contestkeys,
        contestunlockkey,
        contestmainsiteurl
    } = request.body

    pool.query('SELECT * FROM contesttable WHERE contestnumber = $1', [contestnumber], (error, results) => {
        if(error){
            throw error
        }

        if(results.rows.length != 0) {
            response.status(404).send({ message: `Contest with ID: ${contestnumber} doesn't exist` })
        }
        else {
            pool.query('INSERT INTO contesttable (contestnumber, conteststartdate, contestduration, contestlastmileanswer, contestlastmilescore, contestlocalsite, contestpenalty, contestmaxfilesize,contestactive,contestmainsite,updatetime,contestname,contestkeys,contestunlockkey,contestmainsiteurl) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, EXTRACT(EPOCH from NOW()), $11, $12, $13, $14)',
                [contestnumber, conteststartdate, contestduration, contestlastmileanswer, contestlastmilescore, contestlocalsite, contestpenalty, contestmaxfilesize,contestactive,contestmainsite,contestname,contestkeys,contestunlockkey,contestmainsiteurl],
                (error, results) => {

                    if (error) {
                        throw error
                    }

                    response.status(201).send({ messsage: `Contest added with ID: ${contestnumber}` })
                }
            )
        }
    })
}

const updateContest = (request, response) => {
    const id = parseInt(request.params.id)
    const {
        contestnumber,
        conteststartdate,
        contestduration,
        contestlastmileanswer,
        contestlastmilescore,
        contestlocalsite,
        contestpenalty,
        contestmaxfilesize,
        contestactive,
        contestmainsite,
        updatetime,
        contestname,
        contestkeys,
        contestunlockkey,
        contestmainsiteurl
    } = request.body

	if(contestnumber != id){
		response.status(404).send({ message: `Contest ID (${id}) doesn't match with request body (${contestnumber})`})
	} else {
		pool.query(
			  'UPDATE contesttable SET conteststartdate = $2, contestduration = $3, contestlastmileanswer = $4, contestlastmilescore = $5, contestlocalsite = $6, contestpenalty = $7, contestmaxfilesize = $8, contestactive = $9, contestmainsite = $10, updatetime = EXTRACT(EPOCH from NOW()), contestname = $11, contestkeys = $12, contestunlockkey = $13, contestmainsiteurl = $14 WHERE contestnumber = $1',
			[contestnumber, conteststartdate, contestduration, contestlastmileanswer, contestlastmilescore, contestlocalsite, 
				contestpenalty, contestmaxfilesize, contestactive, contestmainsite, contestname, contestkeys, contestunlockkey, contestmainsiteurl],
		  (error, results) => {
		   if (error) {
			 throw error
		   }
		   response.status(200).send({ message: `Contest modified with ID: ${id}` })
		  }
		)
	}
  }

const deleteContest = (request, response) => {
    const contestnumber = parseInt(request.params.id)

    pool.query('DELETE FROM contesttable WHERE contestnumber = $1', [contestnumber],(error, results) => {
        if(error){
            throw error
        }

        response.status(200).send({ message: `Contest deleted with ID: ${contestnumber}` })
    })
}

module.exports = { getContests, createContest, getContestById, deleteContest, updateContest};