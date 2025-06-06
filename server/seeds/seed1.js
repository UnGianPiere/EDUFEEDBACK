const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const dotenv = require("dotenv")
const Profesor = require("../models/Profesor")
const Departamento = require("../models/Departamento")
const Usuario = require("../models/Usuario")
const Comentario = require("../models/Comentario")
const Curso = require("../models/Curso")

// Cargar variables de entorno
dotenv.config()

// Conectar a MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/edufeedback")
  .then(() => console.log("Conectado a MongoDB para seeds"))
  .catch((err) => {
    console.error("Error al conectar a MongoDB:", err)
    process.exit(1)
  })

// Datos de ejemplo
const departamentos = [
  {
    nombre: "Ingeniería de Sistemas e Informática",
    idFacultad: new mongoose.Types.ObjectId(),
    cursos: [
      {
        codigo: "IS101",
        nombre: "Algoritmos y Estructuras de Datos",
        descripcion: "Fundamentos de algoritmos y estructuras de datos",
      },
      {
        codigo: "IS102",
        nombre: "Bases de Datos",
        descripcion: "Diseño y gestión de bases de datos relacionales",
      },
      {
        codigo: "IS103",
        nombre: "Redes de Computadoras",
        descripcion: "Fundamentos de redes y comunicaciones",
      },
      {
        codigo: "IS104",
        nombre: "Ingeniería de Software",
        descripcion: "Metodologías y procesos de desarrollo de software",
      },
      {
        codigo: "IS105",
        nombre: "Inteligencia Artificial",
        descripcion: "Fundamentos de inteligencia artificial y aprendizaje automático",
      },
      {
        codigo: "IS106",
        nombre: "Programación Web",
        descripcion: "Desarrollo de aplicaciones web",
      },
      {
        codigo: "IS107",
        nombre: "Seguridad Informática",
        descripcion: "Principios y técnicas de seguridad en sistemas informáticos",
      },
      {
        codigo: "IS108",
        nombre: "Sistemas Operativos",
        descripcion: "Fundamentos y administración de sistemas operativos",
      },
      {
        codigo: "IS109",
        nombre: "Arquitectura de Computadoras",
        descripcion: "Diseño y organización de sistemas de computación",
      },
      {
        codigo: "IS110",
        nombre: "Desarrollo de Aplicaciones Móviles",
        descripcion: "Creación de aplicaciones para dispositivos móviles",
      },
    ],
  },
  {
    nombre: "Ingeniería Civil",
    idFacultad: new mongoose.Types.ObjectId(),
    cursos: [
      {
        codigo: "IC101",
        nombre: "Mecánica de Suelos",
        descripcion: "Estudio del comportamiento de suelos bajo cargas",
      },
      {
        codigo: "IC102",
        nombre: "Estructuras",
        descripcion: "Análisis y diseño de estructuras",
      },
    ],
  },
  {
    nombre: "Ingeniería Eléctrica",
    idFacultad: new mongoose.Types.ObjectId(),
    cursos: [
      {
        codigo: "IE101",
        nombre: "Circuitos Eléctricos",
        descripcion: "Fundamentos de circuitos eléctricos",
      },
      {
        codigo: "IE102",
        nombre: "Electrónica Digital",
        descripcion: "Diseño y análisis de sistemas digitales",
      },
    ],
  },
]

// Cursos generales (no asociados a ningún departamento específico)
const cursosGenerales = [
  {
    codigo: "GEN001",
    nombre: "Ética Profesional",
    descripcion: "Principios éticos aplicados a la profesión universitaria",
    departamento: "General",
  },
  {
    codigo: "GEN002",
    nombre: "Comunicación Efectiva",
    descripcion: "Técnicas de comunicación oral y escrita para profesionales",
    departamento: "General",
  },
  {
    codigo: "GEN003",
    nombre: "Gestión del Tiempo",
    descripcion: "Herramientas y estrategias para la administración eficiente del tiempo",
    departamento: "General",
  },
]

// Nueva declaración de cursos: departamentos + generales
const cursos = [
  ...departamentos.flatMap((dep) =>
    dep.cursos.map((curso) => ({
      ...curso,
      departamento: dep.nombre,
    }))
  ),
  ...cursosGenerales,
]

const profesores = [
  {
    nombre: "Dr. Carlos Ramírez",
    cursos: ["IS101", "IS109"],
    departamento: "Ingeniería de Sistemas e Informática",
    especializacion: "Algoritmos y Computación",
    correo: "c.ramirez@continental.edu.pe",
    oficina: "Edificio A, Oficina 302",
    horarioAtencion: "Lunes y Miércoles 14:00-16:00",
  },
  {
    nombre: "Dra. Ana Martínez",
    cursos: ["IS102"],
    departamento: "Ingeniería de Sistemas e Informática",
    especializacion: "Bases de Datos y Sistemas de Información",
    correo: "a.martinez@continental.edu.pe",
    oficina: "Edificio B, Oficina 201",
    horarioAtencion: "Martes y Jueves 10:00-12:00",
  },
  {
    nombre: "Prof. Luis Hernández",
    cursos: ["IS103", "IS107"],
    departamento: "Ingeniería de Sistemas e Informática",
    especializacion: "Redes y Seguridad",
    correo: "l.hernandez@continental.edu.pe",
    oficina: "Edificio C, Oficina 105",
    horarioAtencion: "Viernes 09:00-13:00",
  },
  {
    nombre: "Ing. Patricia Gómez",
    cursos: ["IS104"],
    departamento: "Ingeniería de Sistemas e Informática",
    especializacion: "Ingeniería de Software",
    correo: "p.gomez@continental.edu.pe",
    oficina: "Edificio A, Oficina 210",
    horarioAtencion: "Lunes y Miércoles 09:00-11:00",
  },
  {
    nombre: "Dr. Roberto Sánchez",
    cursos: ["IS105"],
    departamento: "Ingeniería de Sistemas e Informática",
    especializacion: "Inteligencia Artificial",
    correo: "r.sanchez@continental.edu.pe",
    oficina: "Edificio D, Oficina 405",
    horarioAtencion: "Martes y Jueves 15:00-17:00",
  },
  {
    nombre: "Ing. María Torres",
    cursos: ["IS106", "IS110"],
    departamento: "Ingeniería de Sistemas e Informática",
    especializacion: "Desarrollo de Aplicaciones",
    correo: "m.torres@continental.edu.pe",
    oficina: "Edificio B, Oficina 310",
    horarioAtencion: "Miércoles y Viernes 13:00-15:00",
  },
  {
    nombre: "Dr. Javier López",
    cursos: ["IS108"],
    departamento: "Ingeniería de Sistemas e Informática",
    especializacion: "Sistemas Operativos",
    correo: "j.lopez@continental.edu.pe",
    oficina: "Edificio A, Oficina 405",
    horarioAtencion: "Lunes y Jueves 16:00-18:00",
  },
  {
    nombre: "Dra. Carmen Díaz",
    cursos: ["IS101"],
    departamento: "Ingeniería de Sistemas e Informática",
    especializacion: "Algoritmos y Computación",
    correo: "c.diaz@continental.edu.pe",
    oficina: "Edificio B, Oficina 205",
    horarioAtencion: "Martes y Viernes 10:00-12:00",
  },
  {
    nombre: "Ing. Fernando Vargas",
    cursos: ["IS104", "IS106"],
    departamento: "Ingeniería de Sistemas e Informática",
    especializacion: "Desarrollo de Software",
    correo: "f.vargas@continental.edu.pe",
    oficina: "Edificio C, Oficina 301",
    horarioAtencion: "Miércoles 14:00-18:00",
  },
  {
    nombre: "Prof. Laura Mendoza",
    cursos: ["IS102", "IS109"],
    departamento: "Ingeniería de Sistemas e Informática",
    especializacion: "Bases de Datos",
    correo: "l.mendoza@continental.edu.pe",
    oficina: "Edificio A, Oficina 208",
    horarioAtencion: "Jueves 09:00-13:00",
  },
  {
    nombre: "Dr. Miguel Ángel Castro",
    cursos: ["IS105", "IS110"],
    departamento: "Ingeniería de Sistemas e Informática",
    especializacion: "Inteligencia Artificial y Desarrollo Móvil",
    correo: "m.castro@continental.edu.pe",
    oficina: "Edificio D, Oficina 410",
    horarioAtencion: "Lunes y Viernes 15:00-17:00",
  },
  {
    nombre: "Ing. Sofía Rodríguez",
    cursos: ["IS103", "IS107"],
    departamento: "Ingeniería de Sistemas e Informática",
    especializacion: "Redes y Seguridad",
    correo: "s.rodriguez@continental.edu.pe",
    oficina: "Edificio B, Oficina 305",
    horarioAtencion: "Martes y Jueves 13:00-15:00",
  },
  {
    nombre: "Prof. Daniel Ortega",
    cursos: ["IS108"],
    departamento: "Ingeniería de Sistemas e Informática",
    especializacion: "Sistemas Operativos",
    correo: "d.ortega@continental.edu.pe",
    oficina: "Edificio C, Oficina 210",
    horarioAtencion: "Miércoles 09:00-13:00",
  },
  {
    nombre: "Dra. Gabriela Vega",
    cursos: ["IS101", "IS109"],
    departamento: "Ingeniería de Sistemas e Informática",
    especializacion: "Algoritmos y Arquitectura de Computadoras",
    correo: "g.vega@continental.edu.pe",
    oficina: "Edificio A, Oficina 310",
    horarioAtencion: "Jueves y Viernes 14:00-16:00",
  },
  {
    nombre: "Ing. Héctor Morales",
    cursos: ["IS104"],
    departamento: "Ingeniería de Sistemas e Informática",
    especializacion: "Ingeniería de Software",
    correo: "h.morales@continental.edu.pe",
    oficina: "Edificio B, Oficina 401",
    horarioAtencion: "Lunes 10:00-14:00",
  },
  {
    nombre: "Prof. Natalia Campos",
    cursos: ["IS102"],
    departamento: "Ingeniería de Sistemas e Informática",
    especializacion: "Bases de Datos",
    correo: "n.campos@continental.edu.pe",
    oficina: "Edificio C, Oficina 305",
    horarioAtencion: "Martes y Miércoles 11:00-13:00",
  },
  {
    nombre: "Dr. Alejandro Fuentes",
    cursos: ["IS105"],
    departamento: "Ingeniería de Sistemas e Informática",
    especializacion: "Inteligencia Artificial",
    correo: "a.fuentes@continental.edu.pe",
    oficina: "Edificio D, Oficina 301",
    horarioAtencion: "Jueves 15:00-19:00",
  },
  {
    nombre: "Ing. Valeria Paredes",
    cursos: ["IS106", "IS110"],
    departamento: "Ingeniería de Sistemas e Informática",
    especializacion: "Desarrollo Web y Móvil",
    correo: "v.paredes@continental.edu.pe",
    oficina: "Edificio A, Oficina 205",
    horarioAtencion: "Viernes 10:00-14:00",
  },
  {
    nombre: "Prof. Ricardo Montes",
    cursos: ["IS103", "IS107"],
    departamento: "Ingeniería de Sistemas e Informática",
    especializacion: "Redes y Seguridad",
    correo: "r.montes@continental.edu.pe",
    oficina: "Edificio B, Oficina 210",
    horarioAtencion: "Lunes y Miércoles 16:00-18:00",
  },
  {
    nombre: "Dra. Isabel Quiroz",
    cursos: ["IS108"],
    departamento: "Ingeniería de Sistemas e Informática",
    especializacion: "Sistemas Operativos",
    correo: "i.quiroz@continental.edu.pe",
    oficina: "Edificio C, Oficina 401",
    horarioAtencion: "Martes 09:00-13:00",
  },
  // Profesores de otros departamentos
  {
    nombre: "Dr. Jorge Méndez",
    cursos: ["IC101"],
    departamento: "Ingeniería Civil",
    especializacion: "Mecánica de Suelos",
    correo: "j.mendez@continental.edu.pe",
    oficina: "Edificio E, Oficina 201",
    horarioAtencion: "Lunes y Miércoles 10:00-12:00",
  },
  {
    nombre: "Ing. Claudia Ríos",
    cursos: ["IE101"],
    departamento: "Ingeniería Eléctrica",
    especializacion: "Circuitos Eléctricos",
    correo: "c.rios@continental.edu.pe",
    oficina: "Edificio F, Oficina 105",
    horarioAtencion: "Jueves 14:00-18:00",
  },
]

const usuarios = [
  {
    nombreUsuario: "admin",
    correo: "admin@continental.edu.pe",
    hashContrasena: "admin123",
    rol: "admin",
    metodoAutenticacion: "local",
    verificado: true,
    carrera: "Administración",
    ciclo: 10,
  },
  {
    nombreUsuario: "admin123",
    correo: "admin123@continental.edu.pe",
    hashContrasena: "admin123",
    rol: "admin",
    metodoAutenticacion: "local",
    verificado: true,
    carrera: "Administración",
    ciclo: 10,
  },
  {
    nombreUsuario: "moderador",
    correo: "moderador@continental.edu.pe",
    hashContrasena: "moderador123",
    rol: "moderador",
    metodoAutenticacion: "local",
    verificado: true,
    carrera: "Ingeniería de Sistemas",
    ciclo: 8,
  },
  {
    nombreUsuario: "estudiante",
    correo: "estudiante@continental.edu.pe",
    hashContrasena: "estudiante123",
    rol: "estudiante",
    metodoAutenticacion: "local",
    verificado: true,
    carrera: "Ingeniería de Sistemas",
    ciclo: 5,
  },
  {
    nombreUsuario: "Juan Pérez",
    correo: "j.perez@continental.edu.pe",
    hashContrasena: "password123",
    rol: "estudiante",
    metodoAutenticacion: "local",
    verificado: true,
    carrera: "Ingeniería de Sistemas",
    ciclo: 6,
  },
  {
    nombreUsuario: "María García",
    correo: "m.garcia@continental.edu.pe",
    hashContrasena: "password123",
    rol: "estudiante",
    metodoAutenticacion: "local",
    verificado: true,
    carrera: "Ingeniería de Sistemas",
    ciclo: 7,
  },
]

const comentarios = [
  {
    texto:
      "El Dr. Ramírez explica muy bien los algoritmos complejos. Sus ejemplos son claros y relevantes. Sin embargo, a veces los exámenes son demasiado difíciles comparados con los ejercicios de clase.",
    calificacion: 4,
    codigoCurso: "IS101",
    analisis: {
      sentimiento: "Positivo",
      temas: ["explicaciones", "ejemplos", "evaluaciones"],
      fortalezas: ["Explicaciones claras", "Buenos ejemplos"],
      areasAMejorar: ["Equilibrar dificultad de exámenes"],
    },
  },
  {
    texto:
      "La Dra. Martínez es excelente. Sus clases de SQL son muy prácticas y siempre está disponible para consultas. El proyecto final fue desafiante pero aprendí muchísimo.",
    calificacion: 5,
    codigoCurso: "IS102",
    analisis: {
      sentimiento: "Positivo",
      temas: ["clases prácticas", "disponibilidad", "proyecto final"],
      fortalezas: ["Clases prácticas", "Disponibilidad para consultas"],
      areasAMejorar: [],
    },
  },
  {
    texto:
      "El profesor conoce bien la materia, pero sus clases son muy teóricas. Necesitamos más laboratorios prácticos para configurar redes reales. El material está actualizado, eso es bueno.",
    calificacion: 3,
    codigoCurso: "IS103",
    analisis: {
      sentimiento: "Crítico (constructivo)",
      temas: ["teoría vs práctica", "laboratorios", "material"],
      fortalezas: ["Conocimiento de la materia", "Material actualizado"],
      areasAMejorar: ["Más práctica", "Laboratorios de redes"],
    },
  },
  {
    texto:
      "La Ing. Gómez tiene buena metodología para enseñar Scrum y metodologías ágiles. El trabajo en equipo fue bien organizado. Sería bueno tener más ejemplos de casos reales de la industria.",
    calificacion: 4,
    codigoCurso: "IS104",
    analisis: {
      sentimiento: "Positivo",
      temas: ["metodología", "trabajo en equipo", "casos prácticos"],
      fortalezas: ["Buena metodología", "Organización de trabajo en equipo"],
      areasAMejorar: ["Más ejemplos de casos reales"],
    },
  },
  {
    texto:
      "El Dr. Sánchez es el mejor profesor que he tenido. Explica conceptos complejos de IA de manera sencilla, los proyectos son interesantes y actuales.",
    calificacion: 5,
    codigoCurso: "IS105",
    analisis: {
      sentimiento: "Positivo",
      temas: ["explicaciones", "proyectos", "actualidad"],
      fortalezas: ["Explicaciones claras", "Proyectos interesantes", "Contenido actualizado"],
      areasAMejorar: [],
    },
  },
  {
    texto:
      "La Ing. Torres tiene mucha experiencia en desarrollo web. Las clases son muy prácticas y actualizadas con las últimas tecnologías. A veces va muy rápido y es difícil seguirle el ritmo si no tienes experiencia previa.",
    calificacion: 4,
    codigoCurso: "IS106",
    analisis: {
      sentimiento: "Positivo",
      temas: ["experiencia", "clases prácticas", "ritmo"],
      fortalezas: ["Experiencia práctica", "Contenido actualizado"],
      areasAMejorar: ["Ajustar ritmo para principiantes"],
    },
  },
  {
    texto:
      "El Dr. López explica bien los conceptos de sistemas operativos, pero las prácticas son muy básicas. Necesitamos más ejercicios avanzados para entender mejor.",
    calificacion: 3,
    codigoCurso: "IS108",
    analisis: {
      sentimiento: "Crítico (constructivo)",
      temas: ["explicaciones", "prácticas", "nivel"],
      fortalezas: ["Buenas explicaciones"],
      areasAMejorar: ["Prácticas más avanzadas"],
    },
  },
  {
    texto:
      "La Dra. Díaz conoce muy bien la materia, pero a veces asume que todos tenemos una base sólida en matemáticas. Necesita explicar más los conceptos básicos antes de avanzar a temas complejos.",
    calificacion: 3,
    codigoCurso: "IS101",
    analisis: {
      sentimiento: "Crítico (constructivo)",
      temas: ["conocimiento", "nivel", "conceptos básicos"],
      fortalezas: ["Conocimiento de la materia"],
      areasAMejorar: ["Explicar conceptos básicos", "Nivelar conocimientos"],
    },
  },
  {
    texto:
      "El Ing. Vargas es muy didáctico y paciente. Sus explicaciones sobre patrones de diseño son excelentes. El proyecto final fue muy útil para aplicar lo aprendido.",
    calificacion: 5,
    codigoCurso: "IS104",
    analisis: {
      sentimiento: "Positivo",
      temas: ["didáctica", "paciencia", "proyecto final"],
      fortalezas: ["Didáctica", "Paciencia", "Proyecto aplicado"],
      areasAMejorar: [],
    },
  },
  {
    texto:
      "La Prof. Mendoza domina muy bien SQL y bases de datos NoSQL. Sus ejercicios son prácticos y relevantes. A veces las tareas son muy extensas para el tiempo disponible.",
    calificacion: 4,
    codigoCurso: "IS102",
    analisis: {
      sentimiento: "Positivo",
      temas: ["conocimiento", "ejercicios", "tareas"],
      fortalezas: ["Dominio del tema", "Ejercicios prácticos"],
      areasAMejorar: ["Ajustar carga de tareas"],
    },
  },
  {
    texto:
      "El Dr. Castro es muy apasionado por la IA y eso se nota en sus clases. Los laboratorios con TensorFlow son excelentes. Sería bueno tener más sesiones de práctica.",
    calificacion: 5,
    codigoCurso: "IS105",
    analisis: {
      sentimiento: "Positivo",
      temas: ["pasión", "laboratorios", "práctica"],
      fortalezas: ["Pasión por la materia", "Buenos laboratorios"],
      areasAMejorar: ["Más sesiones prácticas"],
    },
  },
  {
    texto:
      "La Ing. Rodríguez explica bien los conceptos de seguridad informática, pero las prácticas son muy teóricas. Necesitamos más ejercicios de hacking ético y pentesting real.",
    calificacion: 3,
    codigoCurso: "IS107",
    analisis: {
      sentimiento: "Crítico (constructivo)",
      temas: ["explicaciones", "prácticas", "aplicación real"],
      fortalezas: ["Buenas explicaciones"],
      areasAMejorar: ["Más prácticas reales", "Ejercicios de pentesting"],
    },
  },
  {
    texto:
      "El Prof. Ortega conoce Linux a profundidad y sus clases son muy interesantes. Las prácticas en laboratorio son excelentes. El material está muy bien organizado.",
    calificacion: 5,
    codigoCurso: "IS108",
    analisis: {
      sentimiento: "Positivo",
      temas: ["conocimiento", "laboratorios", "material"],
      fortalezas: ["Conocimiento profundo", "Buenas prácticas", "Material organizado"],
      areasAMejorar: [],
    },
  },
  {
    texto:
      "La Dra. Vega explica los algoritmos de manera clara y con buenos ejemplos. Los exámenes son justos y evalúan realmente lo aprendido. Excelente profesora.",
    calificacion: 5,
    codigoCurso: "IS101",
    analisis: {
      sentimiento: "Positivo",
      temas: ["explicaciones", "ejemplos", "evaluaciones"],
      fortalezas: ["Explicaciones claras", "Buenos ejemplos", "Evaluaciones justas"],
      areasAMejorar: [],
    },
  },
  {
    texto:
      "El Ing. Morales tiene mucha experiencia en la industria y eso enriquece sus clases. A veces es muy exigente con los plazos de entrega, pero el aprendizaje vale la pena.",
    calificacion: 4,
    codigoCurso: "IS104",
    analisis: {
      sentimiento: "Positivo",
      temas: ["experiencia", "exigencia", "plazos"],
      fortalezas: ["Experiencia en la industria", "Clases enriquecedoras"],
      areasAMejorar: ["Flexibilidad en plazos"],
    },
  },
  {
    texto:
      "La Prof. Campos explica muy bien normalización y diseño de bases de datos. Sus ejercicios son prácticos y útiles. El proyecto final fue desafiante pero muy educativo.",
    calificacion: 5,
    codigoCurso: "IS102",
    analisis: {
      sentimiento: "Positivo",
      temas: ["explicaciones", "ejercicios", "proyecto final"],
      fortalezas: ["Buenas explicaciones", "Ejercicios prácticos", "Proyecto educativo"],
      areasAMejorar: [],
    },
  },
  {
    texto:
      "El Dr. Fuentes es muy teórico y a veces es difícil seguir sus explicaciones. Necesita más ejemplos prácticos y aplicaciones reales de los algoritmos de IA.",
    calificacion: 3,
    codigoCurso: "IS105",
    analisis: {
      sentimiento: "Crítico (constructivo)",
      temas: ["teoría", "ejemplos", "aplicaciones"],
      fortalezas: ["Conocimiento teórico"],
      areasAMejorar: ["Más ejemplos prácticos", "Aplicaciones reales"],
    },
  },
  {
    texto:
      "La Ing. Paredes es excelente enseñando React y Node.js. Sus proyectos son muy prácticos y actuales. Siempre está disponible para resolver dudas por correo.",
    calificacion: 5,
    codigoCurso: "IS106",
    analisis: {
      sentimiento: "Positivo",
      temas: ["tecnologías", "proyectos", "disponibilidad"],
      fortalezas: ["Conocimiento de tecnologías", "Proyectos prácticos", "Disponibilidad"],
      areasAMejorar: [],
    },
  },
  {
    texto:
      "El Prof. Montes conoce bien redes pero sus evaluaciones son muy difíciles. Necesita equilibrar mejor la dificultad entre lo que enseña y lo que evalúa.",
    calificacion: 3,
    codigoCurso: "IS103",
    analisis: {
      sentimiento: "Crítico (constructivo)",
      temas: ["conocimiento", "evaluaciones", "dificultad"],
      fortalezas: ["Conocimiento del tema"],
      areasAMejorar: ["Equilibrar dificultad", "Mejorar evaluaciones"],
    },
  },
  {
    texto:
      "La Dra. Quiroz explica muy bien los conceptos de sistemas operativos. Sus laboratorios son interesantes y bien estructurados. Excelente profesora.",
    calificacion: 5,
    codigoCurso: "IS108",
    analisis: {
      sentimiento: "Positivo",
      temas: ["explicaciones", "laboratorios", "estructura"],
      fortalezas: ["Buenas explicaciones", "Laboratorios interesantes", "Buena estructura"],
      areasAMejorar: [],
    },
  },
]

// Función para sembrar datos
async function sembrarDatos() {
  try {
    await Departamento.deleteMany({})
    await Profesor.deleteMany({})
    await Usuario.deleteMany({})
    await Comentario.deleteMany({})
    await Curso.deleteMany({})

    console.log("Colecciones limpiadas")

    const departamentosInsertados = await Departamento.insertMany(departamentos)
    console.log(`${departamentosInsertados.length} departamentos insertados`)

    // Crear mapa de nombre a _id de departamento
    const nombreToIdDepto = {}
    departamentosInsertados.forEach((dep) => {
      nombreToIdDepto[dep.nombre] = dep._id
    })

    const cursosInsertados = await Curso.insertMany(cursos)
    console.log(`${cursosInsertados.length} cursos insertados`)

    // Mapear códigos de curso a ObjectId
    const codigoToId = {}
    cursosInsertados.forEach((curso) => {
      codigoToId[curso.codigo] = curso._id
    })

    // Asignar cursos como referencias a los profesores y departamento como ObjectId
    const profesoresConRefs = profesores.map((prof) => ({
      ...prof,
      cursos: prof.cursos.map((codigo) => codigoToId[codigo]).filter(Boolean),
      departamento: nombreToIdDepto[prof.departamento],
    }))

    const profesoresInsertados = await Profesor.insertMany(profesoresConRefs)
    console.log(`${profesoresInsertados.length} profesores insertados`)

    const usuariosConHash = await Promise.all(
      usuarios.map(async (usuario) => {
        const salt = await bcrypt.genSalt(10)
        usuario.hashContrasena = await bcrypt.hash(usuario.hashContrasena, salt)
        return usuario
      })
    )
    const usuariosInsertados = await Usuario.insertMany(usuariosConHash)
    console.log(`${usuariosInsertados.length} usuarios insertados`)

    // Insertar comentarios
    const comentariosCompletos = comentarios.map((comentario, index) => {
      const profesor = profesoresInsertados[index % profesoresInsertados.length]
      const estudiante = usuariosInsertados[index % usuariosInsertados.length]
      return {
        ...comentario,
        idProfesor: profesor._id,
        nombreProfesor: profesor.nombre,
        idEstudiante: estudiante._id,
        idCurso: codigoToId[comentario.codigoCurso],
      }
    })
    const comentariosInsertados = await Comentario.insertMany(comentariosCompletos)
    console.log(`${comentariosInsertados.length} comentarios insertados`)

    // Actualizar calificaciones y contadores de profesores
    for (const profesor of profesoresInsertados) {
      const comentariosProfesor = comentariosInsertados.filter(
        (c) => c.idProfesor.toString() === profesor._id.toString()
      )
      const totalComentarios = comentariosProfesor.length
      const sumaCalificaciones = comentariosProfesor.reduce((sum, c) => sum + c.calificacion, 0)
      const calificacionPromedio = totalComentarios > 0 ? sumaCalificaciones / totalComentarios : 0
      await Profesor.findByIdAndUpdate(profesor._id, {
        totalComentarios,
        calificacionPromedio: calificacionPromedio.toFixed(1),
      })
    }

    console.log("Datos sembrados correctamente")
    process.exit(0)
  } catch (error) {
    console.error("Error al sembrar datos:", error)
    process.exit(1)
  }
}

// Ejecutar función
sembrarDatos()
