const pool = require("../db");

const getRun = (request, response) => {
  pool.query("SELECT * FROM runtable", (error, results) => {
    if (error) {
      throw error;
    }

    response.status(200).json(results.rows);
  });
};

const getRunById = (request, response) => {
  const contestnumber = parseInt(request.params.id);
  pool.query(
    "SELECT * FROM runtable WHERE contestnumber = $1",
    [contestnumber],
    (error, results) => {
      if (error) {
        throw error;
      }

      if (results.rows.length == 0) {
        response.status(404).send({ message: "Contest Not Found" });
      } else {
        response.status(200).json(results.rows);
      }
    }
  );
};

const createRun = (request, response) => {
  const {
    contestnumber,
    runsitenumber,
    runnumber,
    usernumber,
    rundate,
    rundatediff,
    rundatediffans,
    runproblem,
    runfilename,
    rundata,
    runanswer,
    runstatus,
    runjudge,
    runjudgesite,
    runanswer1,
    runjudge1,
    runjudgesite1,
    runanswer2,
    runjudge2,
    runjudgesite2,
    runlangnumber,
    autoip,
    autobegindate,
    autoenddate,
    autoanswer,
    autostdout,
    autostderr,
    updatetime,
  } = request.body;
  pool.query(
    "INSERT INTO runtable ( contestnumber, runsitenumber, runnumber, usernumber, rundate, rundatediff, rundatediffans, runproblem, runfilename, rundata, runanswer, runstatus, runjudge, runjudgesite, runanswer1, runjudge1, runjudgesite1, runanswer2, runjudge2, runjudgesite2, runlangnumber, autoip, autobegindate, autoenddate, autoanswer, autostdout, autostderr, updatetime ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, EXTRACT(EPOCH from NOW()))",
    [
      contestnumber,
      runsitenumber,
      runnumber,
      usernumber,
      rundate,
      rundatediff,
      rundatediffans,
      runproblem,
      runfilename,
      rundata,
      runanswer,
      runstatus,
      runjudge,
      runjudgesite,
      runanswer1,
      runjudge1,
      runjudgesite1,
      runanswer2,
      runjudge2,
      runjudgesite2,
      runlangnumber,
      autoip,
      autobegindate,
      autoenddate,
      autoanswer,
      autostdout,
      autostderr
    ],
    (error, results) => {
      if (error) {
        throw error;
      }

      response
        .status(201)
        .send({ message: `Run added with ID: ${contestnumber}` });
    }
  );
};

const updateRun = (request, response) => {
  const id = parseInt(request.params.id);
  const {
    contestnumber,
    runsitenumber,
    runnumber,
    usernumber,
    rundate,
    rundatediff,
    rundatediffans,
    runproblem,
    runfilename,
    rundata,
    runanswer,
    runstatus,
    runjudge,
    runjudgesite,
    runanswer1,
    runjudge1,
    runjudgesite1,
    runanswer2,
    runjudge2,
    runjudgesite2,
    runlangnumber,
    autoip,
    autobegindate,
    autoenddate,
    autoanswer,
    autostdout,
    autostderr,
    updatetime,
  } = request.body;

  if (contestnumber != id) {
    response
      .status(404)
      .send({
        message: `Run ID (${id}) doesn't match with request body (${contestnumber})`,
      });
  } else {
    pool.query(
      "UPDATE runtable SET runsitenumber = $2, runnumber = $3, usernumber = $4, rundate = $5, rundatediff = $6, rundatediffans = $7, runproblem = $8, runfilename = $9, rundata = $10, runanswer = $11, runstatus = $12, runjudge = $13, runjudgesite = $14, runanswer1 = $15, runjudge1 = $16, runjudgesite1 = $17, runanswer2 = $18, runjudge2 = $19, runjudgesite2 = $20, runlangnumber = $21, autoip = $22, autobegindate = $23, autoenddate = $24, autoanswer = $25, autostdout = $26, autostderr = $27, updatetime = EXTRACT(EPOCH from NOW()) WHERE contestnumber = $1",
      [
        contestnumber,
        runsitenumber,
        runnumber,
        usernumber,
        rundate,
        rundatediff,
        rundatediffans,
        runproblem,
        runfilename,
        rundata,
        runanswer,
        runstatus,
        runjudge,
        runjudgesite,
        runanswer1,
        runjudge1,
        runjudgesite1,
        runanswer2,
        runjudge2,
        runjudgesite2,
        runlangnumber,
        autoip,
        autobegindate,
        autoenddate,
        autoanswer,
        autostdout,
        autostderr
      ],
      (error, results) => {
          if(error){
              throw error
          }
          response.status(200).send({message: `Run modified with ID: ${id}`})
      }
    );
  }
};

const deleteRun = (request, response) => {
    const contestnumber = parseInt(request.params.id)

    pool.query('DELETE FROM runtable WHERE contestnumber = $1', [contestnumber],(error, results) => {
        if(error){
            throw error
        }

        response.status(200).send({ message: `Run deleted with ID: ${contestnumber}` })
    })
}

module.exports = {getRun, createRun, getRunById, deleteRun, updateRun}