const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const connection = require('./database/database') // importando objeto de conexao
const Pergunta = require('./database/Pergunta')
const Resposta = require('./database/Resposta')

// database

connection
  .authenticate()
  .then(() => {
    console.log('conexao feita com o banco de dados')
  })
  .catch(msgErro => {
    console.log(msgErro)
  })

//
app.set('view engine', 'ejs') // estou dizendo para o Express usar o EJS como View Engine
app.use(express.static('public')) // estou dizendo para o Express usar arquivos estaticos (css, js front-end, imagens, etc e tal)

// BODY PARSER
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// ROTAS
app.get('/', (req, res) => {
  Pergunta.findAll({
    raw: true,
    order: [
      ['id', 'DESC'] // 'DESC' = DECRESCENTE -- 'ASC' = CRESCENTE
    ]
  }).then(perguntas => {
    res.render('index', {
      perguntas: perguntas
    })
  })
})

app.get('/perguntar', (req, res) => {
  res.render('perguntar')
})
// ROTAS

// EENVIO DOS DADOS DO FORMULARIO
app.post('/savequestion', (req, res) => {
  let titulo = req.body.titulo
  let descricao = req.body.descricao
  Pergunta.create({
    titulo: titulo,
    descricao: descricao
  }).then(() => {
    res.redirect('/')
  })
})

app.get('/pergunta/:id', (req, res) => {
  var id = req.params.id
  Pergunta.findOne({
    where: { id: id }
  }).then(pergunta => {
    if (pergunta != undefined) {  //pergunta achada

        Resposta.findAll({
          where: {perguntaId: pergunta.id},
          order:[
            ['id', 'DESC']
          ]
        }).then(respostas =>{
            res.render('pergunta', {
              pergunta: pergunta,
              respostas: respostas
      })
        })
    } else {
      // pergunta nao encontrada
      res.redirect('/')
    }
  })
})

app.post("/responder",(req, res) => {
  let corpo = req.body.corpo;
  let perguntaId = req.body.pergunta;
  Resposta.create({
    corpo: corpo,
    perguntaId: perguntaId
  }).then(() => {
    res.redirect('/pergunta/'+perguntaId)
  })
});

app.listen(8080, () => {
  console.log('app rodandoo')
})
