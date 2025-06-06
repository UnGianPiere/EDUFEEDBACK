const mongoose = require('mongoose');

const CursoSchema = new mongoose.Schema({
  codigo: { type: String, required: true },
  nombre: { type: String, required: true },
  descripcion: { type: String, default: '' }
}, { _id: false });

const DepartamentoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  idFacultad: { type: mongoose.Schema.Types.ObjectId, ref: 'Facultad', required: true },
  cursos: [CursoSchema]
});

module.exports = mongoose.model('Departamento', DepartamentoSchema);
