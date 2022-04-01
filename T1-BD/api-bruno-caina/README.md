# boca-api

BOCA api é uma parte do projeto do boca com o intuito de fazermos requisições 

## REQUIREMENTS:

* Install [Docker Desktop/CE](https://www.docker.com/get-started).
* Install [Git](https://github.com/git-guides/install-git) (only for building and publishing).

## QUICK START:

* Open a Terminal window and make sure Docker Desktop/CE is up and running:

```bash
# List docker images
docker images -a
# List containers
docker container ls -a
```

* Download the file `docker-compose-prod.yml` and place it in the shell current directory. Recommendation: open the file in a text editor and change all database passwords. Then,

```bash
docker-compose -f docker-compose-prod.yml up -d
```

Voilà! The application should be running now. 

* Open a web browser and visit the URL http://localhost:8000/boca. First, create and activate a BOCA contest (user: system | password: boca). Then, login as admin  (user: admin | password: boca) to manage users, problems, languages etc. NOTE: consider changing these passwords later on.

* Autojudge will work only after restarting the boca-jail container.

```bash
docker stop docker stop boca-docker_boca-jail_1
docker start docker stop boca-docker_boca-jail_1
```

* To stop the application (considering that the shell is in the same directory):

```bash
docker-compose -f docker-compose-prod.yml down
```

## HOW TO BUILD IT:

* Clone this repo and set it as your working directory:

```bash
git clone https://github.com/UFES20212BDCOMP/api-bruno-caina.git
cd boca-docker
```

* Then, build the base image:

```bash
docker build -t boca-base .
```

* Next, compose it up with the command below (this might take a while, sit back and relax):

```bash
docker-compose -f docker-compose.yml -f docker-compose-dev.yml up -d --build
```

Follow the instructions above to set up the application.

* To stop it:

```bash
docker-compose -f docker-compose.yml -f docker-compose-dev.yml down
```

* Alternatively, it is possible to build images without launching the application.

```bash
docker build -t boca-web . -f docker/dev/web/Dockerfile
docker build -t boca-jail . -f docker/dev/jail/Dockerfile

```


### Instalação das dependências

Para iniciar o serviço para a API funcionar, você deve acessar a pasta:

```bash
cd boca-docker/docker/dev/api-bruno-caina
```
Depois que estiver na pasta você pode executar estes comandos:


O nosso projeto possui um framework para que caso seja feita alguma alteração a api restarte sem precisar que dê algum comando, logo, só executar o comando npm i ou npm install para instalar as dependências.

```bash
npm i
```

### Atualização do banco de dados

Antes de executar a API, o banco de dados deve ser ajustado. Para isso, você deverá conectar ao banco da aplicação utilizando o Database Management System de preferência, como Adminer, DBeaver ou BeeKeeper. Para conectar, utilize as seguintes credenciais:

```bash
    user: 'bocauser',
    host: 'localhost',
    database: 'bocadb',
    password: 'boca123',
    port: 5432
```

Então será necessário rodar as queries exibidas no arquivo FixDatabase.txt para atualizar as tabelas existente e criar as novas tabelas e relações, esses comandos devem ser executados em um Database Management de sua preferência, como por exemplos os que foram citados a cima.

Após instalar as dependências e ajustar o banco você irá iniciar a aplicação com 'npm start' você irá ver a seguinte execução:


```bash
npm start

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
```

Neste ponto, você poderá realizar as requisições à API utilizando o software Insomnia ou Postman, utilizando a url: http://0.0.0.0:3000

E pronto, porém você precisa do usuário e senha para fazer as requisições, você pode utilizar algum software para validar o banco do boca-postgres, os dados de usuário e senha vocẽ encontra no docker-compose-prod.yml e assim ver as credenciais.

### Finalizar a execução

Só executar Ctrl + C

## Como acessar os endpoints restritos

Com exceção do endpoint de login, todos os endpoints verificam um Bearer Token, no header da requisição.

Para conseguir o token, é necessário realizar o login na API pelo endpoint http://0.0.0.0:3000/api/user/login, com o seguinte objeto no Body da requisição:
{
    "username": "admin",
    "password": "7ab2d6e73d6ed4fb40fc1f97f051a183d01c3f469255b841a1cb529699310d28"
}

Qualquer outro usuário que esteja cadastrado, além do admin, poderá, também, realizar todas as requisições disponíveis. Para tanto, a requisição deve ser feita sempre com o header:
Authorization: Bearer < token >

## Decisões de Projeto:

A dupla optou por Node.js para a contrução da API por ser uma tecnologia com uma configuração inicial mais simples, quando comparada com outras no mercado. Utilizamos, também o Express para a implementação do roteamento da API. Na conversão de objetos para o formato json, foi utilizado o body-parser. E a bilbioteca JWT viabilizou a autenticação de usuários.

A dupla decidiu por utilizar uma arquitetura reduzida para a implementação da API considerando a simplicidade das regras de negócio do contexto. Portanto, foram implementados alguns poucos diretórios mais importantes. São eles o diretório principal boca-docker/docker/dev/api-bruno-caina, onde fica o index.js com a configuração de rotas da API, e o boca-docker/docker/dev/api-bruno-caina/database, onde se encontram os arquivos com as queries da API para o banco de dados.

## Modificações no Banco de Dados:

Neste projeto, algumas mudanças no banco de dados foram necessárias, seja para criação de novas
tabelas, seja para novas relações entre entidades que já existiam.

Uma tabela foi criada por conta da demanda do projeto de persistir dados de problemas e exercícios dentro de uma competição: a workingtable. Para relacionar a nova tabela workingtable com a tabela usertable com cardinalidade n para n, foi criada também, uma tabela de relacionamento chamada userworkingtable. Conforme pedido, uma terceira tabela foi criada para relacionar, de forma n para n, as tabelas langtable e problemtable, sendo chamada de problemlangtable. Para essas alterações, foram necessárias modificações nas configurações de alguns atributos em tabelas pré-existentes, como por exemplo uma adição da constraint langnumber_unique, no atributo langnumber, na tabela langtable.

Todas as modiciações na estrutura do banco de dados estão exibidas no arquivo boca-docker/docker/dev/api-bruno-caina/FixDatabase.txt. Também foi redigido um arquivo que garante a reversão desses comandos: boca-docker/docker/dev/api-bruno-caina/RevertDatabase.txt.

## HOW TO PUBLISH IT:

* After building, set the user and image tags accordingly. The IMAGE_ID's will show up with the `docker images -a`.

```bash
docker images -a
docker tag IMAGE_ID_BOCA_BASE ghcr.io/joaofazolo/boca-docker/boca-base:1.0.0
docker tag IMAGE_ID_BOCA_WEB ghcr.io/joaofazolo/boca-docker/boca-web:1.0.0
docker tag IMAGE_ID_BOCA_JAIL ghcr.io/joaofazolo/boca-docker/boca-jail:1.0.0
```

* Log in into GitHub's Container Registry using your username and personal access token (details [here](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry#authenticating-to-the-container-registry)).

        docker login ghcr.io

* Push the container images to repository.

```bash
docker push ghcr.io/joaofazolo/boca-docker/boca-base:1.0.0
docker push ghcr.io/joaofazolo/boca-docker/boca-web:1.0.0
docker push ghcr.io/joaofazolo/boca-docker/boca-jail:1.0.0
```

## LICENSE:

Copyright (C) 2020-2021 Joao Vitor Alves Fazolo, Rodrigo Laiola Guimaraes, Bruno Gomes de Azevedo and Cainã da Costa Jucá 

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.

This program is released under license GNU GPL v3+ license.

## SUPPORT:

Please report any issues with boca-docker at https://github.com/UFES20212BDCOMP/api-bruno-caina/issues
