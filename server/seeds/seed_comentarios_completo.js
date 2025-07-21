const mongoose = require('mongoose');
const Profesor = require('../models/Profesor');
const Curso = require('../models/Curso');
const Comentario = require('../models/Comentario');
const AnalisisProfesor = require('../models/AnalisisProfesor');
const Sentiment = require('sentiment');
const sentiment = new Sentiment();
const db = require('../config/db');

// Función para generar comentarios aleatorios
function generarComentariosAleatorios(cantidad) {
    const comentarios = [];
    for (let i = 0; i < cantidad; i++) {
        comentarios.push({
            texto: `Comentario de prueba ${i + 1}`,
            calificacion: Math.floor(Math.random() * 3) + 3, // 3-5
            likes: Math.floor(Math.random() * 30),
            temas: ['metodología', 'organización', 'claridad'],
            tipo: Math.random() > 0.7 ? 'crítico' : 'positivo'
        });
    }
    return comentarios;
}

// Lista de profesores con sus cursos
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
      {
        texto: 'No explica bien los conceptos clave de arquitectura, todo queda muy abstracto.',
        calificacion: 2,
        likes: Math.floor(Math.random() * 15),
        temas: ['claridad', 'conceptos'],
        tipo: 'crítico'
      },
      {
        texto: 'Utiliza presentaciones desactualizadas que no conectan con los retos actuales.',
        calificacion: 2,
        likes: Math.floor(Math.random() * 15),
        temas: ['material', 'actualización'],
        tipo: 'crítico'
      },
      {
        texto: 'No resolvía dudas, solo repetía lo mismo sin dar ejemplos claros.',
        calificacion: 2,
        likes: Math.floor(Math.random() * 15),
        temas: ['resolución dudas', 'ejemplos'],
        tipo: 'crítico'
      },
      {
        texto: 'Se limita a leer diapositivas, sin contextualizar ni generar discusión.',
        calificacion: 2,
        likes: Math.floor(Math.random() * 15),
        temas: ['metodología', 'participación'],
        tipo: 'crítico'
      },
      {
        texto: 'A menudo improvisa y se nota la falta de planificación.',
        calificacion: 2,
        likes: Math.floor(Math.random() * 15),
        temas: ['planificación', 'organización'],
        tipo: 'crítico'
      },
      {
        texto: 'Las clases son monótonas y cuesta mantener la atención.',
        calificacion: 2,
        likes: Math.floor(Math.random() * 15),
        temas: ['dinamismo', 'metodología'],
        tipo: 'crítico'
      },
      {
        texto: 'No brinda material adicional ni ejemplos reales, todo es teoría plana.',
        calificacion: 2,
        likes: Math.floor(Math.random() * 15),
        temas: ['material', 'ejemplos prácticos'],
        tipo: 'crítico'
      },
      {
        texto: 'Mejoró un poco hacia el segundo mes, pero aún falta orden y claridad.',
        calificacion: 3,
        likes: Math.floor(Math.random() * 15),
        temas: ['mejora', 'organización'],
        tipo: 'crítico'
      },
      {
        texto: 'Podría integrar más herramientas prácticas y hacer la clase participativa.',
        calificacion: 3,
        likes: Math.floor(Math.random() * 15),
        temas: ['herramientas', 'participación'],
        tipo: 'crítico'
      },
      {
        texto: 'Cuando le pedimos ejemplos, responde de forma muy genérica.',
        calificacion: 2,
        likes: Math.floor(Math.random() * 15),
        temas: ['ejemplos', 'claridad'],
        tipo: 'crítico'
      },
      {
        texto: 'Tiene experiencia, pero necesita mejorar su forma de comunicarla.',
        calificacion: 3,
        likes: Math.floor(Math.random() * 15),
        temas: ['comunicación', 'experiencia'],
        tipo: 'crítico'
      },
      {
        texto: 'Podría enriquecer sus clases si usara casos reales o discusiones.',
        calificacion: 3,
        likes: Math.floor(Math.random() * 15),
        temas: ['casos prácticos', 'metodología'],
        tipo: 'crítico'
      },
      {
        texto: 'Da buenas ideas pero las deja a medias, falta seguimiento.',
        calificacion: 3,
        likes: Math.floor(Math.random() * 15),
        temas: ['seguimiento', 'implementación'],
        tipo: 'crítico'
      },
      {
        texto: 'Se nota que intenta mejorar, pero debería abrir más espacio para preguntas.',
        calificacion: 3,
        likes: Math.floor(Math.random() * 15),
        temas: ['mejora', 'participación'],
        tipo: 'crítico'
      }
    ]
  },
  {
    profesor: 'CAMBORDA, ZAMUDIO María Gabriela',
    comentarios: [
      {
        texto: 'No hay una línea clara de aprendizaje, los temas se sienten desordenados.',
        calificacion: 2,
        likes: Math.floor(Math.random() * 15),
        temas: ['organización', 'estructura'],
        tipo: 'crítico'
      },
      {
        texto: 'Se nota inseguridad al explicar; muchas veces evita responder preguntas.',
        calificacion: 2,
        likes: Math.floor(Math.random() * 15),
        temas: ['seguridad', 'resolución dudas'],
        tipo: 'crítico'
      },
      {
        texto: 'El contenido es básico, pero aun así lo hace complicado de entender.',
        calificacion: 2,
        likes: Math.floor(Math.random() * 15),
        temas: ['claridad', 'contenido'],
        tipo: 'crítico'
      },
      {
        texto: 'No incentiva la participación, todo se vuelve muy pasivo.',
        calificacion: 2,
        likes: Math.floor(Math.random() * 15),
        temas: ['participación', 'dinamismo'],
        tipo: 'crítico'
      },
      {
        texto: 'A veces usa conceptos que ni ella termina de explicar bien.',
        calificacion: 2,
        likes: Math.floor(Math.random() * 15),
        temas: ['claridad', 'conceptos'],
        tipo: 'crítico'
      },
      {
        texto: 'No tiene dominio del curso. Las clases se sienten improvisadas.',
        calificacion: 2,
        likes: Math.floor(Math.random() * 15),
        temas: ['dominio', 'preparación'],
        tipo: 'crítico'
      },
      {
        texto: 'Las presentaciones son poco atractivas, y repite mucho.',
        calificacion: 2,
        likes: Math.floor(Math.random() * 15),
        temas: ['material', 'metodología'],
        tipo: 'crítico'
      },
      {
        texto: 'Sería útil que relacione la teoría con el día a día profesional.',
        calificacion: 3,
        likes: Math.floor(Math.random() * 15),
        temas: ['aplicación práctica', 'ejemplos'],
        tipo: 'crítico'
      },
      {
        texto: 'Mejora cuando trabaja con ejemplos, pero no lo hace seguido.',
        calificacion: 3,
        likes: Math.floor(Math.random() * 15),
        temas: ['ejemplos', 'mejora'],
        tipo: 'crítico'
      },
      {
        texto: 'Se esfuerza por seguir el sílabo, pero necesita más claridad pedagógica.',
        calificacion: 3,
        likes: Math.floor(Math.random() * 15),
        temas: ['pedagogía', 'estructura'],
        tipo: 'crítico'
      },
      {
        texto: 'Acepta críticas, pero no siempre aplica sugerencias.',
        calificacion: 3,
        likes: Math.floor(Math.random() * 15),
        temas: ['receptividad', 'mejora'],
        tipo: 'crítico'
      },
      {
        texto: 'Se nota intención de mejora con algunos resúmenes y mapas mentales.',
        calificacion: 3,
        likes: Math.floor(Math.random() * 15),
        temas: ['material', 'mejora'],
        tipo: 'crítico'
      },
      {
        texto: 'Con mayor preparación, podría aportar más valor a la asignatura.',
        calificacion: 3,
        likes: Math.floor(Math.random() * 15),
        temas: ['preparación', 'potencial'],
        tipo: 'crítico'
      },
      {
        texto: 'Faltó mostrar cómo esta introducción se conecta con cursos futuros.',
        calificacion: 3,
        likes: Math.floor(Math.random() * 15),
        temas: ['contexto', 'relación'],
        tipo: 'crítico'
      },
      {
        texto: 'Necesita usar más recursos didácticos que faciliten la comprensión.',
        calificacion: 3,
        likes: Math.floor(Math.random() * 15),
        temas: ['recursos', 'didáctica'],
        tipo: 'crítico'
      }
    ]
  },
  {
    profesor: 'CERRON, OCHOA Juan Silvio',
    comentarios: [
      {
        texto: 'Excelente forma de explicar algoritmos. Va paso a paso, sin dejar dudas.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['algoritmos', 'metodología'],
        tipo: 'positivo'
      },
      {
        texto: 'Siempre está dispuesto a ayudar incluso fuera del horario de clase.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['disposición', 'apoyo extra'],
        tipo: 'positivo'
      },
      {
        texto: 'Nos animó a trabajar en proyectos reales desde el inicio.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['proyectos', 'aplicación práctica'],
        tipo: 'positivo'
      },
      {
        texto: 'Hace ejercicios en clase que luego aparecen en los exámenes. Muy útil.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['ejercicios', 'evaluación'],
        tipo: 'positivo'
      },
      {
        texto: 'Fomenta el pensamiento lógico con pequeños desafíos semanales.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['pensamiento lógico', 'desafíos'],
        tipo: 'positivo'
      },
      {
        texto: 'Tiene buena energía al enseñar. Hace dinámica la programación.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['dinamismo', 'motivación'],
        tipo: 'positivo'
      },
      {
        texto: 'Usa ejemplos actuales que conectan con el mundo laboral.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['ejemplos prácticos', 'actualidad'],
        tipo: 'positivo'
      },
      {
        texto: 'Nos enseñó herramientas útiles como GitHub y VSCode.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['herramientas', 'tecnología'],
        tipo: 'positivo'
      },
      {
        texto: 'Responde todas las dudas con paciencia, incluso las más básicas.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['paciencia', 'resolución dudas'],
        tipo: 'positivo'
      },
      {
        texto: 'Su evaluación es justa y siempre explica los criterios.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['evaluación', 'transparencia'],
        tipo: 'positivo'
      },
      {
        texto: 'Recomienda buenas prácticas de codificación desde temprano.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['buenas prácticas', 'programación'],
        tipo: 'positivo'
      },
      {
        texto: 'Valora la participación activa, siempre pregunta e involucra al grupo.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['participación', 'metodología'],
        tipo: 'positivo'
      },
      {
        texto: 'Excelente manejo de pseudocódigo y estructuras básicas.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['pseudocódigo', 'estructuras de datos'],
        tipo: 'positivo'
      },
      {
        texto: 'A veces avanza rápido, pero da material complementario para repasar.',
        calificacion: 4,
        likes: Math.floor(Math.random() * 30),
        temas: ['ritmo', 'material adicional'],
        tipo: 'positivo'
      },
      {
        texto: 'Logró que muchos compañeros pierdan el miedo a programar.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['motivación', 'confianza'],
        tipo: 'positivo'
      }
    ]
  },
  {
    profesor: 'GUEVARA, JIMENEZ Jorge Alfredo',
    comentarios: [
      {
        texto: 'Enseña diseño de software con ejemplos de arquitectura escalable.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['diseño', 'arquitectura'],
        tipo: 'positivo'
      },
      {
        texto: 'Muy claro al explicar patrones de diseño como MVC y Singleton.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['patrones diseño', 'claridad'],
        tipo: 'positivo'
      },
      {
        texto: 'Sus clases son estructuradas, con énfasis en análisis previo a codificar.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['metodología', 'análisis'],
        tipo: 'positivo'
      },
      {
        texto: 'Comparte su experiencia en proyectos reales de desarrollo.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['experiencia', 'proyectos reales'],
        tipo: 'positivo'
      },
      {
        texto: 'Nos guió en cómo documentar bien un proyecto completo.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['documentación', 'proyectos'],
        tipo: 'positivo'
      },
      {
        texto: 'Propuso dinámicas de roles para simular equipos ágiles.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['metodologías ágiles', 'dinámica'],
        tipo: 'positivo'
      },
      {
        texto: 'Usa herramientas como Draw.io y Trello, lo cual es muy útil.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['herramientas', 'organización'],
        tipo: 'positivo'
      },
      {
        texto: 'Enseña cómo escribir buenas historias de usuario y casos de uso.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['requisitos', 'documentación'],
        tipo: 'positivo'
      },
      {
        texto: 'Promueve buenas prácticas de diseño centrado en el usuario.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['diseño', 'UX'],
        tipo: 'positivo'
      },
      {
        texto: 'Hace revisiones grupales que fomentan la crítica constructiva.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['revisión', 'feedback'],
        tipo: 'positivo'
      },
      {
        texto: 'Nos dio plantillas útiles para procesos de desarrollo.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['recursos', 'procesos'],
        tipo: 'positivo'
      },
      {
        texto: 'Evalúa más por progreso que por exámenes. Enfoque moderno.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['evaluación', 'metodología'],
        tipo: 'positivo'
      },
      {
        texto: 'Brinda ejemplos de errores comunes en diseño y cómo evitarlos.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['errores comunes', 'buenas prácticas'],
        tipo: 'positivo'
      },
      {
        texto: 'Sabe integrar procesos ágiles con estándares de calidad.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['procesos ágiles', 'calidad'],
        tipo: 'positivo'
      },
      {
        texto: 'Excelente guía durante nuestro primer proyecto formal.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['guía', 'proyectos'],
        tipo: 'positivo'
      }
    ]
  },
  {
    profesor: 'MELGAR, ALIAGA Freud Enrique',
    comentarios: [
      {
        texto: 'Introdujo los fundamentos de forma muy clara y progresiva.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['fundamentos', 'metodología'],
        tipo: 'positivo'
      },
      {
        texto: 'Hizo pruebas en vivo con AWS y Google Cloud, muy didáctico.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['práctica', 'cloud'],
        tipo: 'positivo'
      },
      {
        texto: 'Motiva a certificarte y da tips para lograrlo.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['motivación', 'certificaciones'],
        tipo: 'positivo'
      },
      {
        texto: 'Comparte recursos gratuitos para practicar servicios en la nube.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['recursos', 'práctica'],
        tipo: 'positivo'
      },
      {
        texto: 'Nos explicó diferencias entre IaaS, PaaS y SaaS con casos reales.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['conceptos', 'ejemplos prácticos'],
        tipo: 'positivo'
      },
      {
        texto: 'Da énfasis en la seguridad dentro de arquitecturas cloud.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['seguridad', 'arquitectura'],
        tipo: 'positivo'
      },
      {
        texto: 'Enseñó Terraform y automatización en un taller práctico.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['herramientas', 'automatización'],
        tipo: 'positivo'
      },
      {
        texto: 'Comparte documentación clara y bien organizada.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['documentación', 'organización'],
        tipo: 'positivo'
      },
      {
        texto: 'Nos mostró cómo migrar servicios tradicionales al cloud.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['migración', 'cloud'],
        tipo: 'positivo'
      },
      {
        texto: 'Trajo ejemplos de empresas reales usando soluciones en la nube.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['casos reales', 'empresas'],
        tipo: 'positivo'
      },
      {
        texto: 'Da feedback personalizado en proyectos.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['feedback', 'proyectos'],
        tipo: 'positivo'
      },
      {
        texto: 'Las prácticas fueron demandantes, pero muy útiles.',
        calificacion: 4,
        likes: Math.floor(Math.random() * 30),
        temas: ['prácticas', 'exigencia'],
        tipo: 'positivo'
      },
      {
        texto: 'Claridad total al explicar cargas de trabajo escalables.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['escalabilidad', 'claridad'],
        tipo: 'positivo'
      },
      {
        texto: 'Excelente para mostrar costos y ahorro en plataformas cloud.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['costos', 'optimización'],
        tipo: 'positivo'
      },
      {
        texto: 'A veces los laboratorios fallaban, pero lo resolvía rápidamente.',
        calificacion: 4,
        likes: Math.floor(Math.random() * 30),
        temas: ['laboratorios', 'resolución problemas'],
        tipo: 'positivo'
      }
    ]
  },
  {
    profesor: 'FERNANDEZ, RIVERA Diego Alejandro',
    comentarios: [
      {
        texto: 'Introdujo Unity y C# desde lo más básico, ideal para quienes recién comienzan.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['fundamentos', 'videojuegos'],
        tipo: 'positivo'
      },
      {
        texto: 'Nos motivó a crear minijuegos semanales que reforzaban lo aprendido.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['práctica', 'proyectos'],
        tipo: 'positivo'
      },
      {
        texto: 'Tiene mucha experiencia en motores gráficos, eso se nota al explicar.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['experiencia', 'gráficos'],
        tipo: 'positivo'
      },
      {
        texto: 'Enseñó a reutilizar assets y organizar bien los proyectos.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['organización', 'recursos'],
        tipo: 'positivo'
      },
      {
        texto: 'Compartió plantillas propias para construir niveles en 2D.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['recursos', 'diseño niveles'],
        tipo: 'positivo'
      },
      {
        texto: 'Siempre daba retroalimentación detallada en cada entrega.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['feedback', 'evaluación'],
        tipo: 'positivo'
      },
      {
        texto: 'A veces hablaba muy rápido, pero repetía lo esencial al final.',
        calificacion: 4,
        likes: Math.floor(Math.random() * 30),
        temas: ['comunicación', 'metodología'],
        tipo: 'positivo'
      },
      {
        texto: 'Enseña buenas prácticas de optimización gráfica.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['optimización', 'gráficos'],
        tipo: 'positivo'
      },
      {
        texto: 'Nos hizo trabajar en equipos multidisciplinarios, como en la industria real.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['trabajo equipo', 'industria'],
        tipo: 'positivo'
      },
      {
        texto: 'Se enfoca mucho en la lógica del juego antes del arte visual.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['lógica', 'diseño juegos'],
        tipo: 'positivo'
      },
      {
        texto: 'Hicimos un game jam interno que fue muy divertido y formativo.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['actividades', 'aprendizaje'],
        tipo: 'positivo'
      },
      {
        texto: 'Nos dio ejemplos reales del mercado indie y móvil.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['mercado', 'industria'],
        tipo: 'positivo'
      },
      {
        texto: 'Brinda muy buen soporte técnico cuando surgen bugs.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['soporte', 'debugging'],
        tipo: 'positivo'
      },
      {
        texto: 'Explica cómo testear el juego para evitar errores comunes.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['testing', 'calidad'],
        tipo: 'positivo'
      },
      {
        texto: 'Excelente docente, transmite pasión por los videojuegos.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['motivación', 'pasión'],
        tipo: 'positivo'
      }
    ]
  },
  {
    profesor: 'OSORIO, CONTRERAS Rosario Delia',
    comentarios: [
      {
        texto: 'Excelente introducción a listas, pilas y colas. Muy bien explicado.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['estructuras datos', 'claridad'],
        tipo: 'positivo'
      },
      {
        texto: 'Usa muchos diagramas para que entendamos cómo funciona la memoria.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['visualización', 'memoria'],
        tipo: 'positivo'
      },
      {
        texto: 'Da problemas reales para practicar recursividad y árboles.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['ejercicios', 'algoritmos'],
        tipo: 'positivo'
      },
      {
        texto: 'Sus clases siempre tienen ejercicios al final para consolidar el tema.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['ejercicios', 'metodología'],
        tipo: 'positivo'
      },
      {
        texto: 'Maneja muy bien los conceptos teóricos y su aplicación práctica.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['teoría', 'práctica'],
        tipo: 'positivo'
      },
      {
        texto: 'Tiene mucha paciencia al explicar temas complejos.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['paciencia', 'pedagogía'],
        tipo: 'positivo'
      },
      {
        texto: 'Evaluaciones exigentes, pero siempre con retroalimentación.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['evaluación', 'feedback'],
        tipo: 'positivo'
      },
      {
        texto: 'Nos enseñó a usar herramientas de visualización de estructuras.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['herramientas', 'visualización'],
        tipo: 'positivo'
      },
      {
        texto: 'Insiste en escribir código limpio y bien documentado.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['código limpio', 'documentación'],
        tipo: 'positivo'
      },
      {
        texto: 'Explica con claridad las ventajas de estructurar datos correctamente.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['estructuras datos', 'diseño'],
        tipo: 'positivo'
      },
      {
        texto: 'Comparte links y libros para quien desea ir más allá.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['recursos', 'auto-aprendizaje'],
        tipo: 'positivo'
      },
      {
        texto: 'Fomenta mucho la participación, siempre hace preguntas en clase.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['participación', 'interacción'],
        tipo: 'positivo'
      },
      {
        texto: 'Sus ejercicios son retadores pero muy formativos.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['ejercicios', 'aprendizaje'],
        tipo: 'positivo'
      },
      {
        texto: 'Excelente formadora en fundamentos de programación.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['fundamentos', 'programación'],
        tipo: 'positivo'
      },
      {
        texto: 'Siempre disponible para resolver dudas extra clase.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['disponibilidad', 'apoyo'],
        tipo: 'positivo'
      }
    ]
  },
  {
    profesor: 'PEÑA, GARCIA Guillermo Eduardo',
    comentarios: [
      {
        texto: 'Nos introdujo HTML y CSS con proyectos pequeños desde el primer día.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['web', 'proyectos'],
        tipo: 'positivo'
      },
      {
        texto: 'Enseña a pensar en diseño responsive desde el principio.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['responsive', 'diseño web'],
        tipo: 'positivo'
      },
      {
        texto: 'Trabajamos con Figma y luego llevamos ese diseño a código.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['herramientas', 'diseño'],
        tipo: 'positivo'
      },
      {
        texto: 'Usa ejemplos reales como páginas de empresas o portafolios.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['ejemplos', 'casos reales'],
        tipo: 'positivo'
      },
      {
        texto: 'Se enfoca mucho en la estructura semántica de los sitios.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['semántica', 'estructura'],
        tipo: 'positivo'
      },
      {
        texto: 'Promueve la accesibilidad y el SEO básico como parte del diseño.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['accesibilidad', 'SEO'],
        tipo: 'positivo'
      },
      {
        texto: 'Clases prácticas, siempre terminamos con un mini proyecto.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['práctica', 'proyectos'],
        tipo: 'positivo'
      },
      {
        texto: 'Nos hizo construir un clon funcional de una app conocida.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['proyectos', 'práctica'],
        tipo: 'positivo'
      },
      {
        texto: 'Apoya mucho la creatividad de cada estudiante.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['creatividad', 'apoyo'],
        tipo: 'positivo'
      },
      {
        texto: 'Comparte librerías útiles y extensiones para el navegador.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['recursos', 'herramientas'],
        tipo: 'positivo'
      },
      {
        texto: 'Enseña a integrar APIs simples para hacer más dinámico el sitio.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['APIs', 'interactividad'],
        tipo: 'positivo'
      },
      {
        texto: 'Exigente con fechas, pero justo al evaluar.',
        calificacion: 4,
        likes: Math.floor(Math.random() * 30),
        temas: ['evaluación', 'exigencia'],
        tipo: 'positivo'
      },
      {
        texto: 'Muy preparado, domina tanto frontend como backend básico.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['conocimiento', 'fullstack'],
        tipo: 'positivo'
      },
      {
        texto: 'Siempre propone retos extra para quienes quieren ir más allá.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['desafíos', 'motivación'],
        tipo: 'positivo'
      },
      {
        texto: 'Hace feedback individual para mejorar nuestros diseños.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['feedback', 'diseño'],
        tipo: 'positivo'
      }
    ]
  },
  {
    profesor: 'ROJAS, MORENO Carol Roxana',
    comentarios: [
      {
        texto: 'Enseña a codificar desde cero, con mucha paciencia y claridad.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['fundamentos', 'pedagogía'],
        tipo: 'positivo'
      },
      {
        texto: 'Nos ayudó a entender objetos y clases con ejemplos cotidianos.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['POO', 'ejemplos'],
        tipo: 'positivo'
      },
      {
        texto: 'Da ejercicios creativos, como simulaciones de juegos o bancos.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['ejercicios', 'creatividad'],
        tipo: 'positivo'
      },
      {
        texto: 'Introduce herramientas como Java y Python, según el avance del grupo.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['herramientas', 'lenguajes'],
        tipo: 'positivo'
      },
      {
        texto: 'Fomenta el trabajo colaborativo en proyectos pequeños.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['colaboración', 'proyectos'],
        tipo: 'positivo'
      },
      {
        texto: 'Tiene una gran actitud y motiva a no rendirse.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['motivación', 'actitud'],
        tipo: 'positivo'
      },
      {
        texto: 'Explica la diferencia entre métodos y funciones con mucha claridad.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['conceptos', 'claridad'],
        tipo: 'positivo'
      },
      {
        texto: 'Nos enseñó depuración y pruebas básicas de código.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['debugging', 'testing'],
        tipo: 'positivo'
      },
      {
        texto: 'Tiene muy buenos tips para enfrentar entrevistas técnicas.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['consejos', 'entrevistas'],
        tipo: 'positivo'
      },
      {
        texto: 'Explica cómo escribir código reutilizable y modular.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['código limpio', 'modularidad'],
        tipo: 'positivo'
      },
      {
        texto: 'Usa analogías que hacen más sencillo entender programación.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['analogías', 'metodología'],
        tipo: 'positivo'
      },
      {
        texto: 'Nos enseñó Git y control de versiones desde temprano.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['git', 'herramientas'],
        tipo: 'positivo'
      },
      {
        texto: 'Responde dudas por correo con ejemplos personalizados.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['apoyo', 'disponibilidad'],
        tipo: 'positivo'
      },
      {
        texto: 'Organiza desafíos semanales para practicar algoritmos.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['desafíos', 'práctica'],
        tipo: 'positivo'
      },
      {
        texto: 'Tiene un enfoque muy pedagógico. Ideal para principiantes.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['pedagogía', 'metodología'],
        tipo: 'positivo'
      }
    ]
  },
  {
    profesor: 'MEDINA, RAYMUNDO Carlos Alberto',
    comentarios: [
      {
        texto: 'Hace simulaciones de arquitectura con diagramas claros y detallados.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['arquitectura', 'diagramas'],
        tipo: 'positivo'
      },
      {
        texto: 'Comparte herramientas de simulación y lógica digital.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['herramientas', 'simulación'],
        tipo: 'positivo'
      },
      {
        texto: 'Explica cómo se comunican los componentes del hardware.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['hardware', 'comunicación'],
        tipo: 'positivo'
      },
      {
        texto: 'Nos ayudó a entender pipelines y jerarquía de memoria.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['pipelines', 'memoria'],
        tipo: 'positivo'
      },
      {
        texto: 'Usa analogías muy efectivas, como comparar CPU con una cocina.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['analogías', 'CPU'],
        tipo: 'positivo'
      },
      {
        texto: 'En ingeniería web, combina teoría con frameworks como React.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['frameworks', 'web'],
        tipo: 'positivo'
      },
      {
        texto: 'Hace comparación entre tecnologías para tomar decisiones en proyectos.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['tecnologías', 'decisiones'],
        tipo: 'positivo'
      },
      {
        texto: 'Sus proyectos son retadores pero muy formativos.',
        calificacion: 4,
        likes: Math.floor(Math.random() * 30),
        temas: ['proyectos', 'desafíos'],
        tipo: 'positivo'
      },
      {
        texto: 'Enseña buenas prácticas de desarrollo web moderno.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['buenas prácticas', 'web'],
        tipo: 'positivo'
      },
      {
        texto: 'Explica conceptos avanzados de forma comprensible.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['conceptos', 'claridad'],
        tipo: 'positivo'
      },
      {
        texto: 'Mantiene el contenido actualizado con tendencias actuales.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['actualización', 'tendencias'],
        tipo: 'positivo'
      },
      {
        texto: 'Da buenos ejemplos de arquitecturas web escalables.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['arquitectura', 'escalabilidad'],
        tipo: 'positivo'
      },
      {
        texto: 'Fomenta el uso de herramientas modernas de desarrollo.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['herramientas', 'modernidad'],
        tipo: 'positivo'
      },
      {
        texto: 'Evalúa tanto el código como la documentación.',
        calificacion: 4,
        likes: Math.floor(Math.random() * 30),
        temas: ['evaluación', 'documentación'],
        tipo: 'positivo'
      },
      {
        texto: 'Siempre disponible para consultas técnicas.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['disponibilidad', 'apoyo'],
        tipo: 'positivo'
      }
    ]
  },
  {
    profesor: 'ALMIDON, ORTIZ Carlos',
    comentarios: [
      {
        texto: 'Explica lógica proposicional con tablas de verdad y muchos ejemplos.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['lógica', 'ejemplos'],
        tipo: 'positivo'
      },
      {
        texto: 'Nos dio ejercicios de razonamiento lógico que ayudaron bastante.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['ejercicios', 'razonamiento'],
        tipo: 'positivo'
      },
      {
        texto: 'Tiene un estilo serio pero muy metódico, ideal para este curso.',
        calificacion: 4,
        likes: Math.floor(Math.random() * 30),
        temas: ['metodología', 'estilo'],
        tipo: 'positivo'
      },
      {
        texto: 'Ayuda mucho en clase con la resolución paso a paso.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['resolución', 'metodología'],
        tipo: 'positivo'
      },
      {
        texto: 'Trabaja bastante con demostraciones por inducción, siempre explicadas.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['demostraciones', 'inducción'],
        tipo: 'positivo'
      },
      {
        texto: 'Usa problemas del estilo "olimpiadas matemáticas" para retarnos.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['problemas', 'desafíos'],
        tipo: 'positivo'
      },
      {
        texto: 'A veces da por sentado que entendemos todo y va muy rápido.',
        calificacion: 3,
        likes: Math.floor(Math.random() * 30),
        temas: ['ritmo', 'comprensión'],
        tipo: 'neutral'
      },
      {
        texto: 'Se agradece su paciencia al explicar temas complejos como grafos.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['paciencia', 'grafos'],
        tipo: 'positivo'
      },
      {
        texto: 'Las tareas eran retadoras, pero aplicaban los temas vistos.',
        calificacion: 4,
        likes: Math.floor(Math.random() * 30),
        temas: ['tareas', 'aplicación'],
        tipo: 'positivo'
      },
      {
        texto: 'Hace exámenes difíciles pero coherentes con lo enseñado.',
        calificacion: 4,
        likes: Math.floor(Math.random() * 30),
        temas: ['evaluación', 'coherencia'],
        tipo: 'positivo'
      },
      {
        texto: 'Comparte artículos y notas complementarias por correo.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['material', 'recursos'],
        tipo: 'positivo'
      },
      {
        texto: 'Su experiencia se nota especialmente en temas como álgebra booleana.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['experiencia', 'álgebra'],
        tipo: 'positivo'
      },
      {
        texto: 'Promueve mucho el pensamiento crítico, no memorización.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['pensamiento crítico', 'metodología'],
        tipo: 'positivo'
      },
      {
        texto: 'Podría mejorar un poco la dinámica, pero el contenido es excelente.',
        calificacion: 4,
        likes: Math.floor(Math.random() * 30),
        temas: ['dinámica', 'contenido'],
        tipo: 'positivo'
      },
      {
        texto: 'Siempre abierto a responder preguntas, incluso fuera del aula.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['disponibilidad', 'apoyo'],
        tipo: 'positivo'
      }
    ]
  },
  {
    profesor: 'CHUMPITAZ, VELEZ Jorge Luis',
    comentarios: [
      {
        texto: 'Excelente enfoque práctico para enseñar SCRUM y Kanban.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['metodologías ágiles', 'práctica'],
        tipo: 'positivo'
      },
      {
        texto: 'Nos hizo simular roles reales de un equipo ágil durante el curso.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['simulación', 'roles'],
        tipo: 'positivo'
      },
      {
        texto: 'Presenta el planeamiento estratégico con ejemplos de empresas reales.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['casos reales', 'planeamiento'],
        tipo: 'positivo'
      },
      {
        texto: 'Tiene experiencia clara en gestión de proyectos y lo transmite.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['experiencia', 'gestión'],
        tipo: 'positivo'
      },
      {
        texto: 'Usa herramientas como Jira, Trello y Miro de forma pedagógica.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['herramientas', 'pedagogía'],
        tipo: 'positivo'
      },
      {
        texto: 'Nos retó a aplicar OKRs en proyectos de clase.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['OKRs', 'proyectos'],
        tipo: 'positivo'
      },
      {
        texto: 'Fomenta la autoevaluación y mejora continua.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['mejora continua', 'autoevaluación'],
        tipo: 'positivo'
      },
      {
        texto: 'Enseñó a escribir bien historias de usuario y hacer grooming.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['historias usuario', 'grooming'],
        tipo: 'positivo'
      },
      {
        texto: 'Sus evaluaciones se enfocan en desempeño, no solo teoría.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['evaluación', 'desempeño'],
        tipo: 'positivo'
      },
      {
        texto: 'Organiza debates sobre prácticas ágiles versus tradicionales.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['debates', 'metodologías'],
        tipo: 'positivo'
      },
      {
        texto: 'A veces repite conceptos, pero lo hace para asegurar comprensión.',
        calificacion: 4,
        likes: Math.floor(Math.random() * 30),
        temas: ['metodología', 'comprensión'],
        tipo: 'positivo'
      },
      {
        texto: 'Comparte casos reales de éxito y fracaso, muy ilustrativos.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['casos reales', 'aprendizaje'],
        tipo: 'positivo'
      },
      {
        texto: 'Da consejos útiles para certificaciones como Scrum Master.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['certificaciones', 'consejos'],
        tipo: 'positivo'
      },
      {
        texto: 'Interesante enfoque interdisciplinario en gestión de TI.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['gestión TI', 'interdisciplina'],
        tipo: 'positivo'
      },
      {
        texto: 'Excelente combinación de teoría y práctica en agilidad.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['teoría', 'práctica'],
        tipo: 'positivo'
      }
    ]
  },
  {
    profesor: 'CARMEN, DELGADILLO Elvis Wilfredo',
    comentarios: [
      {
        texto: 'Enseña a entrevistar usuarios simulando casos reales.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['entrevistas', 'casos reales'],
        tipo: 'positivo'
      },
      {
        texto: 'Muy claro al explicar casos de uso y diagramas UML.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['UML', 'casos de uso'],
        tipo: 'positivo'
      },
      {
        texto: 'Evalúa proyectos con enfoque en requerimientos bien documentados.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['documentación', 'requerimientos'],
        tipo: 'positivo'
      },
      {
        texto: 'Fomenta el trabajo en grupos pequeños con feedback continuo.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['trabajo grupal', 'feedback'],
        tipo: 'positivo'
      },
      {
        texto: 'Usa muchos ejemplos del sector bancario y e-commerce.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['ejemplos', 'sectores'],
        tipo: 'positivo'
      },
      {
        texto: 'A veces falta dinamismo, pero el contenido es muy sólido.',
        calificacion: 4,
        likes: Math.floor(Math.random() * 30),
        temas: ['dinamismo', 'contenido'],
        tipo: 'positivo'
      },
      {
        texto: 'Enseñó a construir prototipos de baja fidelidad antes de pasar a diseño.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['prototipos', 'diseño'],
        tipo: 'positivo'
      },
      {
        texto: 'Comparte formatos para historias de usuario y requisitos no funcionales.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['formatos', 'requisitos'],
        tipo: 'positivo'
      },
      {
        texto: 'Excelente manejo de herramientas como Lucidchart y Bizagi.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['herramientas', 'modelado'],
        tipo: 'positivo'
      },
      {
        texto: 'Da retroalimentación muy específica sobre la claridad de requisitos.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['feedback', 'requisitos'],
        tipo: 'positivo'
      },
      {
        texto: 'Nos ayudó a identificar ambigüedades en nuestras propuestas.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['análisis', 'propuestas'],
        tipo: 'positivo'
      },
      {
        texto: 'Siempre disponible a revisar avances fuera de clase.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['disponibilidad', 'apoyo'],
        tipo: 'positivo'
      },
      {
        texto: 'Nos orientó en cómo redactar documentos formales para clientes.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['documentación', 'comunicación'],
        tipo: 'positivo'
      },
      {
        texto: 'Brinda ejemplos de malas prácticas y cómo evitarlas.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['buenas prácticas', 'ejemplos'],
        tipo: 'positivo'
      },
      {
        texto: 'Hace énfasis en la comunicación clara con stakeholders.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['comunicación', 'stakeholders'],
        tipo: 'positivo'
      }
    ]
  },
  {
    profesor: 'MERCADO, RIVAS Richard Yuri',
    comentarios: [
      {
        texto: 'Enseña SQL con muchos casos prácticos desde el primer día.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['SQL', 'práctica'],
        tipo: 'positivo'
      },
      {
        texto: 'Excelente forma de explicar relaciones y normalización.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['relaciones', 'normalización'],
        tipo: 'positivo'
      },
      {
        texto: 'Usa PostgreSQL y MySQL en clase, con scripts compartidos.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['herramientas', 'recursos'],
        tipo: 'positivo'
      },
      {
        texto: 'Hizo simulaciones de bases de datos reales (hospitales, tiendas).',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['simulaciones', 'casos reales'],
        tipo: 'positivo'
      },
      {
        texto: 'Explica muy bien el uso de triggers y procedimientos almacenados.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['triggers', 'procedimientos'],
        tipo: 'positivo'
      },
      {
        texto: 'A veces exige mucho detalle, pero es justo con la nota.',
        calificacion: 4,
        likes: Math.floor(Math.random() * 30),
        temas: ['exigencia', 'evaluación'],
        tipo: 'positivo'
      },
      {
        texto: 'Comparte buenas prácticas para modelado lógico y físico.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['modelado', 'buenas prácticas'],
        tipo: 'positivo'
      },
      {
        texto: 'Nos enseñó a usar pgAdmin y Workbench con confianza.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['herramientas', 'práctica'],
        tipo: 'positivo'
      },
      {
        texto: 'Enfatiza la integridad referencial y claves bien definidas.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['integridad', 'diseño'],
        tipo: 'positivo'
      },
      {
        texto: 'Evaluó con proyectos en lugar de exámenes tradicionales.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['evaluación', 'proyectos'],
        tipo: 'positivo'
      },
      {
        texto: 'Comparte errores comunes y cómo evitarlos en producción.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['errores comunes', 'producción'],
        tipo: 'positivo'
      },
      {
        texto: 'Introdujo MongoDB brevemente, para comparar con NoSQL.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['NoSQL', 'MongoDB'],
        tipo: 'positivo'
      },
      {
        texto: 'Promueve la documentación adecuada de esquemas.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['documentación', 'esquemas'],
        tipo: 'positivo'
      },
      {
        texto: 'Su experiencia en sistemas de información se nota mucho.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['experiencia', 'sistemas'],
        tipo: 'positivo'
      },
      {
        texto: 'Nos dio pautas para mantener bases eficientes y seguras.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 30),
        temas: ['eficiencia', 'seguridad'],
        tipo: 'positivo'
      }
    ]
  },
  // CRUZ VERA, Manuel Jesús
  {
    profesor: 'CRUZ VERA, Manuel Jesús',
    comentarios: [
      {
        texto: 'El profesor Cruz tiene una metodología muy estructurada para enseñar Ingeniería de Software. Sus ejemplos prácticos de casos reales ayudan mucho a entender los conceptos. Sin embargo, a veces va muy rápido con los temas.',
        calificacion: 4,
        likes: Math.floor(Math.random() * 15),
        temas: ['metodología', 'ejemplos prácticos', 'ritmo de clase'],
        tipo: 'positivo'
      },
      {
        texto: 'Excelente manejo de los conceptos de arquitectura de software. El profesor relaciona muy bien la teoría con proyectos reales. Las evaluaciones son justas y acordes al contenido.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 15),
        temas: ['dominio del tema', 'evaluación justa', 'aplicación práctica'],
        tipo: 'positivo'
      },
      {
        texto: 'Sus clases de Desarrollo Web son muy actualizadas, siempre trae las últimas tendencias y tecnologías. Aunque a veces falta más tiempo para practicar en clase.',
        calificacion: 4,
        likes: Math.floor(Math.random() * 15),
        temas: ['actualización', 'tecnologías modernas', 'tiempo de práctica'],
        tipo: 'positivo'
      }
    ]
  },
  // VASQUEZ RAMOS, Laura Patricia
  {
    profesor: 'VASQUEZ RAMOS, Laura Patricia',
    comentarios: [
      {
        texto: 'La profesora Vásquez es muy dedicada en sus explicaciones sobre sistemas operativos. Sus laboratorios están bien diseñados y ayudan a comprender los conceptos complejos.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 15),
        temas: ['dedicación', 'diseño de laboratorios', 'explicaciones claras'],
        tipo: 'positivo'
      },
      {
        texto: 'El curso de Computación Paralela fue retador pero muy interesante. La profesora domina el tema y motiva a los estudiantes a investigar por su cuenta.',
        calificacion: 4,
        likes: Math.floor(Math.random() * 15),
        temas: ['motivación', 'dominio del tema', 'investigación'],
        tipo: 'positivo'
      },
      {
        texto: 'A veces las tareas son muy extensas y con plazos cortos. Sin embargo, la profesora está siempre dispuesta a resolver dudas por correo.',
        calificacion: 3,
        likes: Math.floor(Math.random() * 15),
        temas: ['carga de trabajo', 'disponibilidad', 'comunicación'],
        tipo: 'neutral'
      }
    ]
  },
  // MIRANDA LOPEZ, Carlos Eduardo
  {
    profesor: 'MIRANDA LOPEZ, Carlos Eduardo',
    comentarios: [
      {
        texto: 'El profesor Miranda tiene un conocimiento profundo de bases de datos. Sus explicaciones sobre normalización y diseño son muy claras. El proyecto final fue muy útil para el aprendizaje.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 15),
        temas: ['conocimiento profundo', 'claridad', 'proyecto práctico'],
        tipo: 'positivo'
      },
      {
        texto: 'La forma en que enseña Minería de Datos es muy práctica. Usa herramientas actuales y casos reales. Los ejercicios en clase son muy útiles.',
        calificacion: 4,
        likes: Math.floor(Math.random() * 15),
        temas: ['enfoque práctico', 'herramientas actuales', 'ejercicios útiles'],
        tipo: 'positivo'
      },
      {
        texto: 'Las evaluaciones son exigentes pero justas. El profesor da retroalimentación detallada que ayuda a mejorar. Sería bueno tener más sesiones de práctica.',
        calificacion: 4,
        likes: Math.floor(Math.random() * 15),
        temas: ['evaluación', 'retroalimentación', 'práctica'],
        tipo: 'positivo'
      }
    ]
  },
  // TORRES VALENCIA, Andrea María
  {
    profesor: 'TORRES VALENCIA, Andrea María',
    comentarios: [
      {
        texto: 'La profesora Torres tiene una capacidad extraordinaria para explicar conceptos complejos de IA. Sus ejemplos son muy claros y conecta bien la teoría con aplicaciones prácticas.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 15),
        temas: ['claridad', 'ejemplos prácticos', 'conexión teoría-práctica'],
        tipo: 'positivo'
      },
      {
        texto: 'El curso de Machine Learning fue desafiante pero muy bien estructurado. La profesora proporciona recursos adicionales muy útiles y está siempre dispuesta a ayudar.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 15),
        temas: ['estructura del curso', 'recursos', 'apoyo docente'],
        tipo: 'positivo'
      },
      {
        texto: 'A veces los proyectos son muy ambiciosos para el tiempo disponible, aunque son interesantes. Sería bueno tener más tiempo para desarrollarlos completamente.',
        calificacion: 4,
        likes: Math.floor(Math.random() * 15),
        temas: ['proyectos', 'gestión del tiempo', 'carga de trabajo'],
        tipo: 'neutral'
      }
    ]
  },
  // RAMIREZ CASTRO, Felipe Andrés
  {
    profesor: 'RAMIREZ CASTRO, Felipe Andrés',
    comentarios: [
      {
        texto: 'El profesor Ramírez tiene un conocimiento impresionante de redes. Las prácticas de laboratorio están muy bien diseñadas y son fundamentales para el aprendizaje.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 15),
        temas: ['conocimiento técnico', 'prácticas de laboratorio', 'diseño del curso'],
        tipo: 'positivo'
      },
      {
        texto: 'En Seguridad Informática, el profesor mantiene el contenido muy actualizado con casos recientes. Sus análisis de vulnerabilidades son muy instructivos.',
        calificacion: 4,
        likes: Math.floor(Math.random() * 15),
        temas: ['actualización', 'casos prácticos', 'análisis'],
        tipo: 'positivo'
      },
      {
        texto: 'El curso es exigente y requiere mucha dedicación. Los exámenes son difíciles pero justos. La comunicación podría mejorar fuera de clase.',
        calificacion: 4,
        likes: Math.floor(Math.random() * 15),
        temas: ['exigencia', 'evaluación', 'comunicación'],
        tipo: 'neutral'
      }
    ]
  },
  // ORTIZ MENDOZA, Patricia Elena
  {
    profesor: 'ORTIZ MENDOZA, Patricia Elena',
    comentarios: [
      {
        texto: 'La profesora Ortiz transmite muy bien su experiencia en gestión de proyectos. Sus casos de estudio son realistas y ayudan a entender los desafíos reales en la industria.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 15),
        temas: ['experiencia práctica', 'casos de estudio', 'aplicación real'],
        tipo: 'positivo'
      },
      {
        texto: 'Excelente enfoque en metodologías ágiles. La profesora organiza simulaciones de sprints que son muy útiles para entender Scrum y Kanban en la práctica.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 15),
        temas: ['metodologías ágiles', 'simulaciones', 'aprendizaje práctico'],
        tipo: 'positivo'
      },
      {
        texto: 'Las presentaciones grupales toman mucho tiempo de clase. Aunque son útiles, a veces limitan el tiempo para cubrir otros temas importantes.',
        calificacion: 4,
        likes: Math.floor(Math.random() * 15),
        temas: ['gestión del tiempo', 'presentaciones', 'cobertura de temas'],
        tipo: 'neutral'
      }
    ]
  },
  // MONTERO SILVA, Roberto José
  {
    profesor: 'MONTERO SILVA, Roberto José',
    comentarios: [
      {
        texto: 'El profesor Montero tiene gran experiencia en desarrollo móvil. Sus proyectos están bien pensados y ayudan a entender el ciclo completo de desarrollo de una app.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 15),
        temas: ['experiencia práctica', 'proyectos', 'desarrollo integral'],
        tipo: 'positivo'
      },
      {
        texto: 'Excelente manejo de Android Studio y las mejores prácticas de desarrollo. El profesor está actualizado con las últimas tendencias y funcionalidades.',
        calificacion: 4,
        likes: Math.floor(Math.random() * 15),
        temas: ['herramientas actuales', 'mejores prácticas', 'actualización'],
        tipo: 'positivo'
      },
      {
        texto: 'Las clases de iOS son retadoras pero muy completas. A veces el ritmo es intenso, pero el profesor siempre está disponible para consultas.',
        calificacion: 4,
        likes: Math.floor(Math.random() * 15),
        temas: ['ritmo de clase', 'disponibilidad', 'apoyo docente'],
        tipo: 'neutral'
      }
    ]
  },
  // PALACIOS RIOS, Ana María
  {
    profesor: 'PALACIOS RIOS, Ana María',
    comentarios: [
      {
        texto: 'La profesora Palacios tiene un enfoque muy práctico para enseñar UX/UI. Sus talleres de diseño son muy útiles y fomentan la creatividad.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 15),
        temas: ['enfoque práctico', 'talleres', 'creatividad'],
        tipo: 'positivo'
      },
      {
        texto: 'Excelente balance entre teoría y práctica en el curso de IHC. La profesora usa ejemplos actuales y relevantes de la industria.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 15),
        temas: ['balance teoría-práctica', 'ejemplos relevantes', 'actualidad'],
        tipo: 'positivo'
      },
      {
        texto: 'Las revisiones de diseño pueden ser más detalladas. Aunque la profesora da buenos consejos, a veces falta más tiempo para feedback individual.',
        calificacion: 4,
        likes: Math.floor(Math.random() * 15),
        temas: ['revisiones', 'feedback', 'tiempo de atención'],
        tipo: 'neutral'
      }
    ]
  },
  // HERRERA CAMPOS, Miguel Ángel
  {
    profesor: 'HERRERA CAMPOS, Miguel Ángel',
    comentarios: [
      {
        texto: 'El profesor Herrera explica muy bien los conceptos matemáticos detrás de la computación gráfica. Sus demostraciones son muy visuales y ayudan a entender temas complejos.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 15),
        temas: ['explicaciones claras', 'demostraciones', 'conceptos matemáticos'],
        tipo: 'positivo'
      },
      {
        texto: 'El curso de Realidad Virtual es fascinante. El profesor trae equipos para prácticas y nos permite experimentar con diferentes tecnologías.',
        calificacion: 5,
        likes: Math.floor(Math.random() * 15),
        temas: ['tecnología práctica', 'experimentación', 'recursos'],
        tipo: 'positivo'
      },
      {
        texto: 'Los proyectos son desafiantes y requieren mucho tiempo. Aunque son interesantes, a veces la carga de trabajo es muy alta.',
        calificacion: 4,
        likes: Math.floor(Math.random() * 15),
        temas: ['proyectos', 'carga de trabajo', 'desafíos'],
        tipo: 'neutral'
      }
    ]
  }
  // ... Y así sucesivamente con todos los profesores
];

const profesores = [
    {
        profesor: {
            nombre: "URBANO, GRADOS Oscar Antonio",
            cursos: ["Base de Datos", "Sistemas Operativos", "Programación Web"]
        },
        comentarios: comentariosPorProfesor.find(p => p.profesor === "URBANO, GRADOS Oscar Antonio").comentarios
    },
    {
        profesor: {
            nombre: "CAMBORDA, ZAMUDIO María Gabriela",
            cursos: ["Matemáticas", "Estadística", "Álgebra Lineal"]
        },
        comentarios: comentariosPorProfesor.find(p => p.profesor === "CAMBORDA, ZAMUDIO María Gabriela").comentarios
    },
    {
        profesor: {
            nombre: "CERRON, OCHOA Juan Silvio",
            cursos: ["Algoritmos", "Estructuras de Datos", "Programación Avanzada"]
        },
        comentarios: comentariosPorProfesor.find(p => p.profesor === "CERRON, OCHOA Juan Silvio").comentarios
    },
    {
        profesor: {
            nombre: "GUEVARA, JIMENEZ Jorge Alfredo",
            cursos: ["Diseño de Software", "Patrones de Diseño", "Arquitectura de Software"]
        },
        comentarios: comentariosPorProfesor.find(p => p.profesor === "GUEVARA, JIMENEZ Jorge Alfredo").comentarios
    },
    {
        profesor: {
            nombre: "MELGAR, ALIAGA Freud Enrique",
            cursos: ["Fundamentos de Cloud", "Seguridad en la Nube", "DevOps"]
        },
        comentarios: comentariosPorProfesor.find(p => p.profesor === "MELGAR, ALIAGA Freud Enrique").comentarios
    },
    {
        profesor: {
            nombre: "FERNANDEZ, RIVERA Diego Alejandro",
            cursos: ["Introducción a los Videojuegos", "Programación en Unity", "C# para Videojuegos"]
        },
        comentarios: comentariosPorProfesor.find(p => p.profesor === "FERNANDEZ, RIVERA Diego Alejandro").comentarios
    },
    {
        profesor: {
            nombre: "OSORIO, CONTRERAS Rosario Delia",
            cursos: ["Estructuras de Datos Avanzadas", "Algoritmos de Búsqueda y Ordenamiento", "Análisis de Algoritmos"]
        },
        comentarios: comentariosPorProfesor.find(p => p.profesor === "OSORIO, CONTRERAS Rosario Delia").comentarios
    },
    {
        profesor: {
            nombre: "PEÑA, GARCIA Guillermo Eduardo",
            cursos: ["Desarrollo Web Frontend", "HTML y CSS", "JavaScript y jQuery"]
        },
        comentarios: comentariosPorProfesor.find(p => p.profesor === "PEÑA, GARCIA Guillermo Eduardo").comentarios
    },
    {
        profesor: {
            nombre: "ROJAS, MORENO Carol Roxana",
            cursos: ["Programación Orientada a Objetos", "Java para Principiantes", "Python para Todos"]
        },
        comentarios: comentariosPorProfesor.find(p => p.profesor === "ROJAS, MORENO Carol Roxana").comentarios
    },
    {
        profesor: {
            nombre: "MEDINA, RAYMUNDO Carlos Alberto",
            cursos: ["Arquitectura de Computadoras", "Sistemas Digitales", "Microprocesadores"]
        },
        comentarios: comentariosPorProfesor.find(p => p.profesor === "MEDINA, RAYMUNDO Carlos Alberto").comentarios
    },
    {
        profesor: {
            nombre: "ALMIDON, ORTIZ Carlos",
            cursos: ["Lógica Computacional", "Matemáticas Discretas", "Teoría de Conjuntos"]
        },
        comentarios: comentariosPorProfesor.find(p => p.profesor === "ALMIDON, ORTIZ Carlos").comentarios
    },
    {
        profesor: {
            nombre: "CHUMPITAZ, VELEZ Jorge Luis",
            cursos: ["Gestión de Proyectos", "Metodologías Ágiles", "Scrum y Kanban"]
        },
        comentarios: comentariosPorProfesor.find(p => p.profesor === "CHUMPITAZ, VELEZ Jorge Luis").comentarios
    },
    {
        profesor: {
            nombre: "CARMEN, DELGADILLO Elvis Wilfredo",
            cursos: ["Análisis y Diseño de Sistemas", "UML y Modelado de Negocios", "Requerimientos de Software"]
        },
        comentarios: comentariosPorProfesor.find(p => p.profesor === "CARMEN, DELGADILLO Elvis Wilfredo").comentarios
    },
    {
        profesor: {
            nombre: "MERCADO, RIVAS Richard Yuri",
            cursos: ["Bases de Datos", "SQL Avanzado", "Administración de Bases de Datos"]
        },
        comentarios: comentariosPorProfesor.find(p => p.profesor === "MERCADO, RIVAS Richard Yuri").comentarios
    },
    {
        profesor: {
            nombre: "CRUZ VERA, Manuel Jesús",
            cursos: ["Ingeniería de Software", "Desarrollo Web", "Metodologías Ágiles"]
        },
        comentarios: comentariosPorProfesor.find(p => p.profesor === "CRUZ VERA, Manuel Jesús").comentarios
    },
    {
        profesor: {
            nombre: "VASQUEZ RAMOS, Laura Patricia",
            cursos: ["Sistemas Operativos", "Computación Paralela", "Arquitectura de Computadoras"]
        },
        comentarios: comentariosPorProfesor.find(p => p.profesor === "VASQUEZ RAMOS, Laura Patricia").comentarios
    },
    {
        profesor: {
            nombre: "MIRANDA LOPEZ, Carlos Eduardo",
            cursos: ["Bases de Datos", "Minería de Datos", "SQL y NoSQL"]
        },
        comentarios: comentariosPorProfesor.find(p => p.profesor === "MIRANDA LOPEZ, Carlos Eduardo").comentarios
    },
    {
        profesor: {
            nombre: "TORRES VALENCIA, Andrea María",
            cursos: ["Inteligencia Artificial", "Machine Learning", "Deep Learning"]
        },
        comentarios: comentariosPorProfesor.find(p => p.profesor === "TORRES VALENCIA, Andrea María").comentarios
    },
    {
        profesor: {
            nombre: "RAMIREZ CASTRO, Felipe Andrés",
            cursos: ["Redes de Computadoras", "Seguridad Informática", "Firewalls y VPNs"]
        },
        comentarios: comentariosPorProfesor.find(p => p.profesor === "RAMIREZ CASTRO, Felipe Andrés").comentarios
    },
    {
        profesor: {
            nombre: "ORTIZ MENDOZA, Patricia Elena",
            cursos: ["Gestión de Proyectos de Software", "Metodologías Ágiles", "Scrum Master"]
        },
        comentarios: comentariosPorProfesor.find(p => p.profesor === "ORTIZ MENDOZA, Patricia Elena").comentarios
    },
    {
        profesor: {
            nombre: "MONTERO SILVA, Roberto José",
            cursos: ["Desarrollo Móvil Android", "Desarrollo Móvil iOS", "Flutter y Dart"]
        },
        comentarios: comentariosPorProfesor.find(p => p.profesor === "MONTERO SILVA, Roberto José").comentarios
    },
    {
        profesor: {
            nombre: "PALACIOS RIOS, Ana María",
            cursos: ["UX/UI Design", "Investigación de Usuarios", "Prototipado y Pruebas"]
        },
        comentarios: comentariosPorProfesor.find(p => p.profesor === "PALACIOS RIOS, Ana María").comentarios
    },
    {
        profesor: {
            nombre: "HERRERA CAMPOS, Miguel Ángel",
            cursos: ["Matemáticas para Computación", "Cálculo Numérico", "Álgebra Lineal Computacional"]
        },
        comentarios: comentariosPorProfesor.find(p => p.profesor === "HERRERA CAMPOS, Miguel Ángel").comentarios
    }
];

async function poblarComentarios() {
  await db();
  
  for (const profData of comentariosPorProfesor) {
    const profesor = await Profesor.findOne({ nombre: profData.profesor });
    if (!profesor) {
      console.log(`Profesor no encontrado: ${profData.profesor}`);
      continue;
    }

    // Obtener todos los cursos del profesor
    const cursos = await Curso.find({ _id: { $in: profesor.cursos } });
    
    for (const comentarioData of profData.comentarios) {
      // Seleccionar un curso aleatorio de los que enseña el profesor
      const cursoAleatorio = cursos[Math.floor(Math.random() * cursos.length)];
      if (!cursoAleatorio) {
        console.log(`No se encontraron cursos para el profesor: ${profData.profesor}`);
        continue;
      }

      const analisis = sentiment.analyze(comentarioData.texto);
      
      // Evitar duplicados
      const existe = await Comentario.findOne({ 
        idProfesor: profesor._id,
        texto: comentarioData.texto
      });
      
      if (existe) continue;

      await Comentario.create({
        idEstudiante: "anonimo",
        idProfesor: profesor._id,
        nombreProfesor: profData.profesor,
        codigoCurso: cursoAleatorio.codigo,
        nombreCurso: cursoAleatorio.nombre,
        texto: comentarioData.texto,
        analisisSentimiento: analisis,
        calificacion: comentarioData.calificacion,
        likes: comentarioData.likes,
        temas: comentarioData.temas,
        fecha: new Date(Date.now() - Math.floor(Math.random() * 7776000000)) // Random date within last 90 days
      });

      console.log(`Comentario insertado para ${profData.profesor} - ${cursoAleatorio.nombre}`);
    }

    // Actualizar análisis del profesor
    let analisis = await AnalisisProfesor.findOne({ idProfesor: profesor._id });
    if (!analisis) {
      analisis = new AnalisisProfesor({
        idProfesor: profesor._id,
        totalComentarios: profData.comentarios.length,
        calificacionPromedio: profData.comentarios.reduce((acc, curr) => acc + curr.calificacion, 0) / profData.comentarios.length,
        distribucionSentimientos: {
          positivos: profData.comentarios.filter(c => c.tipo === 'positivo').length,
          neutrales: profData.comentarios.filter(c => c.tipo === 'neutral').length,
          negativos: profData.comentarios.filter(c => c.tipo === 'crítico').length
        }
      });
      await analisis.save();
    }
  }
  
  mongoose.disconnect();
}

async function agregarComentariosProfesor(profesor, comentarios) {
    try {
        // Buscar al profesor en la base de datos
        const profesorDoc = await Profesor.findOne({ nombre: profesor.nombre });
        if (!profesorDoc) {
            console.log(`Profesor no encontrado: ${profesor.nombre}`);
            return;
        }

        // Obtener los cursos del profesor
        const cursos = await Curso.find({ profesor: profesorDoc._id });
        if (cursos.length === 0) {
            console.log(`No se encontraron cursos para: ${profesor.nombre}`);
            return;
        }

        // Para cada comentario
        for (const comentario of comentarios) {
            // Seleccionar un curso aleatorio del profesor
            const cursoAleatorio = cursos[Math.floor(Math.random() * cursos.length)];
            
            // Generar una fecha aleatoria en los últimos 6 meses
            const fechaAleatoria = new Date();
            fechaAleatoria.setMonth(fechaAleatoria.getMonth() - Math.floor(Math.random() * 6));

            // Realizar análisis de sentimiento
            const analisisSentimiento = sentiment.analyze(comentario.texto);

            // Crear el comentario
            const nuevoComentario = new Comentario({
                idProfesor: profesorDoc._id,
                nombreProfesor: profesor.nombre,
                codigoCurso: cursoAleatorio.codigo,
                nombreCurso: cursoAleatorio.nombre,
                calificacion: comentario.calificacion,
                texto: comentario.texto,
                fechaHora: fechaAleatoria,
                likes: Math.floor(Math.random() * 30), // 0-29 likes
                temas: comentario.temas,
                analisisSentimiento: {
                    score: analisisSentimiento.score,
                    comparative: analisisSentimiento.comparative,
                    tipo: comentario.tipo
                }
            });

            await nuevoComentario.save();
        }

        console.log(`Comentarios agregados para: ${profesor.nombre}`);
    } catch (error) {
        console.error(`Error al agregar comentarios para ${profesor.nombre}:`, error);
    }
}

// Función principal para ejecutar el seed
async function main() {
    try {
        // Conectar a la base de datos
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/edufeedback', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Conexión a MongoDB establecida');

        // Limpiar comentarios existentes
        await Comentario.deleteMany({});
        console.log('Comentarios previos eliminados');

        // Procesar cada profesor y sus comentarios
        for (const profesor of profesores) {
            await agregarComentariosProfesor(profesor.profesor, profesor.comentarios);
        }

        console.log('Seed completado exitosamente');
        process.exit(0);
    } catch (error) {
        console.error('Error durante el seed:', error);
        process.exit(1);
    }
}

// Ejecutar el seed
main();
