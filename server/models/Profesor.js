const mongoose = require('mongoose');

const ProfesorSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  sede: { type: String, required: true },
  correo: { type: String, default: '' },
  departamento: { type: mongoose.Schema.Types.ObjectId, ref: 'Departamento', required: true },
  cursos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Curso' }],
  comentarios: [{ type: String }]
});

module.exports = mongoose.model('Profesor', ProfesorSchema);
