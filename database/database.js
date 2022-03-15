const Sequelize = require('sequelize');

const connection = new Sequelize('guiaperguntas','root','335490Gu',{
  host: 'localhost',
  dialect: 'mysql'
}) // linkar banco de dados do mysql workbench aqui

module.exports = connection; // exportando objeto de conexao