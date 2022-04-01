const pool = require('../db')

const getSiteById = (request, response) => {
    const sitenumber = parseInt(request.params.id_s)
    pool.query('SELECT * FROM sitetable WHERE sitenumber = $1', [sitenumber], (error, results) => {
        if(error){
            throw error
        }

        if(results.rows.length == 0) {
            response.status(404).send({ message: "Site Not Found"})
        }
        else {
            response.status(200).json(results.rows)
        }
    })
}

const updateSite = (request, response) => {
    const id = parseInt(request.params.id)
    const {
        sitenumber,
        siteip,
        sitename,
        siteactive,
        sitepermitlogins,
        sitelastmileanswer,
        sitelastmilescore,
        siteduration,
        siteautoend,
        sitejudging,
        sitetasking,
        siteglobalscore,
        sitescorelevel,
        sitenextuser,
        sitenextclar,
        sitenextrun,
        sitenexttask,
        sitemaxtask,

        sitechiefname,
        siteautojudge,
        sitemaxruntime,
        sitemaxjudgewaittime
    } = request.body;

    if(sitenumber != id){
        response.status(404).send({message: `Contest ID (${id}) doesn't match with request body (${contestnumber})`})
    } else {
        pool.query(
            'UPDATE sitetable SET siteip = $2, sitename = $3, siteactive = $4, sitepermitlogins = $5, sitelastmileanswer = $6, sitelastmilescore = $7, siteduration = $8, siteautoend = $9, sitejudging = $10, sitetasking = $11, siteglobalscore = $12, sitescorelevel = $13, sitenextuser = $14, sitenextclar = $15, sitenextrun = $16, sitenexttask = $17, sitemaxtask = $18, updatetime = EXTRACT(EPOCH from NOW()), sitechiefname = $19, sitemaxruntime = $20, sitemaxjudgewaittime = $21 WHERE sitenumber = $1',
            [ sitenumber, siteip, sitename, siteactive, sitepermitlogins, sitelastmileanswer, sitelastmilescore, siteduration, 
                siteautoend, sitejudging, sitetasking, siteglobalscore, sitescorelevel, sitenextuser, sitenextclar, sitenextrun, sitenexttask, 
                sitemaxtask, sitechiefname, siteautojudge, sitemaxruntime, sitemaxjudgewaittime],
            (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).send({message: `Contest modified with ID: ${id}`})
            }
        )
    }
}

const deleteSite = (request, response ) => {
    const sitenumber = parseInt(request.params.id_s)

    pool.query('DELETE FROM sitetable WHERE sitenumber = $1 ', [sitenumber], (error, results) => {
        if(error){
            throw error
        }

        response.status(200).send({message: `Contest deleted with ID: ${sitenumber}`})
    })
}

const createSite = (request, response) => {
    const {
        contestnumber,
        sitenumber,
        siteip,
        sitename,
        siteactive,
        sitepermitlogins,
        sitelastmileanswer,
        sitelastmilescore,
        siteduration,
        siteautoend,
        sitejudging,
        sitetasking,
        siteglobalscore,
        sitescorelevel,
        sitenextuser,
        sitenextclar,
        sitenextrun,
        sitenexttask,
        sitemaxtask,

        sitechiefname,
        siteautojudge,
        sitemaxruntime,
        sitemaxjudgewaittime
    } = request.body;

    pool.query('SELECT * FROM sitetable WHERE sitenumber = $1', [sitenumber], (error, results) => {
        if(error){
            throw error
        }
        if(results.rows.length == 0){
            pool.query(
                'INSERT INTO sitetable (contestnumber,  sitenumber, siteip, sitename, siteactive, sitepermitlogins, sitelastmileanswer, sitelastmilescore, siteduration, siteautoend, sitejudging, sitetasking, siteglobalscore, sitescorelevel, sitenextuser, sitenextclar, sitenextrun, sitenexttask, sitemaxtask, updatetime, sitechiefname, siteautojudge, sitemaxruntime, sitemaxjudgewaittime) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, EXTRACT(EPOCH from NOW()), $20, $21, $22, $23)',
                [ contestnumber,  sitenumber, siteip, sitename, siteactive, 
                    sitepermitlogins, sitelastmileanswer, sitelastmilescore, siteduration, siteautoend,
                    sitejudging, sitetasking, siteglobalscore, sitescorelevel, sitenextuser,
                    sitenextclar, sitenextrun, sitenexttask, sitemaxtask, sitechiefname, 
                    siteautojudge, sitemaxruntime, sitemaxjudgewaittime],
                (error, results) => {
                    if(error){
                        throw error
                    }

                    response.status(201).send({message: `Site added with ID: ${sitenumber}`})
                }
            )
        }
        else{
            response.status(409).send({message: `Site with ID: ${sitenumber} already exists`})
        }
    })
}

const getSiteByContest = (request, response) => {
    console.log("Contest by site",request.params)
    const contestnumber = parseInt(request.params.id)
    pool.query('SELECT * FROM sitetable WHERE contestnumber = $1', [contestnumber], (error, results) => {
        if(error){
            throw error
        }

        if(results.rows.length == 0) {
            response.status(404).send({ message: "Site Not Found"})
        }
        else {
            response.status(200).json(results.rows)
        }
    })
}

module.exports = {getSiteById, getSiteByContest, updateSite, createSite, deleteSite}