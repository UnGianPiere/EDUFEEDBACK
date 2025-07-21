// server/seeds/seed_comentarios_completa.js
// Seed para poblar comentarios realistas y detallados para todos los profesores existentes

const mongoose = require('mongoose');
const Profesor = require('../models/Profesor');
const Curso = require('../models/Curso');
const Comentario = require('../models/Comentario');
const AnalisisProfesor = require('../models/AnalisisProfesor');
const Sentiment = require('sentiment');
const sentiment = new Sentiment();
const db = require('../config/db');

const comentariosPorProfesor = [
  {
    profesor: 'URBANO, GRADOS Oscar Antonio',
    curso: 'ARQUITECTURA ORIENTADA A SERVICIOS',
    tipo: 'crítico',
    comentarios: [
      'La clase empezó tarde y sin una estructura clara. Fue difícil seguir el tema.',
      'No explica bien los conceptos clave de arquitectura, todo queda muy abstracto.',
      'Utiliza presentaciones desactualizadas que no conectan con los retos actuales.',
      'No resolvía dudas, solo repetía lo mismo sin dar ejemplos claros.',
      'Se limita a leer diapositivas, sin contextualizar ni generar discusión.',
      'A menudo improvisa y se nota la falta de planificación.',
      'Las clases son monótonas y cuesta mantener la atención.',
      'No brinda material adicional ni ejemplos reales, todo es teoría plana.',
      'Mejoró un poco hacia el segundo mes, pero aún falta orden y claridad.',
      'Podría integrar más herramientas prácticas y hacer la clase participativa.',
      'Cuando le pedimos ejemplos, responde de forma muy genérica.',
      'Tiene experiencia, pero necesita mejorar su forma de comunicarla.',
      'Podría enriquecer sus clases si usara casos reales o discusiones.',
      'Da buenas ideas pero las deja a medias, falta seguimiento.',
      'Se nota que intenta mejorar, pero debería abrir más espacio para preguntas.'
    ]
  },
  {
    profesor: 'URBANO, GRADOS Oscar Antonio',
    curso: 'SISTEMAS DE INFORMACIÓN INTEGRADOS',
    tipo: 'crítico',
    comentarios: [
      'La clase empezó tarde y sin una estructura clara. Fue difícil seguir el tema.',
      'No explica bien los conceptos clave de arquitectura, todo queda muy abstracto.',
      'Utiliza presentaciones desactualizadas que no conectan con los retos actuales.',
      'No resolvía dudas, solo repetía lo mismo sin dar ejemplos claros.',
      'Se limita a leer diapositivas, sin contextualizar ni generar discusión.',
      'A menudo improvisa y se nota la falta de planificación.',
      'Las clases son monótonas y cuesta mantener la atención.',
      'No brinda material adicional ni ejemplos reales, todo es teoría plana.',
      'Mejoró un poco hacia el segundo mes, pero aún falta orden y claridad.',
      'Podría integrar más herramientas prácticas y hacer la clase participativa.',
      'Cuando le pedimos ejemplos, responde de forma muy genérica.',
      'Tiene experiencia, pero necesita mejorar su forma de comunicarla.',
      'Podría enriquecer sus clases si usara casos reales o discusiones.',
      'Da buenas ideas pero las deja a medias, falta seguimiento.',
      'Se nota que intenta mejorar, pero debería abrir más espacio para preguntas.'
    ]
  },
  {
    profesor: 'CERRON, OCHOA Juan Silvio',
    curso: 'TÉCNICAS DE PROGRAMACIÓN',
    tipo: 'positivo',
    comentarios: [
      'Excelente forma de explicar algoritmos. Va paso a paso, sin dejar dudas.',
      'Siempre está dispuesto a ayudar incluso fuera del horario de clase.',
      'Nos animó a trabajar en proyectos reales desde el inicio.',
      'Hace ejercicios en clase que luego aparecen en los exámenes. Muy útil.',
      'Fomenta el pensamiento lógico con pequeños desafíos semanales.',
      'Tiene buena energía al enseñar. Hace dinámica la programación.',
      'Usa ejemplos actuales que conectan con el mundo laboral.',
      'Nos enseñó herramientas útiles como GitHub y VSCode.',
      'Responde todas las dudas con paciencia, incluso las más básicas.',
      'Su evaluación es justa y siempre explica los criterios.',
      'Recomienda buenas prácticas de codificación desde temprano.',
      'Valora la participación activa, siempre pregunta e involucra al grupo.',
      'Excelente manejo de pseudocódigo y estructuras básicas.',
      'A veces avanza rápido, pero da material complementario para repasar.',
      'Logró que muchos compañeros pierdan el miedo a programar.'
    ]
  },
  {
    profesor: 'GUEVARA, JIMENEZ Jorge Alfredo',
    curso: 'DISEÑO DE SOFTWARE',
    tipo: 'positivo',
    comentarios: [
      'Enseña diseño de software con ejemplos de arquitectura escalable.',
      'Muy claro al explicar patrones de diseño como MVC y Singleton.',
      'Sus clases son estructuradas, con énfasis en análisis previo a codificar.',
      'Comparte su experiencia en proyectos reales de desarrollo.',
      'Nos guió en cómo documentar bien un proyecto completo.',
      'Propuso dinámicas de roles para simular equipos ágiles.',
      'Usa herramientas como Draw.io y Trello, lo cual es muy útil.',
      'Enseña cómo escribir buenas historias de usuario y casos de uso.',
      'Promueve buenas prácticas de diseño centrado en el usuario.',
      'Hace revisiones grupales que fomentan la crítica constructiva.',
      'Nos dio plantillas útiles para procesos de desarrollo.',
      'Evalúa más por progreso que por exámenes. Enfoque moderno.',
      'Brinda ejemplos de errores comunes en diseño y cómo evitarlos.',
      'Sabe integrar procesos ágiles con estándares de calidad.',
      'Excelente guía durante nuestro primer proyecto formal.'
    ]
  },
  {
    profesor: 'GUEVARA, JIMENEZ Jorge Alfredo',
    curso: 'PROCESOS DE SOFTWARE',
    tipo: 'positivo',
    comentarios: [
      'Enseña diseño de software con ejemplos de arquitectura escalable.',
      'Muy claro al explicar patrones de diseño como MVC y Singleton.',
      'Sus clases son estructuradas, con énfasis en análisis previo a codificar.',
      'Comparte su experiencia en proyectos reales de desarrollo.',
      'Nos guió en cómo documentar bien un proyecto completo.',
      'Propuso dinámicas de roles para simular equipos ágiles.',
      'Usa herramientas como Draw.io y Trello, lo cual es muy útil.',
      'Enseña cómo escribir buenas historias de usuario y casos de uso.',
      'Promueve buenas prácticas de diseño centrado en el usuario.',
      'Hace revisiones grupales que fomentan la crítica constructiva.',
      'Nos dio plantillas útiles para procesos de desarrollo.',
      'Evalúa más por progreso que por exámenes. Enfoque moderno.',
      'Brinda ejemplos de errores comunes en diseño y cómo evitarlos.',
      'Sabe integrar procesos ágiles con estándares de calidad.',
      'Excelente guía durante nuestro primer proyecto formal.'
    ]
  },
  {
    profesor: 'MELGAR, ALIAGA Freud Enrique',
    curso: 'CLOUD COMPUTING',
    tipo: 'positivo',
    comentarios: [
      'Introdujo los fundamentos de forma muy clara y progresiva.',
      'Hizo pruebas en vivo con AWS y Google Cloud, muy didáctico.',
      'Motiva a certificarte y da tips para lograrlo.',
      'Comparte recursos gratuitos para practicar servicios en la nube.',
      'Nos explicó diferencias entre IaaS, PaaS y SaaS con casos reales.',
      'Da énfasis en la seguridad dentro de arquitecturas cloud.',
      'Enseñó Terraform y automatización en un taller práctico.',
      'Comparte documentación clara y bien organizada.',
      'Nos mostró cómo migrar servicios tradicionales al cloud.',
      'Trajo ejemplos de empresas reales usando soluciones en la nube.',
      'Da feedback personalizado en proyectos.',
      'Las prácticas fueron demandantes, pero muy útiles.',
      'Claridad total al explicar cargas de trabajo escalables.',
      'Excelente para mostrar costos y ahorro en plataformas cloud.',
      'A veces los laboratorios fallaban, pero lo resolvía rápidamente.'
    ]
  },
  {
    profesor: 'FERNANDEZ, RIVERA Diego Alejandro',
    curso: 'DESARROLLO DE VIDEOJUEGOS',
    tipo: 'positivo',
    comentarios: [
      'Introdujo Unity y C# desde lo más básico, ideal para quienes recién comienzan.',
      'Nos motivó a crear minijuegos semanales que reforzaban lo aprendido.',
      'Tiene mucha experiencia en motores gráficos, eso se nota al explicar.',
      'Enseñó a reutilizar assets y organizar bien los proyectos.',
      'Compartió plantillas propias para construir niveles en 2D.',
      'Siempre daba retroalimentación detallada en cada entrega.',
      'A veces hablaba muy rápido, pero repetía lo esencial al final.',
      'Enseña buenas prácticas de optimización gráfica.',
      'Nos hizo trabajar en equipos multidisciplinarios, como en la industria real.',
      'Se enfoca mucho en la lógica del juego antes del arte visual.',
      'Hicimos un game jam interno que fue muy divertido y formativo.',
      'Nos dio ejemplos reales del mercado indie y móvil.',
      'Brinda muy buen soporte técnico cuando surgen bugs.',
      'Explica cómo testear el juego para evitar errores comunes.',
      'Excelente docente, transmite pasión por los videojuegos.'
    ]
  },
  {
    profesor: 'OSORIO, CONTRERAS Rosario Delia',
    curso: 'ESTRUCTURA DE DATOS',
    tipo: 'positivo',
    comentarios: [
      'Excelente introducción a listas, pilas y colas. Muy bien explicado.',
      'Usa muchos diagramas para que entendamos cómo funciona la memoria.',
      'Da problemas reales para practicar recursividad y árboles.',
      'Sus clases siempre tienen ejercicios al final para consolidar el tema.',
      'Maneja muy bien los conceptos teóricos y su aplicación práctica.',
      'Tiene mucha paciencia al explicar temas complejos.',
      'Evaluaciones exigentes, pero siempre con retroalimentación.',
      'Nos enseñó a usar herramientas de visualización de estructuras.',
      'Insiste en escribir código limpio y bien documentado.',
      'Explica con claridad las ventajas de estructurar datos correctamente.',
      'Comparte links y libros para quien desea ir más allá.',
      'Fomenta mucho la participación, siempre hace preguntas en clase.',
      'Trabaja con pseudocódigo antes de pasar al lenguaje real.',
      'Excelente formadora en fundamentos de programación.',
      'Sus ejercicios son retadores pero muy formativos.'
    ]
  },
  {
    profesor: 'OSORIO, CONTRERAS Rosario Delia',
    curso: 'PROGRAMACIÓN ORIENTADA A OBJETOS',
    tipo: 'positivo',
    comentarios: [
      'Introdujo POO desde la lógica, sin complicar con sintaxis de golpe.',
      'Tiene mucha paciencia al explicar temas como herencia y polimorfismo.',
      'Evaluaciones exigentes, pero siempre con retroalimentación.',
      'Nos enseñó a usar BlueJ y Java de forma progresiva.',
      'Insiste en escribir código limpio y bien documentado.',
      'Explica con claridad las ventajas de estructurar datos correctamente.',
      'Comparte links y libros para quien desea ir más allá.',
      'Fomenta mucho la participación, siempre hace preguntas en clase.',
      'Trabaja con pseudocódigo antes de pasar al lenguaje real.',
      'Una vez nos confundimos con árboles AVL y lo explicó de nuevo sin problema.',
      'Sus ejemplos son muy prácticos y aplicables.',
      'Motiva a pensar en soluciones orientadas a objetos.',
      'Excelente balance entre teoría y práctica.',
      'Da buenos consejos sobre diseño de clases.',
      'Siempre disponible para resolver dudas extra clase.'
    ]
  },
  {
    profesor: 'PEÑA, GARCIA Guillermo Eduardo',
    curso: 'DISEÑO WEB',
    tipo: 'positivo',
    comentarios: [
      'Nos introdujo HTML y CSS con proyectos pequeños desde el primer día.',
      'Enseña a pensar en diseño responsive desde el principio.',
      'Trabajamos con Figma y luego llevamos ese diseño a código.',
      'Usa ejemplos reales como páginas de empresas o portafolios.',
      'Se enfoca mucho en la estructura semántica de los sitios.',
      'Promueve la accesibilidad y el SEO básico como parte del diseño.',
      'Clases prácticas, siempre terminamos con un mini proyecto.',
      'Nos hizo construir un clon funcional de una app conocida.',
      'Apoya mucho la creatividad de cada estudiante.',
      'Comparte librerías útiles y extensiones para el navegador.',
      'Enseña a integrar APIs simples para hacer más dinámico el sitio.',
      'Exigente con fechas, pero justo al evaluar.',
      'Muy preparado, domina tanto frontend como backend básico.',
      'Siempre propone retos extra para quienes quieren ir más allá.',
      'Hace feedback individual para mejorar nuestros diseños.'
    ]
  },
  {
    profesor: 'ROJAS, MORENO Carol Roxana',
    curso: 'TÉCNICAS DE PROGRAMACIÓN',
    tipo: 'positivo',
    comentarios: [
      'Enseña a codificar desde cero, con mucha paciencia y claridad.',
      'Nos ayudó a entender objetos y clases con ejemplos cotidianos.',
      'Da ejercicios creativos, como simulaciones de juegos o bancos.',
      'Introduce herramientas como Java y Python, según el avance del grupo.',
      'Fomenta el trabajo colaborativo en proyectos pequeños.',
      'Tiene una gran actitud y motiva a no rendirse.',
      'Explica la diferencia entre métodos y funciones con mucha claridad.',
      'Nos enseñó depuración y pruebas básicas de código.',
      'Tiene muy buenos tips para enfrentar entrevistas técnicas.',
      'Explica cómo escribir código reutilizable y modular.',
      'Usa analogías que hacen más sencillo entender programación.',
      'Nos enseñó Git y control de versiones desde temprano.',
      'Responde dudas por correo con ejemplos personalizados.',
      'Organiza desafíos semanales para practicar algoritmos.',
      'Tiene un enfoque muy pedagógico. Ideal para principiantes.'
    ]
  },
  {
    profesor: 'MEDINA, RAYMUNDO Carlos Alberto',
    curso: 'ARQUITECTURA DEL COMPUTADOR',
    tipo: 'positivo',
    comentarios: [
      'Hace simulaciones de arquitectura con diagramas claros y detallados.',
      'Comparte herramientas de simulación y lógica digital.',
      'Explica cómo se comunican los componentes del hardware.',
      'Nos ayudó a entender pipelines y jerarquía de memoria.',
      'Usa analogías muy efectivas, como comparar CPU con una cocina.',
      'Promueve la investigación en arquitecturas ARM y RISC-V.',
      'A veces se adelanta mucho, pero luego retrocede para repasar.',
      'Enseña a optimizar desde el nivel de arquitectura.',
      'Nos enseñó cómo nacen los cuellos de botella en la CPU.',
      'Fomenta el aprendizaje autodirigido con guías de lectura.',
      'Evalúa con rúbricas claras y transparentes.',
      'Sus explicaciones sobre caché son muy claras.',
      'Relaciona bien la teoría con hardware actual.',
      'Mantiene las clases interesantes con demos prácticas.',
      'Excelente balance entre teoría y ejemplos prácticos.'
    ]
  },
  {
    profesor: 'MEDINA, RAYMUNDO Carlos Alberto',
    curso: 'INGENIERÍA WEB',
    tipo: 'positivo',
    comentarios: [
      'En ingeniería web, combina teoría con frameworks como React.',
      'Hace comparación entre tecnologías para tomar decisiones en proyectos.',
      'Sus proyectos son retadores pero muy formativos.',
      'Enseña buenas prácticas de desarrollo web moderno.',
      'Explica conceptos avanzados de forma comprensible.',
      'Mantiene el contenido actualizado con tendencias actuales.',
      'Da buenos ejemplos de arquitecturas web escalables.',
      'Fomenta el uso de herramientas modernas de desarrollo.',
      'Evalúa tanto el código como la documentación.',
      'Enseña a pensar en seguridad desde el diseño.',
      'Promueve el uso de APIs RESTful bien diseñadas.',
      'Sus proyectos integran múltiples tecnologías web.',
      'Da buenos consejos sobre deployment y hosting.',
      'Explica bien conceptos de frontend y backend.',
      'Siempre disponible para consultas técnicas.'
    ]
  },
  {
    profesor: 'ALMIDON, ORTIZ Carlos',
    curso: 'MATEMÁTICA DISCRETA 2',
    tipo: 'positivo',
    comentarios: [
      'Explica lógica proposicional con tablas de verdad y muchos ejemplos.',
      'Nos dio ejercicios de razonamiento lógico que ayudaron bastante.',
      'Tiene un estilo serio pero muy metódico, ideal para este curso.',
      'Ayuda mucho en clase con la resolución paso a paso.',
      'Trabaja bastante con demostraciones por inducción, siempre explicadas.',
      'Usa problemas del estilo "olimpiadas matemáticas" para retarnos.',
      'A veces da por sentado que entendemos todo y va muy rápido.',
      'Se agradece su paciencia al explicar temas complejos como grafos.',
      'Las tareas eran retadoras, pero aplicaban los temas vistos.',
      'Hace exámenes difíciles pero coherentes con lo enseñado.',
      'Comparte artículos y notas complementarias por correo.',
      'Su experiencia se nota especialmente en temas como álgebra booleana.',
      'Promueve mucho el pensamiento crítico, no memorización.',
      'Podría mejorar un poco la dinámica, pero el contenido es excelente.',
      'Siempre abierto a responder preguntas, incluso fuera del aula.'
    ]
  },
  {
    profesor: 'CHUMPITAZ, VELEZ Jorge Luis',
    curso: 'PLANEAMIENTO ESTRATÉGICO DE LOS SI/TI',
    tipo: 'positivo',
    comentarios: [
      'Excelente enfoque práctico para enseñar SCRUM y Kanban.',
      'Nos hizo simular roles reales de un equipo ágil durante el curso.',
      'Presenta el planeamiento estratégico con ejemplos de empresas reales.',
      'Tiene experiencia clara en gestión de proyectos y lo transmite.',
      'Usa herramientas como Jira, Trello y Miro de forma pedagógica.',
      'Nos retó a aplicar OKRs en proyectos de clase.',
      'Fomenta la autoevaluación y mejora continua.',
      'Enseñó a escribir bien historias de usuario y hacer grooming.',
      'Sus evaluaciones se enfocan en desempeño, no solo teoría.',
      'Organiza debates sobre prácticas ágiles versus tradicionales.',
      'A veces repite conceptos, pero lo hace para asegurar comprensión.',
      'Comparte casos reales de éxito y fracaso, muy ilustrativos.',
      'Da consejos útiles para certificaciones como Scrum Master.',
      'Interesante enfoque interdisciplinario en gestión de TI.',
      'Excelente combinación de teoría y práctica en agilidad.'
    ]
  },
  {
    profesor: 'CARMEN, DELGADILLO Elvis Wilfredo',
    curso: 'ANÁLISIS Y REQUERIMIENTOS DE SOFTWARE',
    tipo: 'positivo',
    comentarios: [
      'Enseña a entrevistar usuarios simulando casos reales.',
      'Muy claro al explicar casos de uso y diagramas UML.',
      'Evalúa proyectos con enfoque en requerimientos bien documentados.',
      'Fomenta el trabajo en grupos pequeños con feedback continuo.',
      'Usa muchos ejemplos del sector bancario y e-commerce.',
      'A veces falta dinamismo, pero el contenido es muy sólido.',
      'Enseñó a construir prototipos de baja fidelidad antes de pasar a diseño.',
      'Comparte formatos para historias de usuario y requisitos no funcionales.',
      'Excelente manejo de herramientas como Lucidchart y Bizagi.',
      'Da retroalimentación muy específica sobre la claridad de requisitos.',
      'Nos ayudó a identificar ambigüedades en nuestras propuestas.',
      'Siempre disponible a revisar avances fuera de clase.',
      'Nos orientó en cómo redactar documentos formales para clientes.',
      'Brinda ejemplos de malas prácticas y cómo evitarlas.',
      'Hace énfasis en la comunicación clara con stakeholders.'
    ]
  },
  {
    profesor: 'MERCADO, RIVAS Richard Yuri',
    curso: 'ADMINISTRACIÓN DE BASE DE DATOS',
    tipo: 'positivo',
    comentarios: [
      'Enseña SQL con muchos casos prácticos desde el primer día.',
      'Excelente forma de explicar relaciones y normalización.',
      'Usa PostgreSQL y MySQL en clase, con scripts compartidos.',
      'Hizo simulaciones de bases de datos reales (hospitales, tiendas).',
      'Explica muy bien el uso de triggers y procedimientos almacenados.',
      'A veces exige mucho detalle, pero es justo con la nota.',
      'Comparte buenas prácticas para modelado lógico y físico.',
      'Nos enseñó a usar pgAdmin y Workbench con confianza.',
      'Enfatiza la integridad referencial y claves bien definidas.',
      'Evaluó con proyectos en lugar de exámenes tradicionales.',
      'Comparte errores comunes y cómo evitarlos en producción.',
      'Introdujo MongoDB brevemente, para comparar con NoSQL.',
      'Promueve la documentación adecuada de esquemas.',
      'Su experiencia en sistemas de información se nota mucho.',
      'Nos dio pautas para mantener bases eficientes y seguras.'
    ]
  },
  {
    profesor: 'ULLOA, TORRES Eduardo Raul',
    curso: 'SEGURIDAD DE LA INFORMACIÓN CORPORATIVA',
    tipo: 'positivo',
    comentarios: [
      'Muy actualizado con tendencias de ciberseguridad y ataques recientes.',
      'Enseñó a realizar análisis de riesgo con metodologías ISO.',
      'Simuló auditorías internas y externas con rúbricas claras.',
      'Nos enseñó a hacer un plan de respuesta ante incidentes.',
      'Comparte buenas prácticas en políticas de seguridad TI.',
      'Trajo ejemplos reales de vulnerabilidades y cómo prevenirlas.',
      'Explica criptografía básica de forma accesible.',
      'Fomenta el pensamiento ético en temas de hacking.',
      'A veces los temas legales se hacen densos, pero los simplifica bien.',
      'Muy claro al explicar la norma ISO/IEC 27001.',
      'Usa herramientas de escaneo de puertos y análisis de tráfico.',
      'Promueve la documentación detallada de controles de seguridad.',
      'Excelente enfoque en casos de seguridad web.',
      'Enseñó a escribir reportes de vulnerabilidades efectivos.',
      'Mantiene el contenido actualizado con amenazas emergentes.'
    ]
  }
  // ...existing code...
];

const tipoToCalificacion = {
  positivo: 5,
  negativo: 2,
  crítico: 3
};

async function actualizarAnalisisProfesor(profe, texto, calificacion, analisisSentimiento) {
  let analisis = await AnalisisProfesor.findOne({ idProfesor: profe._id });
  
  if (!analisis) {
    analisis = new AnalisisProfesor({
      idProfesor: profe._id,
      totalComentarios: 0,
      calificacionPromedio: 0,
      distribucionSentimientos: {
        positivos: 0,
        neutrales: 0,
        negativos: 0
      }
    });
  }

  // Actualizar totales
  analisis.totalComentarios += 1;
  
  // Actualizar calificación promedio
  const totalAnterior = (analisis.calificacionPromedio * (analisis.totalComentarios - 1));
  analisis.calificacionPromedio = (totalAnterior + calificacion) / analisis.totalComentarios;

  // Actualizar distribución de sentimientos
  if (analisisSentimiento.score > 0) {
    analisis.distribucionSentimientos.positivos += 1;
  } else if (analisisSentimiento.score < 0) {
    analisis.distribucionSentimientos.negativos += 1;
  } else {
    analisis.distribucionSentimientos.neutrales += 1;
  }

  await analisis.save();
}

async function poblarComentarios() {
  await db();
  for (const entry of comentariosPorProfesor) {
    const { profesor, curso, tipo, comentarios } = entry;
    const profe = await Profesor.findOne({ nombre: profesor });
    if (!profe) {
      console.log(`Profesor no encontrado: ${profesor}`);
      continue;
    }
    const cursoObj = await Curso.findOne({ nombre: curso });
    if (!cursoObj) {
      console.log(`Curso no encontrado: ${curso}`);
      continue;
    }
    for (const texto of comentarios) {
      // Evitar duplicados
      const existe = await Comentario.findOne({ profesor: profe._id, curso: cursoObj._id, texto });
      if (existe) continue;
      
      const analisis = sentiment.analyze(texto);
      const calificacion = tipoToCalificacion[tipo] || 3;
      
      await Comentario.create({
        idEstudiante: "anonimo",
        idProfesor: profe._id,
        nombreProfesor: profesor,
        codigoCurso: cursoObj.codigo,
        nombreCurso: curso,
        texto,
        analisisSentimiento: analisis,
        calificacion,
        fecha: new Date()
      });
      
      // Actualizar análisis del profesor
      await actualizarAnalisisProfesor(profe, texto, calificacion, analisis);
      
      console.log(`Comentario insertado para ${profesor} - ${curso}`);
    }
  }
  mongoose.disconnect();
}

poblarComentarios().then(() => {
  console.log('Seed de comentarios completa.');
  process.exit(0);
}).catch(err => {
  console.error(err);
  mongoose.disconnect();
  process.exit(1);
});
