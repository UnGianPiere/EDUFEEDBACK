const mongoose = require('mongoose');
const Comentario = require('../models/Comentario');
const Profesor = require('../models/Profesor');
const Curso = require('../models/Curso');
const Sentiment = require('sentiment');
const sentiment = new Sentiment();
require('../config/db');

async function agregarComentariosProfesor(nombreProfesor, comentarios) {
    try {
        const profesor = await Profesor.findOne({ nombre: nombreProfesor });
        if (!profesor) {
            console.log(`Profesor no encontrado: ${nombreProfesor}`);
            return;
        }

        const cursos = await Curso.find({ profesor: profesor._id });
        if (!cursos.length) {
            console.log(`No se encontraron cursos para: ${nombreProfesor}`);
            return;
        }

        for (const comentario of comentarios) {
            const cursoAleatorio = cursos[Math.floor(Math.random() * cursos.length)];
            const fechaAleatoria = new Date();
            fechaAleatoria.setMonth(fechaAleatoria.getMonth() - Math.floor(Math.random() * 6));

            const analisisSentimiento = sentiment.analyze(comentario.texto);

            await Comentario.create({
                idProfesor: profesor._id,
                nombreProfesor: profesor.nombre,
                codigoCurso: cursoAleatorio.codigo,
                nombreCurso: cursoAleatorio.nombre,
                calificacion: comentario.calificacion,
                texto: comentario.texto,
                fechaHora: fechaAleatoria,
                likes: comentario.likes || Math.floor(Math.random() * 30),
                temas: comentario.temas,
                analisisSentimiento: {
                    score: analisisSentimiento.score,
                    comparative: analisisSentimiento.comparative,
                    tipo: comentario.tipo
                }
            });
        }
        console.log(`Comentarios agregados para: ${nombreProfesor}`);
    } catch (error) {
        console.error(`Error al agregar comentarios para ${nombreProfesor}:`, error);
    }
}

async function main() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/edufeedback');
        console.log('Conexión a MongoDB establecida');

        await Comentario.deleteMany({});
        console.log('Comentarios previos eliminados');

        // URBANO, GRADOS Oscar Antonio
        await agregarComentariosProfesor('URBANO, GRADOS Oscar Antonio', [
            {
                texto: 'La clase empezó tarde y sin una estructura clara. Fue difícil seguir el tema.',
                calificacion: 2,
                likes: Math.floor(Math.random() * 15),
                temas: ['puntualidad', 'organización'],
                tipo: 'crítico'
            },
            {
                texto: 'El material está desactualizado y no refleja las tecnologías actuales.',
                calificacion: 2,
                likes: Math.floor(Math.random() * 15),
                temas: ['material', 'actualización'],
                tipo: 'crítico'
            },
            {
                texto: 'No responde bien a las dudas y a veces se molesta cuando preguntamos.',
                calificacion: 2,
                likes: Math.floor(Math.random() * 15),
                temas: ['resolución dudas', 'ejemplos'],
                tipo: 'crítico'
            },
            {
                texto: 'Las clases son monótonas y falta participación de los estudiantes.',
                calificacion: 2,
                likes: Math.floor(Math.random() * 15),
                temas: ['metodología', 'participación'],
                tipo: 'crítico'
            },
            {
                texto: 'Los exámenes no reflejan el contenido visto en clase.',
                calificacion: 2,
                likes: Math.floor(Math.random() * 15),
                temas: ['evaluación', 'coherencia'],
                tipo: 'crítico'
            }
        ]);

        // CAMBORDA, ZAMUDIO María Gabriela
        await agregarComentariosProfesor('CAMBORDA, ZAMUDIO María Gabriela', [
            {
                texto: 'Excelente profesora, muy dedicada y siempre dispuesta a ayudar.',
                calificacion: 5,
                likes: Math.floor(Math.random() * 30),
                temas: ['dedicación', 'apoyo'],
                tipo: 'positivo'
            },
            {
                texto: 'Sus explicaciones son muy claras y usa buenos ejemplos prácticos.',
                calificacion: 5,
                likes: Math.floor(Math.random() * 30),
                temas: ['claridad', 'ejemplos prácticos'],
                tipo: 'positivo'
            },
            {
                texto: 'Mantiene las clases interesantes y fomenta la participación.',
                calificacion: 5,
                likes: Math.floor(Math.random() * 30),
                temas: ['dinamismo', 'participación'],
                tipo: 'positivo'
            }
        ]);

        // Continuar con el resto de profesores y sus comentarios...

        console.log('Seed completado exitosamente');
        process.exit(0);
    } catch (error) {
        console.error('Error durante el seed:', error);
        process.exit(1);
    }
}

main();
