const mongoose = require('mongoose');
const Profesor = require('../models/Profesor');
const Curso = require('../models/Curso');
const Comentario = require('../models/Comentario');
const AnalisisProfesor = require('../models/AnalisisProfesor');
const Sentiment = require('sentiment');
const sentiment = new Sentiment();
const db = require('../config/db');

async function seed() {
    try {
        // Usar la conexión existente
        console.log('Iniciando seed de comentarios...');

        // Limpiar comentarios existentes
        await Comentario.deleteMany({});
        console.log('Comentarios previos eliminados');

        // Para cada profesor en el array
        for (const { profesor, comentarios } of comentariosPorProfesor) {
            // Buscar el profesor
            const profesorDoc = await Profesor.findOne({ nombre: profesor });
            if (!profesorDoc) {
                console.log(`Profesor no encontrado: ${profesor}`);
                continue;
            }

            // Buscar los cursos del profesor
            const cursos = await Curso.find({ profesor: profesorDoc._id });

            // Para cada comentario del profesor
            for (const comentario of comentarios) {
                const cursoAleatorio = cursos[Math.floor(Math.random() * cursos.length)];

                // Generar fecha aleatoria en los últimos 6 meses
                const fechaAleatoria = new Date();
                fechaAleatoria.setMonth(fechaAleatoria.getMonth() - Math.floor(Math.random() * 6));                // Formatear el nombre del profesor para mostrar
                const nombreProfesorPartes = profesor.split(",");
                const nombreProfesorFormateado = nombreProfesorPartes.length > 1
                    ? `${nombreProfesorPartes[1].trim()} ${nombreProfesorPartes[0].trim()}`
                    : profesor;

                // Generar fortalezas y áreas de mejora basadas en el tipo de comentario
                const fortalezas = [];
                const areasAMejorar = [];
                
                if (comentario.tipo === "positivo") {
                    fortalezas.push(...comentario.temas);
                } else if (comentario.tipo === "crítico" || comentario.tipo === "negativo") {
                    areasAMejorar.push(...comentario.temas);
                }

                // Generar un resumen basado en el tipo de comentario
                let resumen = "";
                if (comentario.tipo === "positivo") {
                    resumen = "Comentario positivo destacando fortalezas en la enseñanza";
                } else if (comentario.tipo === "crítico") {
                    resumen = "Comentario constructivo con sugerencias de mejora";
                } else {
                    resumen = "Comentario identificando áreas que necesitan atención";
                }                // Verificar si el comentario ya existe
                const existe = await Comentario.findOne({
                    idProfesor: profesorDoc._id,
                    texto: comentario.texto,
                    codigoCurso: cursoAleatorio ? cursoAleatorio.codigo : 'SIN-CODIGO'
                });

                if (existe) {
                    console.log(`Comentario duplicado omitido para ${profesor}`);
                    continue;
                }

                // Crear el comentario
                const nuevoComentario = new Comentario({
                    idEstudiante: "anonimo",
                    idProfesor: profesorDoc._id,
                    nombreProfesor: profesor,
                    nombreProfesorFormateado: nombreProfesorFormateado,
                    codigoCurso: cursoAleatorio ? cursoAleatorio.codigo : 'SIN-CODIGO',
                    nombreCurso: cursoAleatorio ? cursoAleatorio.nombre : 'Sin Curso Asignado',
                    calificacion: comentario.calificacion,
                    texto: comentario.texto,
                    fechaHora: fechaAleatoria,
                    likes: comentario.likes,
                    analisis: {
                        sentimiento: comentario.tipo === "positivo" ? "Positivo" : 
                        comentario.tipo === "crítico" ? "Crítico (constructivo)" : "Negativo",
                        temas: comentario.temas,
                        fortalezas: fortalezas,
                        areasAMejorar: areasAMejorar,
                        resumen: resumen
                    }
                });

                await nuevoComentario.save();
            }
            console.log(`Comentarios agregados para: ${profesor}`);
        }

        console.log('Seed completado exitosamente');
        process.exit(0);
    } catch (error) {
        console.error('Error durante el seed:', error);
        process.exit(1);
    }
}

const comentariosPorProfesor = [
    {
        profesor: "ALMIDON, ORTIZ Carlos",
        comentarios: [
            {
                texto: "Excelente dominio de las matemáticas discretas, explica con claridad.",
                calificacion: 5,
                likes: Math.floor(Math.random() * 30),
                temas: ["conocimiento", "claridad"],
                tipo: "positivo"
            },
            {
                texto: "Sus ejercicios son muy bien estructurados y ayudan a entender.",
                calificacion: 5,
                likes: Math.floor(Math.random() * 30),
                temas: ["ejercicios", "metodología"],
                tipo: "positivo"
            },
            {
                texto: "Siempre está dispuesto a resolver dudas adicionales.",
                calificacion: 4,
                likes: Math.floor(Math.random() * 30),
                temas: ["atención", "disposición"],
                tipo: "positivo"
            },
            {
                texto: "Las evaluaciones son justas y acordes al contenido.",
                calificacion: 4,
                likes: Math.floor(Math.random() * 30),
                temas: ["evaluación"],
                tipo: "positivo"
            },
            {
                texto: "El ritmo de la clase es muy acelerado para temas complejos.",
                calificacion: 3,
                likes: Math.floor(Math.random() * 20),
                temas: ["ritmo", "complejidad"],
                tipo: "crítico"
            },
            {
                texto: "Faltan más ejemplos prácticos y aplicaciones reales.",
                calificacion: 2,
                likes: Math.floor(Math.random() * 15),
                temas: ["ejemplos prácticos"],
                tipo: "negativo"
            }
        ]
    },
    {
        profesor: "CERRON, OCHOA Juan Silvio",
        comentarios: [
            {
                texto: "Excelente profesor, explica muy bien y con paciencia.",
                calificacion: 5,
                likes: Math.floor(Math.random() * 30),
                temas: ["pedagogía", "paciencia"],
                tipo: "positivo"
            },
            {
                texto: "Sus ejemplos prácticos son muy útiles para entender la programación.",
                calificacion: 5,
                likes: Math.floor(Math.random() * 30),
                temas: ["ejemplos prácticos", "programación"],
                tipo: "positivo"
            },
            {
                texto: "Fomenta la participación y hace la clase dinámica.",
                calificacion: 4,
                likes: Math.floor(Math.random() * 30),
                temas: ["participación", "dinamismo"],
                tipo: "positivo"
            },
            {
                texto: "Muy bueno explicando conceptos complejos de manera simple.",
                calificacion: 4,
                likes: Math.floor(Math.random() * 30),
                temas: ["explicaciones", "simplicidad"],
                tipo: "positivo"
            },
            {
                texto: "Las tareas podrían tener mejor retroalimentación.",
                calificacion: 3,
                likes: Math.floor(Math.random() * 20),
                temas: ["retroalimentación", "tareas"],
                tipo: "crítico"
            },
            {
                texto: "A veces avanza muy rápido con temas nuevos.",
                calificacion: 2,
                likes: Math.floor(Math.random() * 15),
                temas: ["ritmo", "temas nuevos"],
                tipo: "negativo"
            }
        ]
    },
    {
        profesor: "CASAYCO, CONTRERAS Yan Francis",
        comentarios: [
            {
                texto: "Gran conocimiento en sistemas de información y arquitectura.",
                calificacion: 5,
                likes: Math.floor(Math.random() * 30),
                temas: ["conocimiento", "sistemas"],
                tipo: "positivo"
            },
            {
                texto: "Excelente en relacionar la teoría con casos reales.",
                calificacion: 5,
                likes: Math.floor(Math.random() * 30),
                temas: ["aplicación práctica", "casos reales"],
                tipo: "positivo"
            },
            {
                texto: "Las evaluaciones son justas y bien estructuradas.",
                calificacion: 4,
                likes: Math.floor(Math.random() * 30),
                temas: ["evaluaciones", "estructura"],
                tipo: "positivo"
            },
            {
                texto: "Buen manejo de herramientas y tecnologías actuales.",
                calificacion: 4,
                likes: Math.floor(Math.random() * 30),
                temas: ["tecnología", "actualización"],
                tipo: "positivo"
            },
            {
                texto: "Podría mejorar la organización del material del curso.",
                calificacion: 3,
                likes: Math.floor(Math.random() * 20),
                temas: ["organización", "material"],
                tipo: "crítico"
            },
            {
                texto: "Las prácticas son muy extensas para el tiempo dado.",
                calificacion: 2,
                likes: Math.floor(Math.random() * 15),
                temas: ["prácticas", "tiempo"],
                tipo: "negativo"
            }
        ]
    },
    {
        profesor: 'URBANO, GRADOS Oscar Antonio',
        comentarios: [
            {
                texto: 'Las explicaciones son muy teóricas y abstractas, falta más ejemplos prácticos.',
                calificacion: 2,
                likes: Math.floor(Math.random() * 15),
                temas: ['metodología', 'ejemplos prácticos'],
                tipo: 'crítico'
            },
            {
                texto: 'El profesor tiene conocimiento pero le cuesta transmitirlo de manera clara.',
                calificacion: 3,
                likes: Math.floor(Math.random() * 20),
                temas: ['comunicación', 'pedagogía'],
                tipo: 'crítico'
            },
            {
                texto: 'Las clases necesitan mejor estructura y organización.',
                calificacion: 2,
                likes: Math.floor(Math.random() * 12),
                temas: ['organización', 'estructura'],
                tipo: 'crítico'
            }
        ]
    },
    {
        profesor: 'CERRON, OCHOA Juan Silvio',
        comentarios: [
            {
                texto: 'Excelente metodología para enseñar programación, muy didáctico.',
                calificacion: 5,
                likes: Math.floor(Math.random() * 30),
                temas: ['metodología', 'didáctica'],
                tipo: 'positivo'
            },
            {
                texto: 'Sus ejemplos prácticos ayudan mucho a entender los conceptos.',
                calificacion: 5,
                likes: Math.floor(Math.random() * 25),
                temas: ['ejemplos prácticos', 'comprensión'],
                tipo: 'positivo'
            },
            {
                texto: 'Siempre dispuesto a resolver dudas y dar asesorías extras.',
                calificacion: 5,
                likes: Math.floor(Math.random() * 28),
                temas: ['disposición', 'apoyo extra'],
                tipo: 'positivo'
            }
        ]
    },
    {
        profesor: 'GUEVARA, JIMENEZ Jorge Alfredo',
        comentarios: [
            {
                texto: 'Domina muy bien los temas de diseño de software y arquitectura.',
                calificacion: 5,
                likes: Math.floor(Math.random() * 22),
                temas: ['conocimiento', 'diseño software'],
                tipo: 'positivo'
            },
            {
                texto: 'Sus proyectos son retadores y ayudan mucho al aprendizaje.',
                calificacion: 4,
                likes: Math.floor(Math.random() * 18),
                temas: ['proyectos', 'aprendizaje práctico'],
                tipo: 'positivo'
            },
            {
                texto: 'Explica claramente los patrones de diseño y buenas prácticas.',
                calificacion: 5,
                likes: Math.floor(Math.random() * 25),
                temas: ['patrones diseño', 'buenas prácticas'],
                tipo: 'positivo'
            }
        ]
    },
    {
        profesor: "MEDINA, RAYMUNDO Carlos Alberto",
        comentarios: [
            {
                texto: "Excelente conocimiento de arquitectura de computadores.",
                calificacion: 5,
                likes: Math.floor(Math.random() * 30),
                temas: ["conocimiento", "arquitectura"],
                tipo: "positivo"
            },
            {
                texto: "Muy bueno explicando temas complejos de ingeniería web.",
                calificacion: 5,
                likes: Math.floor(Math.random() * 30),
                temas: ["explicaciones", "web"],
                tipo: "positivo"
            },
            {
                texto: "Sus laboratorios están muy bien diseñados.",
                calificacion: 4,
                likes: Math.floor(Math.random() * 30),
                temas: ["laboratorios", "diseño"],
                tipo: "positivo"
            },
            {
                texto: "Mantiene el contenido actualizado y relevante.",
                calificacion: 4,
                likes: Math.floor(Math.random() * 30),
                temas: ["contenido", "actualización"],
                tipo: "positivo"
            },
            {
                texto: "Las evaluaciones podrían tener mejor retroalimentación.",
                calificacion: 3,
                likes: Math.floor(Math.random() * 20),
                temas: ["evaluaciones", "retroalimentación"],
                tipo: "crítico"
            },
            {
                texto: "No responde correos fuera de horario de clase.",
                calificacion: 2,
                likes: Math.floor(Math.random() * 15),
                temas: ["comunicación", "disponibilidad"],
                tipo: "negativo"
            }
        ]
    },
    {
        profesor: "CONDORI, TORRES Giancarlo",
        comentarios: [
            {
                texto: "Excelente dominio de redes y networking.",
                calificacion: 5,
                likes: Math.floor(Math.random() * 30),
                temas: ["conocimiento", "redes"],
                tipo: "positivo"
            },
            {
                texto: "Las prácticas de laboratorio son muy útiles.",
                calificacion: 5,
                likes: Math.floor(Math.random() * 30),
                temas: ["laboratorios", "práctica"],
                tipo: "positivo"
            },
            {
                texto: "Material de clase bien organizado y completo.",
                calificacion: 4,
                likes: Math.floor(Math.random() * 30),
                temas: ["material", "organización"],
                tipo: "positivo"
            },
            {
                texto: "Buena disposición para resolver dudas.",
                calificacion: 4,
                likes: Math.floor(Math.random() * 30),
                temas: ["atención", "dudas"],
                tipo: "positivo"
            },
            {
                texto: "Los equipos de laboratorio necesitan actualización.",
                calificacion: 3,
                likes: Math.floor(Math.random() * 20),
                temas: ["equipamiento", "actualización"],
                tipo: "crítico"
            },
            {
                texto: "Las evaluaciones son demasiado teóricas.",
                calificacion: 2,
                likes: Math.floor(Math.random() * 15),
                temas: ["evaluaciones", "teoría"],
                tipo: "negativo"
            }
        ]
    },
    {
        profesor: "ALONZO, HUAMAN Max Walter",
        comentarios: [
            {
                texto: "Excelente manejo de conceptos de Business Intelligence.",
                calificacion: 5,
                likes: Math.floor(Math.random() * 30),
                temas: ["conocimiento", "BI"],
                tipo: "positivo"
            },
            {
                texto: "Muy bueno relacionando teoría con casos empresariales.",
                calificacion: 5,
                likes: Math.floor(Math.random() * 30),
                temas: ["casos prácticos", "aplicación"],
                tipo: "positivo"
            },
            {
                texto: "Promueve discusiones interesantes en clase.",
                calificacion: 4,
                likes: Math.floor(Math.random() * 30),
                temas: ["participación", "discusión"],
                tipo: "positivo"
            },
            {
                texto: "Los proyectos son relevantes y bien estructurados.",
                calificacion: 4,
                likes: Math.floor(Math.random() * 30),
                temas: ["proyectos", "estructura"],
                tipo: "positivo"
            },
            {
                texto: "Las presentaciones podrían ser más dinámicas.",
                calificacion: 3,
                likes: Math.floor(Math.random() * 20),
                temas: ["presentaciones", "dinamismo"],
                tipo: "crítico"
            },
            {
                texto: "Falta más práctica con herramientas actuales.",
                calificacion: 2,
                likes: Math.floor(Math.random() * 15),
                temas: ["herramientas", "práctica"],
                tipo: "negativo"
            }
        ]
    },
    {
        profesor: "PEÑA, GARCIA Guillermo Eduardo",
        comentarios: [
            {
                texto: "Excelente en desarrollo web y tecnologías modernas.",
                calificacion: 5,
                likes: Math.floor(Math.random() * 30),
                temas: ["web", "tecnología"],
                tipo: "positivo"
            },
            {
                texto: "Sus clases de desarrollo móvil son muy prácticas.",
                calificacion: 5,
                likes: Math.floor(Math.random() * 30),
                temas: ["móvil", "práctica"],
                tipo: "positivo"
            },
            {
                texto: "Buen balance entre teoría y práctica.",
                calificacion: 4,
                likes: Math.floor(Math.random() * 30),
                temas: ["balance", "metodología"],
                tipo: "positivo"
            },
            {
                texto: "Promueve la creatividad en los proyectos.",
                calificacion: 4,
                likes: Math.floor(Math.random() * 30),
                temas: ["creatividad", "proyectos"],
                tipo: "positivo"
            },
            {
                texto: "El ritmo de clase es muy acelerado a veces.",
                calificacion: 3,
                likes: Math.floor(Math.random() * 20),
                temas: ["ritmo", "clase"],
                tipo: "crítico"
            },
            {
                texto: "Las entregas tienen plazos muy ajustados.",
                calificacion: 2,
                likes: Math.floor(Math.random() * 15),
                temas: ["plazos", "entregas"],
                tipo: "negativo"
            }
        ]
    },
    {
        profesor: "ROJAS, MORENO Carol Roxana",
        comentarios: [
            {
                texto: "Excelente explicando POO y técnicas de programación.",
                calificacion: 5,
                likes: Math.floor(Math.random() * 30),
                temas: ["POO", "programación"],
                tipo: "positivo"
            },
            {
                texto: "Muy paciente y clara en sus explicaciones.",
                calificacion: 5,
                likes: Math.floor(Math.random() * 30),
                temas: ["paciencia", "claridad"],
                tipo: "positivo"
            },
            {
                texto: "Buena metodología para enseñar conceptos difíciles.",
                calificacion: 4,
                likes: Math.floor(Math.random() * 30),
                temas: ["metodología", "enseñanza"],
                tipo: "positivo"
            },
            {
                texto: "Los ejercicios son muy útiles para aprender.",
                calificacion: 4,
                likes: Math.floor(Math.random() * 30),
                temas: ["ejercicios", "aprendizaje"],
                tipo: "positivo"
            },
            {
                texto: "Podría incluir más proyectos grupales.",
                calificacion: 3,
                likes: Math.floor(Math.random() * 20),
                temas: ["proyectos", "trabajo en equipo"],
                tipo: "crítico"
            },
            {
                texto: "Las prácticas calificadas son muy extensas.",
                calificacion: 2,
                likes: Math.floor(Math.random() * 15),
                temas: ["prácticas", "evaluación"],
                tipo: "negativo"
            }
        ]
    },
    {
        profesor: "MELGAR, ALIAGA Freud Enrique",
        comentarios: [
            {
                texto: "Excelente conocimiento de cloud computing y tecnologías actuales.",
                calificacion: 5,
                likes: Math.floor(Math.random() * 30),
                temas: ["cloud", "tecnología"],
                tipo: "positivo"
            },
            {
                texto: "Sus ejemplos prácticos son muy relevantes para la industria.",
                calificacion: 5,
                likes: Math.floor(Math.random() * 30),
                temas: ["ejemplos", "industria"],
                tipo: "positivo"
            },
            {
                texto: "Mantiene el contenido actualizado con las últimas tendencias.",
                calificacion: 4,
                likes: Math.floor(Math.random() * 30),
                temas: ["actualización", "contenido"],
                tipo: "positivo"
            },
            {
                texto: "Buena disposición para resolver dudas complejas.",
                calificacion: 4,
                likes: Math.floor(Math.random() * 30),
                temas: ["atención", "dudas"],
                tipo: "positivo"
            },
            {
                texto: "Las clases podrían ser más interactivas.",
                calificacion: 3,
                likes: Math.floor(Math.random() * 20),
                temas: ["interactividad", "clases"],
                tipo: "crítico"
            },
            {
                texto: "El material del curso está muy disperso.",
                calificacion: 2,
                likes: Math.floor(Math.random() * 15),
                temas: ["material", "organización"],
                tipo: "negativo"
            }
        ]
    },
    {
        profesor: "SIFUENTES, LOPEZ Jorge Asencio",
        comentarios: [
            {
                texto: "Excelente conocimiento de sistemas operativos.",
                calificacion: 5,
                likes: Math.floor(Math.random() * 30),
                temas: ["conocimiento", "sistemas"],
                tipo: "positivo"
            },
            {
                texto: "Muy bueno explicando arquitectura de computadores.",
                calificacion: 5,
                likes: Math.floor(Math.random() * 30),
                temas: ["explicaciones", "arquitectura"],
                tipo: "positivo"
            },
            {
                texto: "El material del curso es completo y bien estructurado.",
                calificacion: 4,
                likes: Math.floor(Math.random() * 30),
                temas: ["material", "estructura"],
                tipo: "positivo"
            },
            {
                texto: "Los laboratorios son muy útiles para el aprendizaje.",
                calificacion: 4,
                likes: Math.floor(Math.random() * 30),
                temas: ["laboratorios", "aprendizaje"],
                tipo: "positivo"
            },
            {
                texto: "Las evaluaciones son muy teóricas.",
                calificacion: 3,
                likes: Math.floor(Math.random() * 20),
                temas: ["evaluaciones", "teoría"],
                tipo: "crítico"
            },
            {
                texto: "Falta más práctica con casos reales.",
                calificacion: 2,
                likes: Math.floor(Math.random() * 15),
                temas: ["práctica", "casos reales"],
                tipo: "negativo"
            }
        ]
    },
    {
        profesor: "URBANO, GRADOS Oscar Antonio",
        comentarios: [
            {
                texto: "Buen conocimiento de arquitectura de servicios.",
                calificacion: 5,
                likes: Math.floor(Math.random() * 30),
                temas: ["conocimiento", "arquitectura"],
                tipo: "positivo"
            },
            {
                texto: "Los conceptos teóricos están bien explicados.",
                calificacion: 5,
                likes: Math.floor(Math.random() * 30),
                temas: ["teoría", "explicaciones"],
                tipo: "positivo"
            },
            {
                texto: "El material de estudio es completo.",
                calificacion: 4,
                likes: Math.floor(Math.random() * 30),
                temas: ["material", "contenido"],
                tipo: "positivo"
            },
            {
                texto: "Las evaluaciones son justas y coherentes.",
                calificacion: 4,
                likes: Math.floor(Math.random() * 30),
                temas: ["evaluaciones", "coherencia"],
                tipo: "positivo"
            },
            {
                texto: "La metodología podría ser más práctica.",
                calificacion: 3,
                likes: Math.floor(Math.random() * 20),
                temas: ["metodología", "práctica"],
                tipo: "crítico"
            },
            {
                texto: "Falta más interacción con los estudiantes.",
                calificacion: 2,
                likes: Math.floor(Math.random() * 15),
                temas: ["interacción", "participación"],
                tipo: "negativo"
            }
        ]
    },
    {
        profesor: "ARANA, CAPARACHIN Maglioni",
        comentarios: [
            {
                texto: "Excelente guía en investigación y metodología. Sus consejos son muy valiosos.",
                calificacion: 5,
                likes: Math.floor(Math.random() * 30),
                temas: ["investigación", "metodología"],
                tipo: "positivo"
            },
            {
                texto: "Muy buen manejo de las pruebas de software y calidad.",
                calificacion: 5,
                likes: Math.floor(Math.random() * 30),
                temas: ["pruebas", "calidad"],
                tipo: "positivo"
            },
            {
                texto: "Sus retroalimentaciones son detalladas y constructivas.",
                calificacion: 4,
                likes: Math.floor(Math.random() * 30),
                temas: ["retroalimentación", "evaluación"],
                tipo: "positivo"
            },
            {
                texto: "Mantiene altos estándares de calidad en los proyectos.",
                calificacion: 4,
                likes: Math.floor(Math.random() * 30),
                temas: ["estándares", "proyectos"],
                tipo: "positivo"
            },
            {
                texto: "Las sesiones podrían ser más dinámicas.",
                calificacion: 3,
                likes: Math.floor(Math.random() * 20),
                temas: ["dinamismo", "sesiones"],
                tipo: "crítico"
            },
            {
                texto: "Los plazos de entrega son muy cortos.",
                calificacion: 2,
                likes: Math.floor(Math.random() * 15),
                temas: ["plazos", "entregas"],
                tipo: "negativo"
            }
        ]
    },
    {
        profesor: "CALDERON, SEDANO Carlos Alberto",
        comentarios: [
            {
                texto: "Excelente explicando conceptos básicos de programación.",
                calificacion: 5,
                likes: Math.floor(Math.random() * 30),
                temas: ["programación", "conceptos básicos"],
                tipo: "positivo"
            },
            {
                texto: "Sus ejemplos son muy claros y fáciles de seguir.",
                calificacion: 5,
                likes: Math.floor(Math.random() * 30),
                temas: ["ejemplos", "claridad"],
                tipo: "positivo"
            },
            {
                texto: "Buena disposición para resolver dudas.",
                calificacion: 4,
                likes: Math.floor(Math.random() * 30),
                temas: ["atención", "dudas"],
                tipo: "positivo"
            },
            {
                texto: "Los ejercicios prácticos son muy útiles.",
                calificacion: 4,
                likes: Math.floor(Math.random() * 30),
                temas: ["ejercicios", "práctica"],
                tipo: "positivo"
            },
            {
                texto: "Podría incluir más proyectos reales.",
                calificacion: 3,
                likes: Math.floor(Math.random() * 20),
                temas: ["proyectos", "aplicación real"],
                tipo: "crítico"
            },
            {
                texto: "Las evaluaciones son demasiado teóricas.",
                calificacion: 2,
                likes: Math.floor(Math.random() * 15),
                temas: ["evaluaciones", "teoría"],
                tipo: "negativo"
            }
        ]
    },
    {
        profesor: "CARMEN, DELGADILLO Elvis Wilfredo",
        comentarios: [
            {
                texto: "Gran experiencia en análisis de requerimientos.",
                calificacion: 5,
                likes: Math.floor(Math.random() * 30),
                temas: ["experiencia", "análisis"],
                tipo: "positivo"
            },
            {
                texto: "Muy bueno enseñando técnicas de levantamiento de información.",
                calificacion: 5,
                likes: Math.floor(Math.random() * 30),
                temas: ["técnicas", "información"],
                tipo: "positivo"
            },
            {
                texto: "Los casos de estudio son muy interesantes.",
                calificacion: 4,
                likes: Math.floor(Math.random() * 30),
                temas: ["casos estudio", "aplicación"],
                tipo: "positivo"
            },
            {
                texto: "Buen enfoque en documentación y estándares.",
                calificacion: 4,
                likes: Math.floor(Math.random() * 30),
                temas: ["documentación", "estándares"],
                tipo: "positivo"
            },
            {
                texto: "Las clases podrían ser más participativas.",
                calificacion: 3,
                likes: Math.floor(Math.random() * 20),
                temas: ["participación", "dinámica"],
                tipo: "crítico"
            },
            {
                texto: "Mucha carga de trabajo para el tiempo disponible.",
                calificacion: 2,
                likes: Math.floor(Math.random() * 15),
                temas: ["carga trabajo", "tiempo"],
                tipo: "negativo"
            }
        ]
    },
    {
        profesor: "CHUMPITAZ, VELEZ Jorge Luis",
        comentarios: [
            {
                texto: "Excelente conocimiento en metodologías ágiles.",
                calificacion: 5,
                likes: Math.floor(Math.random() * 30),
                temas: ["metodologías", "agilidad"],
                tipo: "positivo"
            },
            {
                texto: "Muy buena experiencia compartiendo casos reales de la industria.",
                calificacion: 5,
                likes: Math.floor(Math.random() * 30),
                temas: ["experiencia", "casos reales"],
                tipo: "positivo"
            },
            {
                texto: "Las dinámicas de grupo son muy efectivas.",
                calificacion: 4,
                likes: Math.floor(Math.random() * 30),
                temas: ["dinámicas", "grupo"],
                tipo: "positivo"
            },
            {
                texto: "Excelente planificación de las clases.",
                calificacion: 4,
                likes: Math.floor(Math.random() * 30),
                temas: ["planificación", "organización"],
                tipo: "positivo"
            },
            {
                texto: "Las presentaciones podrían ser más interactivas.",
                calificacion: 3,
                likes: Math.floor(Math.random() * 20),
                temas: ["presentaciones", "interactividad"],
                tipo: "crítico"
            },
            {
                texto: "Demasiado contenido para el tiempo del curso.",
                calificacion: 2,
                likes: Math.floor(Math.random() * 15),
                temas: ["contenido", "tiempo"],
                tipo: "negativo"
            }
        ]
    },
    {
        profesor: "COHAILA, BRAVO Ninoska Nataly",
        comentarios: [
            {
                texto: "Excelente introducción a la ingeniería de sistemas.",
                calificacion: 5,
                likes: Math.floor(Math.random() * 30),
                temas: ["introducción", "ingeniería"],
                tipo: "positivo"
            },
            {
                texto: "Muy buena para motivar a los estudiantes.",
                calificacion: 5,
                likes: Math.floor(Math.random() * 30),
                temas: ["motivación", "enseñanza"],
                tipo: "positivo"
            },
            {
                texto: "Las actividades prácticas son muy útiles.",
                calificacion: 4,
                likes: Math.floor(Math.random() * 30),
                temas: ["actividades", "práctica"],
                tipo: "positivo"
            },
            {
                texto: "Buena orientación sobre la carrera.",
                calificacion: 4,
                likes: Math.floor(Math.random() * 30),
                temas: ["orientación", "carrera"],
                tipo: "positivo"
            },
            {
                texto: "Podría profundizar más en algunos temas.",
                calificacion: 3,
                likes: Math.floor(Math.random() * 20),
                temas: ["profundidad", "contenido"],
                tipo: "crítico"
            },
            {
                texto: "Las evaluaciones son muy generales.",
                calificacion: 2,
                likes: Math.floor(Math.random() * 15),
                temas: ["evaluaciones", "generalidad"],
                tipo: "negativo"
            }
        ]
    },
    {
        profesor: "FERNANDEZ, RIVERA Diego Alejandro",
        comentarios: [
            {
                texto: "Excelente conocimiento en desarrollo de videojuegos.",
                calificacion: 5,
                likes: Math.floor(Math.random() * 30),
                temas: ["videojuegos", "desarrollo"],
                tipo: "positivo"
            },
            {
                texto: "Muy bueno explicando conceptos de programación gráfica.",
                calificacion: 5,
                likes: Math.floor(Math.random() * 30),
                temas: ["gráficos", "programación"],
                tipo: "positivo"
            },
            {
                texto: "Los proyectos son desafiantes y divertidos.",
                calificacion: 4,
                likes: Math.floor(Math.random() * 30),
                temas: ["proyectos", "desafíos"],
                tipo: "positivo"
            },
            {
                texto: "Buena integración de arte y programación.",
                calificacion: 4,
                likes: Math.floor(Math.random() * 30),
                temas: ["arte", "integración"],
                tipo: "positivo"
            },
            {
                texto: "El ritmo del curso podría ser más gradual.",
                calificacion: 3,
                likes: Math.floor(Math.random() * 20),
                temas: ["ritmo", "aprendizaje"],
                tipo: "crítico"
            },
            {
                texto: "Falta más tiempo para los proyectos finales.",
                calificacion: 2,
                likes: Math.floor(Math.random() * 15),
                temas: ["tiempo", "proyectos"],
                tipo: "negativo"
            }
        ]
    },
    {
        profesor: "GAMARRA, MORENO Job Daniel",
        comentarios: [
            {
                texto: "Excelente guía en los proyectos de tesis.",
                calificacion: 5,
                likes: Math.floor(Math.random() * 30),
                temas: ["tesis", "guía"],
                tipo: "positivo"
            },
            {
                texto: "Muy bueno en metodología de la investigación.",
                calificacion: 5,
                likes: Math.floor(Math.random() * 30),
                temas: ["metodología", "investigación"],
                tipo: "positivo"
            },
            {
                texto: "Las asesorías son muy productivas.",
                calificacion: 4,
                likes: Math.floor(Math.random() * 30),
                temas: ["asesorías", "productividad"],
                tipo: "positivo"
            },
            {
                texto: "Excelente retroalimentación en los avances.",
                calificacion: 4,
                likes: Math.floor(Math.random() * 30),
                temas: ["retroalimentación", "avances"],
                tipo: "positivo"
            },
            {
                texto: "Los tiempos de revisión podrían ser más cortos.",
                calificacion: 3,
                likes: Math.floor(Math.random() * 20),
                temas: ["revisión", "tiempos"],
                tipo: "crítico"
            },
            {
                texto: "Las exigencias son muy altas para el nivel.",
                calificacion: 2,
                likes: Math.floor(Math.random() * 15),
                temas: ["exigencias", "nivel"],
                tipo: "negativo"
            }
        ]
    },
    {
        profesor: "MENDEZ, GUILLEN Jan Kenny",
        comentarios: [
            {
                texto: "Excelente en análisis de sistemas y programación.",
                calificacion: 5,
                likes: Math.floor(Math.random() * 30),
                temas: ["análisis", "programación"],
                tipo: "positivo"
            },
            {
                texto: "Muy bueno explicando conceptos complejos.",
                calificacion: 5,
                likes: Math.floor(Math.random() * 30),
                temas: ["explicaciones", "conceptos"],
                tipo: "positivo"
            },
            {
                texto: "Los ejercicios son muy prácticos y útiles.",
                calificacion: 4,
                likes: Math.floor(Math.random() * 30),
                temas: ["ejercicios", "práctica"],
                tipo: "positivo"
            },
            {
                texto: "Buena preparación de material didáctico.",
                calificacion: 4,
                likes: Math.floor(Math.random() * 30),
                temas: ["material", "didáctica"],
                tipo: "positivo"
            },
            {
                texto: "La carga de tareas podría distribuirse mejor.",
                calificacion: 3,
                likes: Math.floor(Math.random() * 20),
                temas: ["tareas", "distribución"],
                tipo: "crítico"
            },
            {
                texto: "Las prácticas son muy extensas.",
                calificacion: 2,
                likes: Math.floor(Math.random() * 15),
                temas: ["prácticas", "extensión"],
                tipo: "negativo"
            }
        ]
    },
    {
        profesor: "MERCADO, RIVAS Richard Yuri",
        comentarios: [
            {
                texto: "Excelente conocimiento en bases de datos.",
                calificacion: 5,
                likes: Math.floor(Math.random() * 30),
                temas: ["bases datos", "conocimiento"],
                tipo: "positivo"
            },
            {
                texto: "Muy bueno en administración y optimización de BD.",
                calificacion: 5,
                likes: Math.floor(Math.random() * 30),
                temas: ["administración", "optimización"],
                tipo: "positivo"
            },
            {
                texto: "Los laboratorios están bien estructurados.",
                calificacion: 4,
                likes: Math.floor(Math.random() * 30),
                temas: ["laboratorios", "estructura"],
                tipo: "positivo"
            },
            {
                texto: "Buena combinación de teoría y práctica.",
                calificacion: 4,
                likes: Math.floor(Math.random() * 30),
                temas: ["teoría", "práctica"],
                tipo: "positivo"
            },
            {
                texto: "Podría incluir más casos de estudio reales.",
                calificacion: 3,
                likes: Math.floor(Math.random() * 20),
                temas: ["casos estudio", "realidad"],
                tipo: "crítico"
            },
            {
                texto: "Las evaluaciones son muy complejas.",
                calificacion: 2,
                likes: Math.floor(Math.random() * 15),
                temas: ["evaluaciones", "complejidad"],
                tipo: "negativo"
            }
        ]
    },
    {
        profesor: "OSORIO, CONTRERAS Rosario Delia",
        comentarios: [
            {
                texto: "Excelente enseñando estructuras de datos.",
                calificacion: 5,
                likes: Math.floor(Math.random() * 30),
                temas: ["estructuras", "datos"],
                tipo: "positivo"
            },
            {
                texto: "Muy clara explicando programación orientada a objetos.",
                calificacion: 5,
                likes: Math.floor(Math.random() * 30),
                temas: ["POO", "claridad"],
                tipo: "positivo"
            },
            {
                texto: "Los ejercicios ayudan mucho al aprendizaje.",
                calificacion: 4,
                likes: Math.floor(Math.random() * 30),
                temas: ["ejercicios", "aprendizaje"],
                tipo: "positivo"
            },
            {
                texto: "Buena metodología de enseñanza.",
                calificacion: 4,
                likes: Math.floor(Math.random() * 30),
                temas: ["metodología", "enseñanza"],
                tipo: "positivo"
            },
            {
                texto: "Las prácticas podrían tener más ejemplos.",
                calificacion: 3,
                likes: Math.floor(Math.random() * 20),
                temas: ["prácticas", "ejemplos"],
                tipo: "crítico"
            },
            {
                texto: "El ritmo es muy acelerado a veces.",
                calificacion: 2,
                likes: Math.floor(Math.random() * 15),
                temas: ["ritmo", "velocidad"],
                tipo: "negativo"
            }
        ]
    },
    {
        profesor: "PEÑA, ROJAS Anieval",
        comentarios: [
            {
                texto: "Excelente dominio de matemática discreta.",
                calificacion: 5,
                likes: Math.floor(Math.random() * 30),
                temas: ["matemática", "dominio"],
                tipo: "positivo"
            },
            {
                texto: "Muy bueno resolviendo dudas complejas.",
                calificacion: 5,
                likes: Math.floor(Math.random() * 30),
                temas: ["dudas", "resolución"],
                tipo: "positivo"
            },
            {
                texto: "Los ejercicios son retadores y educativos.",
                calificacion: 4,
                likes: Math.floor(Math.random() * 30),
                temas: ["ejercicios", "retos"],
                tipo: "positivo"
            },
            {
                texto: "Buena preparación de material de estudio.",
                calificacion: 4,
                likes: Math.floor(Math.random() * 30),
                temas: ["material", "preparación"],
                tipo: "positivo"
            },
            {
                texto: "Podría incluir más aplicaciones prácticas.",
                calificacion: 3,
                likes: Math.floor(Math.random() * 20),
                temas: ["aplicaciones", "práctica"],
                tipo: "crítico"
            },
            {
                texto: "Las evaluaciones son muy difíciles.",
                calificacion: 2,
                likes: Math.floor(Math.random() * 15),
                temas: ["evaluaciones", "dificultad"],
                tipo: "negativo"
            }
        ]
    },
    {
        profesor: "CAMBORDA, ZAMUDIO María Gabriela",
        comentarios: [
            {
                texto: "Excelente introducción a la carrera.",
                calificacion: 5,
                likes: Math.floor(Math.random() * 30),
                temas: ["introducción", "carrera"],
                tipo: "positivo"
            },
            {
                texto: "Muy buena motivando a los estudiantes.",
                calificacion: 5,
                likes: Math.floor(Math.random() * 30),
                temas: ["motivación", "estudiantes"],
                tipo: "positivo"
            },
            {
                texto: "Las dinámicas de grupo son efectivas.",
                calificacion: 4,
                likes: Math.floor(Math.random() * 30),
                temas: ["dinámicas", "grupo"],
                tipo: "positivo"
            },
            {
                texto: "Buen enfoque en aspectos profesionales.",
                calificacion: 4,
                likes: Math.floor(Math.random() * 30),
                temas: ["profesional", "enfoque"],
                tipo: "positivo"
            },
            {
                texto: "Podría profundizar más en temas técnicos.",
                calificacion: 3,
                likes: Math.floor(Math.random() * 20),
                temas: ["técnico", "profundidad"],
                tipo: "crítico"
            },
            {
                texto: "Falta más contenido práctico.",
                calificacion: 2,
                likes: Math.floor(Math.random() * 15),
                temas: ["contenido", "práctica"],
                tipo: "negativo"
            }
        ]
    },
    {
        profesor: "ULLOA, TORRES Eduardo Raul",
        comentarios: [
            {
                texto: "Excelente conocimiento en seguridad informática.",
                calificacion: 5,
                likes: Math.floor(Math.random() * 30),
                temas: ["seguridad", "conocimiento"],
                tipo: "positivo"
            },
            {
                texto: "Muy bueno en auditoría de sistemas.",
                calificacion: 5,
                likes: Math.floor(Math.random() * 30),
                temas: ["auditoría", "sistemas"],
                tipo: "positivo"
            },
            {
                texto: "Los casos de estudio son muy interesantes.",
                calificacion: 4,
                likes: Math.floor(Math.random() * 30),
                temas: ["casos", "estudio"],
                tipo: "positivo"
            },
            {
                texto: "Buena actualización en tendencias de seguridad.",
                calificacion: 4,
                likes: Math.floor(Math.random() * 30),
                temas: ["actualización", "tendencias"],
                tipo: "positivo"
            },
            {
                texto: "Las prácticas podrían ser más extensas.",
                calificacion: 3,
                likes: Math.floor(Math.random() * 20),
                temas: ["prácticas", "extensión"],
                tipo: "crítico"
            },
            {
                texto: "Algunas explicaciones son muy técnicas.",
                calificacion: 2,
                likes: Math.floor(Math.random() * 15),
                temas: ["explicaciones", "tecnicismo"],
                tipo: "negativo"
            }
        ]
    }];


// Crear una función principal para ejecutar el seed
async function main() {
    try {
        await db();
        await seed();
        console.log('Seed de comentarios completa.');
        mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        mongoose.disconnect();
        process.exit(1);
    }
}

// Ejecutar el seed
main();
