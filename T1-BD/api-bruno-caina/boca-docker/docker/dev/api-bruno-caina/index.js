// Libraries
const express = require('express');
const bodyParser = require('body-parser')
const authenticate = require('./middleware/authenticate')

// Database
const contest = require('./database/contest/queries')
const site = require('./database/site/queries');
const user = require('./database/user/queries')
const problem = require('./database/problem/queries')
const answer = require('./database/answer/queries')
const language = require('./database/language/queries')
const run = require('./database/run/queries')
const working = require('./database/working/queries')

// Constants
const PORT = 3000;
const HOST = '0.0.0.0';

// App
const app = express();
const jsonParser = bodyParser.json()

// Contest Routes
app.get('/api/contest', authenticate, contest.getContests)
app.get('/api/contest/:id', authenticate, contest.getContestById)
app.post('/api/contest', jsonParser, authenticate, contest.createContest)
app.put('/api/contest/:id', jsonParser, authenticate, contest.updateContest)
app.delete('/api/contest/:id', authenticate, contest.deleteContest)

// Site Routes
app.put('/api/site/:id_s', jsonParser, site.updateSite)
app.post('/api/contest/:id/site',  jsonParser, site.createSite)
app.delete('/api/site/:id_s', site.deleteSite)
app.get('api/contest/:id_s/site', authenticate, site.getSiteByContest)
app.get('/api/site/:id_s', authenticate, site.getSiteById)

// Answer Routes
app.get('/api/answer', authenticate, answer.getAnswer)
app.get('/api/problem/:id/answer', authenticate, answer.getAnswerByContestId)
app.post('/api/answer', jsonParser, authenticate, answer.createAnswer)
app.delete('/api/problem/:id/answer', authenticate, answer.deleteAnswerByContestId)
app.put('/api/problem/:id/answer', jsonParser, authenticate, answer.updateAnswer)

// Language Routes
app.get('/api/language', authenticate, language.getLanguages)
app.get('/api/language/:id/', authenticate, language.getLanguageById)
app.post('/api/language', jsonParser, authenticate, language.createLanguage)
app.put('/api/language/:id', jsonParser, authenticate, language.updateLanguage)
app.delete('/api/language/:id', authenticate, language.deleteLanguage)

// User Routes
app.get('/api/user', authenticate, user.getUsers)
app.get('/api/user/:id', authenticate, user.getUserById)
app.post('/api/user', jsonParser, authenticate, user.createUser)
app.put('/api/user/:id', jsonParser, authenticate, user.updateUser)
app.delete('/api/user/:id', authenticate, user.deleteUser)

app.post('/api/user/login', jsonParser, user.login)
app.post('/api/user/logout', jsonParser, authenticate, user.logout)

// Run Routes
app.get('/api/run', authenticate, run.getRun)
app.get('/api/run/:id', authenticate, run.getRunById)
app.post('/api/run', jsonParser, authenticate, run.createRun)
app.put('/api/run/:id', jsonParser, authenticate, run.updateRun)
app.delete('/api/run/:id', authenticate, run.deleteRun)

// Problem Routes
app.get('/api/problem/', authenticate, problem.getProblems)
app.get('/api/problem/:id', authenticate, problem.getProblemById)
app.post('/api/problem/', jsonParser, authenticate, problem.createProblem)
app.put('/api/problem/:id', jsonParser, authenticate, problem.updateProblem)
app.delete('/api/problem/:id', authenticate, problem.deleteProblem)

app.get('/api/problem/:id/language', authenticate, problem.getProblemLanguages)
app.post('/api/problem/:id/language', jsonParser, authenticate, problem.createProblemLanguage)
app.delete('/api/problem/:id/language', authenticate, problem.deleteProblemLanguage)

// Working Routes
app.get('/api/working', authenticate, working.getWorkings)
app.get('/api/working/:id', authenticate, working.getWorkingById)
app.post('/api/working', jsonParser, authenticate, working.createWorking)
app.put('/api/working/:id', jsonParser, authenticate, working.updateWorking)
app.delete('/api/working/:id', authenticate, working.deleteWorking)

app.get('/api/working/:id/user', authenticate, working.getUsersByWorkingId)
app.post('/api/working/:id/user', jsonParser, authenticate, working.createUserWorkingByWorkingId)
app.delete('/api/working/:id/user', authenticate, working.deleteUserWorkingByWorkingId)

app.get('/api/user/:id/working', authenticate, working.getWorkingsByUserId)
app.post('/api/user/:id/working', jsonParser, authenticate, working.createUserWorkingByUserId)
app.delete('/api/user/:id/working', authenticate, working.deleteUserWorkingByUserId)

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);