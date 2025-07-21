const mongoose = require('mongoose');
const Profesor = require('../models/Profesor');
const Curso = require('../models/Curso');
const Comentario = require('../models/Comentario');
const Departamento = require('../models/Departamento');
const Sentiment = require('sentiment');
const sentiment = new Sentiment();
require('../config/db');

// Lista de profesores
const profesores = [
    {
        nombre: "URBANO, GRADOS Oscar Antonio",
        cursos: ["Base de Datos", "Sistemas Operativos", "Programación Web"]
    },
    {
        nombre: "CRUZ VERA, Manuel Jesús",
        cursos: ["Ingeniería de Software", "Desarrollo Web Avanzado", "Arquitectura de Software"]
    },
    {
        nombre: "VASQUEZ RAMOS, Laura Patricia",
        cursos: ["Sistemas Operativos", "Computación Paralela", "Fundamentos de Programación"]
    },
    {
        nombre: "MIRANDA LOPEZ, Carlos Eduardo",
        cursos: ["Base de Datos", "Minería de Datos", "Diseño de Bases de Datos"]
    },
    {
        nombre: "TORRES VALENCIA, Andrea María",
        cursos: ["Inteligencia Artificial", "Machine Learning", "Procesamiento de Lenguaje Natural"]
    }
];

// Función para generar comentarios aleatorios
function generarComentarios(profesor) {
    const comentarios = [];
    const cantidad = Math.floor(Math.random() * 3) + 13; // 13-15 comentarios

    const comentariosBase = [
        "Excelente metodología de enseñanza. Las explicaciones son claras y los ejemplos muy prácticos.",
        "El profesor demuestra gran dominio del tema. Sus clases son muy interactivas y productivas.",
        "Las evaluaciones son justas y reflejan bien el contenido del curso.",
        "Buena organización del curso, pero a veces va muy rápido con los temas.",
        "El material del curso está bien estructurado y actualizado.",
        "Siempre está dispuesto a resolver dudas y ayudar a los estudiantes.",
        "Las prácticas de laboratorio son muy útiles para reforzar lo aprendido.",
        "Falta más tiempo para practicar los conceptos en clase.",
        "El curso es exigente pero se aprende mucho.",
        "Muy buen manejo de las herramientas y tecnologías actuales.",
        "Las clases podrían ser más dinámicas.",
        "Los proyectos son desafiantes y ayudan a desarrollar habilidades prácticas.",
        "Excelente balance entre teoría y práctica.",
        "A veces las explicaciones son un poco confusas.",
        "El profesor muestra verdadero interés en el aprendizaje de los estudiantes."
    ];

    for (let i = 0; i < cantidad; i++) {
        const calificacion = Math.floor(Math.random() * 3) + 3; // 3-5
        const texto = comentariosBase[i % comentariosBase.length];
        const analisisSentimiento = sentiment.analyze(texto);

        comentarios.push({
            texto,
            calificacion,
            likes: Math.floor(Math.random() * 30),
            temas: ['metodología', 'organización', 'claridad'],
            analisisSentimiento: {
                score: analisisSentimiento.score,
                comparative: analisisSentimiento.comparative,
                tipo: calificacion >= 4 ? 'positivo' : 'neutral'
            }
        });
    }

    return comentarios;
}

// Función principal para poblar la base de datos
async function main() {
    try {
        console.log('Conectando a la base de datos...');
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/edufeedback');
        console.log('Conexión establecida');

        // Crear departamento si no existe
        const departamento = await Departamento.findOne({ nombre: "Ingeniería de Sistemas" });
        let departamentoId;
        
        if (!departamento) {
            const nuevoDepartamento = await Departamento.create({
                nombre: "Ingeniería de Sistemas",
                idFacultad: new mongoose.Types.ObjectId(), // ID temporal de facultad
                cursos: []
            });
            departamentoId = nuevoDepartamento._id;
            console.log('Departamento creado');
        } else {
            departamentoId = departamento._id;
        }

        // Limpiar datos existentes
        await Comentario.deleteMany({});
        console.log('Comentarios previos eliminados');
        
        // Crear los profesores si no existen
        for (const profesor of profesores) {
            let profesorDoc = await Profesor.findOne({ nombre: profesor.nombre });
            if (!profesorDoc) {                profesorDoc = await Profesor.create({
                    nombre: profesor.nombre,
                    departamento: departamentoId,
                    sede: "Principal",
                    correo: profesor.nombre.toLowerCase().replace(/, /g, '.').replace(/ /g, '.') + "@universidad.edu.pe"
                });
                console.log(`Profesor creado: ${profesor.nombre}`);
            }

            // Crear cursos para el profesor si no existen
            for (const nombreCurso of profesor.cursos) {
                const cursoExistente = await Curso.findOne({
                    nombre: nombreCurso,
                    profesor: profesorDoc._id
                });

                if (!cursoExistente) {
                    await Curso.create({
                        codigo: nombreCurso.substring(0, 3).toUpperCase() + Math.floor(Math.random() * 1000),
                        nombre: nombreCurso,
                        profesor: profesorDoc._id,
                        departamento: departamentoId
                    });
                    console.log(`Curso creado: ${nombreCurso} para ${profesor.nombre}`);
                }
            }
        }

        // Para cada profesor
        for (const profesor of profesores) {
            // Buscar al profesor en la base de datos
            const profesorDoc = await Profesor.findOne({ nombre: profesor.nombre });
            if (!profesorDoc) {
                console.log(`Profesor no encontrado: ${profesor.nombre}`);
                continue;
            }

            // Obtener sus cursos
            const cursos = await Curso.find({ profesor: profesorDoc._id });
            if (cursos.length === 0) {
                console.log(`No se encontraron cursos para: ${profesor.nombre}`);
                continue;
            }

            // Generar y guardar comentarios
            const comentarios = generarComentarios(profesor);
            for (const comentario of comentarios) {
                const cursoAleatorio = cursos[Math.floor(Math.random() * cursos.length)];
                const fechaAleatoria = new Date();
                fechaAleatoria.setMonth(fechaAleatoria.getMonth() - Math.floor(Math.random() * 6));

                const nuevoComentario = new Comentario({
                    idProfesor: profesorDoc._id,
                    nombreProfesor: profesor.nombre,
                    codigoCurso: cursoAleatorio.codigo,
                    nombreCurso: cursoAleatorio.nombre,
                    ...comentario,
                    fechaHora: fechaAleatoria
                });

                await nuevoComentario.save();
            }

            console.log(`Comentarios agregados para: ${profesor.nombre}`);
        }

        console.log('Proceso completado exitosamente');
        process.exit(0);
    } catch (error) {
        console.error('Error durante el proceso:', error);
        process.exit(1);
    }
}

main();
