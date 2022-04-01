# Primeiros passos

## Como rodar

Primeiramente, com o banco de dados já iniciado, você precisará fazer um login para conseguir fazer as requisições, caso tenha o acesso como admin por exemplo.

### Instalação das dependências

O nosso projeto possui um framework para que caso seja feita alguma alteração a api restarte sem precisar que dê algum comando, logo, só executar o comando npm i ou npm install para instalar as dependências.

### Atualização do banco de dados

Antes de executar a API, o banco de dados deve ser consertado. Para isso, você deverá conectar ao banco da aplicação utilizando o Database Management System de preferência. Então será necessário rodar as queries exibidas no arquivo FixDatabase.txt para atualizar as tabelas existente e criar as novas tabelas e relações.

### Execução

Feita a instalação e a atualização do banco, basta executar o comando: npm start

Você vai ver que está em execução na porta 3000 

### Finalizar a execução

Só executar ctrl + C 

## Tabelas

No projeto possui endpoints para as seguintes tabelas do banco:
 
- User
- Run
- Contest
- Site
- Problem
- Answer


## Como acessar os endpoints restritos

Com exceção do endpoint de login, todos os endpoints verificam um Bearer Token, no header da requisição.

Para conseguir o token, é necessário realizar o login na API pelo endpoint http://0.0.0.0:3000/api/user/login, com o seguinte objeto no Body da requisição:
{
    "username": "admin",
    "password": "7ab2d6e73d6ed4fb40fc1f97f051a183d01c3f469255b841a1cb529699310d28"
}

Qualquer outro usuário que esteja cadastrado, além do admin, poderá, também, realizar todas as requisições disponíveis. Para tanto, a requisição deve ser feita sempre com o header:
Authorization: Bearer <token>

bruno@bruno-pc:~/Desktop/T1-BD/boca-docker/api$ npm start

> docker_api_bruno_caina@1.0.0 start /home/bruno/Desktop/T1-BD/boca-docker/api
> nodemon index.js

[nodemon] 2.0.15
[nodemon] reading config ./nodemon.json
[nodemon] to restart at any time, enter `rs`
[nodemon] or send SIGHUP to 49356 to restart
[nodemon] ignoring: .git ./node_modules/**/*
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node index.js`
[nodemon] forking
[nodemon] child pid: 49370
[nodemon] watching 16 files
Running on http://0.0.0.0:3000


