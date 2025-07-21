const mongoose = require('mongoose');
const Profesor = require('../models/Profesor');
const Curso = require('../models/Curso');
const Comentario = require('../models/Comentario');
const AnalisisProfesor = require('../models/AnalisisProfesor');
const Sentiment = require('sentiment');
const sentiment = new Sentiment();
const db = require('../config/db');

// Función para generar un número aleatorio de likes
const getRandomLikes = () => Math.floor(Math.random() * 50);

// Función para generar una fecha aleatoria en los últimos 90 días
const getRandomDate = () => new Date(Date.now() - Math.floor(Math.random() * 7776000000));

// Base de comentarios genéricos que se pueden personalizar
const comentariosBase = {
  positivos: [
    { texto: "Excelente metodología de enseñanza, explica con mucha claridad.", calificacion: 5 },
    { texto: "Las clases son muy dinámicas y participativas.", calificacion: 5 },
    { texto: "Siempre está dispuesto a resolver dudas fuera de clase.", calificacion: 5 },
    { texto: "Sus ejemplos prácticos ayudan mucho a entender la teoría.", calificacion: 5 },
    { texto: "Mantiene el contenido actualizado y relevante.", calificacion: 5 },
    { texto: "Muy organizado con el material del curso.", calificacion: 4 },
    { texto: "Buena comunicación con los estudiantes.", calificacion: 4 },
    { texto: "Los proyectos son desafiantes pero muy formativos.", calificacion: 4 },
    { texto: "Evalúa de manera justa y transparente.", calificacion: 4 },
    { texto: "Demuestra dominio completo de los temas.", calificacion: 5 }
  ],
  neutros: [
    { texto: "Las clases son buenas pero podrían ser más dinámicas.", calificacion: 3 },
    { texto: "Conoce el tema pero a veces le cuesta transmitirlo.", calificacion: 3 },
    { texto: "El contenido es interesante pero falta más práctica.", calificacion: 3 },
    { texto: "Cumple con lo básico del curso.", calificacion: 3 },
    { texto: "Las evaluaciones son algo complicadas pero justas.", calificacion: 3 }
  ],
  críticos: [
    { texto: "Las clases necesitan mejor estructura y organización.", calificacion: 2 },
    { texto: "Falta más retroalimentación en los trabajos.", calificacion: 2 },
    { texto: "El material de estudio no está bien organizado.", calificacion: 2 },
    { texto: "Las explicaciones son confusas y poco claras.", calificacion: 1 },
    { texto: "No responde dudas adecuadamente.", calificacion: 1 }
  ]
};

async function poblarComentarios() {
  await db();
  
  // Obtener todos los profesores
  const profesores = await Profesor.find({});
  
  for (const profesor of profesores) {
    console.log(`Procesando profesor: ${profesor.nombre}`);
    
    // Obtener los cursos del profesor
    const cursos = await Curso.find({ _id: { $in: profesor.cursos } });
    if (!cursos.length) {
      console.log(`No se encontraron cursos para el profesor: ${profesor.nombre}`);
      continue;
    }

    // Determinar el número de comentarios a crear (entre 10 y 13)
    const numComentarios = 10 + Math.floor(Math.random() * 4);
    
    // Distribuir los tipos de comentarios
    const distribucion = {
      positivos: Math.floor(numComentarios * 0.7), // 70% positivos
      neutros: Math.floor(numComentarios * 0.2),   // 20% neutros
      críticos: Math.floor(numComentarios * 0.1)   // 10% críticos
    };

    // Asegurarse de que la suma sea igual a numComentarios
    const total = distribucion.positivos + distribucion.neutros + distribucion.críticos;
    if (total < numComentarios) {
      distribucion.positivos += numComentarios - total;
    }

    // Array para almacenar todos los comentarios a crear
    const comentariosACrear = [];

    // Generar comentarios según la distribución
    for (const tipo in distribucion) {
      const cantidad = distribucion[tipo];
      const comentariosTipo = comentariosBase[tipo];
      
      for (let i = 0; i < cantidad; i++) {
        const comentarioBase = comentariosTipo[Math.floor(Math.random() * comentariosTipo.length)];
        const cursoAleatorio = cursos[Math.floor(Math.random() * cursos.length)];
        
        comentariosACrear.push({
          idEstudiante: "anonimo",
          idProfesor: profesor._id,
          nombreProfesor: profesor.nombre,
          codigoCurso: cursoAleatorio.codigo,
          nombreCurso: cursoAleatorio.nombre,
          texto: comentarioBase.texto,
          calificacion: comentarioBase.calificacion,
          likes: getRandomLikes(),
          fechaHora: getRandomDate(),
          analisisSentimiento: sentiment.analyze(comentarioBase.texto)
        });
      }
    }

    // Insertar comentarios
    for (const comentario of comentariosACrear) {
      try {
        await Comentario.create(comentario);
        console.log(`Comentario insertado para ${profesor.nombre} - ${comentario.nombreCurso}`);
      } catch (error) {
        console.error(`Error al insertar comentario: ${error.message}`);
      }
    }

    // Actualizar análisis del profesor
    try {
      let analisis = await AnalisisProfesor.findOne({ idProfesor: profesor._id });
      const calificacionPromedio = comentariosACrear.reduce((acc, curr) => acc + curr.calificacion, 0) / comentariosACrear.length;
      
      if (!analisis) {
        analisis = new AnalisisProfesor({
          idProfesor: profesor._id,
          totalComentarios: comentariosACrear.length,
          calificacionPromedio,
          distribucionSentimientos: {
            positivos: distribucion.positivos,
            neutrales: distribucion.neutros,
            negativos: distribucion.críticos
          }
        });
      } else {
        analisis.totalComentarios = comentariosACrear.length;
        analisis.calificacionPromedio = calificacionPromedio;
        analisis.distribucionSentimientos = {
          positivos: distribucion.positivos,
          neutrales: distribucion.neutros,
          negativos: distribucion.críticos
        };
      }
      await analisis.save();
    } catch (error) {
      console.error(`Error al actualizar análisis del profesor: ${error.message}`);
    }
  }
  
  mongoose.disconnect();
}

poblarComentarios().then(() => {
  console.log('Seed de comentarios completa.');
  process.exit(0);
}).catch(err => {
  console.error('Error en el seed:', err);
  mongoose.disconnect();
  process.exit(1);
});
