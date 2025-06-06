const mongoose = require('mongoose');

const CursoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  codigo: { type: String, required: true, unique: true },
  departamento: { type: String, required: true }
});

module.exports = mongoose.model('Curso', CursoSchema);
