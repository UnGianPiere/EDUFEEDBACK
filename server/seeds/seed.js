const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const Departamento = require("../models/Departamento")
const Curso = require("../models/Curso")
const Profesor = require("../models/Profesor")
const Usuario = require("../models/Usuario")
const Comentario = require("../models/Comentario")

async function main() {
  await mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://piergamer777:e5yJ5RCq9Wg25sIP@cluster0.jgszwho.mongodb.net/EDUFEEDBACK?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  // Limpiar colecciones existentes
  await Departamento.deleteMany({})
  await Curso.deleteMany({})
  await Profesor.deleteMany({})
  await Usuario.deleteMany({})
  await Comentario.deleteMany({})

  console.log("🧹 Limpiando base de datos...")

  // Crear departamento - MANTENIENDO EXACTAMENTE EL MISMO DEL CÓDIGO ORIGINAL
  const departamentoData = {
    nombre: "Ingeniería de Sistemas e Informática",
    idFacultad: new mongoose.Types.ObjectId(),
    cursos: [
      { codigo: "matematica-discreta-2", nombre: "MATEMÁTICA DISCRETA 2", descripcion: "" },
      { codigo: "tecnicas-de-programacion", nombre: "TÉCNICAS DE PROGRAMACIÓN", descripcion: "" },
      { codigo: "desarrollo-de-aplicaciones-moviles", nombre: "DESARROLLO DE APLICACIONES MÓVILES", descripcion: "" },
      { codigo: "ingenieria-web", nombre: "INGENIERÍA WEB", descripcion: "" },
      { codigo: "conmutacion-y-enrutamiento", nombre: "CONMUTACIÓN Y ENRUTAMIENTO", descripcion: "" },
      { codigo: "inteligencia-de-negocios", nombre: "INTELIGENCIA DE NEGOCIOS", descripcion: "" },
      { codigo: "diseno-web", nombre: "DISEÑO WEB", descripcion: "" },
      { codigo: "cloud-computing", nombre: "CLOUD COMPUTING", descripcion: "" },
      { codigo: "sistemas-operativos", nombre: "SISTEMAS OPERATIVOS", descripcion: "" },
      { codigo: "arquitectura-orientada-a-servicios", nombre: "ARQUITECTURA ORIENTADA A SERVICIOS", descripcion: "" },
      {
        codigo: "taller-de-proyectos-1-ingenieria-de-sistemas-e-informatica",
        nombre: "TALLER DE PROYECTOS 1 - INGENIERÍA DE SISTEMAS E INFORMÁTICA",
        descripcion: "",
      },
      {
        codigo: "taller-de-investigacion-1-ingenieria-de-sistemas-e-informatica",
        nombre: "TALLER DE INVESTIGACIÓN 1 - INGENIERÍA DE SISTEMAS E INFORMÁTICA",
        descripcion: "",
      },
      {
        codigo: "taller-de-proyectos-2-ingenieria-de-sistemas-e-informatica",
        nombre: "TALLER DE PROYECTOS 2 - INGENIERÍA DE SISTEMAS E INFORMÁTICA",
        descripcion: "",
      },
      { codigo: "desarrollo-de-videojuegos", nombre: "DESARROLLO DE VIDEOJUEGOS", descripcion: "" },
      {
        codigo: "analisis-y-requerimientos-de-software",
        nombre: "ANÁLISIS Y REQUERIMIENTOS DE SOFTWARE",
        descripcion: "",
      },
      { codigo: "estructura-de-datos", nombre: "ESTRUCTURA DE DATOS", descripcion: "" },
      { codigo: "construccion-de-software", nombre: "CONSTRUCCIÓN DE SOFTWARE", descripcion: "" },
      { codigo: "procesos-de-software", nombre: "PROCESOS DE SOFTWARE", descripcion: "" },
      {
        codigo: "taller-de-investigacion-2-ingenieria-de-sistemas-e-informatica",
        nombre: "TALLER DE INVESTIGACIÓN 2 - INGENIERÍA DE SISTEMAS E INFORMÁTICA",
        descripcion: "",
      },
      { codigo: "negocios-electronicos", nombre: "NEGOCIOS ELECTRÓNICOS", descripcion: "" },
      {
        codigo: "planeamiento-estrategico-de-los-siti",
        nombre: "PLANEAMIENTO ESTRATÉGICO DE LOS SI/TI",
        descripcion: "",
      },
      { codigo: "diseno-de-software", nombre: "DISEÑO DE SOFTWARE", descripcion: "" },
      {
        codigo: "seguridad-de-la-informacion-corporativa",
        nombre: "SEGURIDAD DE LA INFORMACIÓN CORPORATIVA",
        descripcion: "",
      },
      {
        codigo: "introduccion-a-la-ingenieria-de-sistemas-e-informatica",
        nombre: "INTRODUCCIÓN A LA INGENIERÍA DE SISTEMAS E INFORMÁTICA",
        descripcion: "",
      },
      { codigo: "programacion-orientada-a-objetos", nombre: "PROGRAMACIÓN ORIENTADA A OBJETOS", descripcion: "" },
      { codigo: "pruebas-y-calidad-de-software", nombre: "PRUEBAS Y CALIDAD DE SOFTWARE", descripcion: "" },
      { codigo: "auditoria-de-sistemas", nombre: "AUDITORÍA DE SISTEMAS", descripcion: "" },
      { codigo: "administracion-de-base-de-datos", nombre: "ADMINISTRACIÓN DE BASE DE DATOS", descripcion: "" },
      {
        codigo: "escalamiento-de-redes-de-computadoras",
        nombre: "ESCALAMIENTO DE REDES DE COMPUTADORAS",
        descripcion: "",
      },
      { codigo: "gestion-de-servicios-ti", nombre: "GESTIÓN DE SERVICIOS TI", descripcion: "" },
      { codigo: "arquitectura-del-computador", nombre: "ARQUITECTURA DEL COMPUTADOR", descripcion: "" },
      {
        codigo: "metodologias-agiles-de-desarrollo-de-software",
        nombre: "METODOLOGÍAS ÁGILES DE DESARROLLO DE SOFTWARE",
        descripcion: "",
      },
      { codigo: "sistemas-de-informacion-integrados", nombre: "SISTEMAS DE INFORMACIÓN INTEGRADOS", descripcion: "" },
    ],
  }
  const dept = await Departamento.create(departamentoData)
  console.log("📚 Departamento creado")

  // Crear cursos - MANTENIENDO EXACTAMENTE LOS MISMOS DEL CÓDIGO ORIGINAL
  const cursosData = [
    {
      nombre: "MATEMÁTICA DISCRETA 2",
      codigo: "matematica-discreta-2",
      departamento: "Ingeniería de Sistemas e Informática",
    },
    {
      nombre: "TÉCNICAS DE PROGRAMACIÓN",
      codigo: "tecnicas-de-programacion",
      departamento: "Ingeniería de Sistemas e Informática",
    },
    {
      nombre: "DESARROLLO DE APLICACIONES MÓVILES",
      codigo: "desarrollo-de-aplicaciones-moviles",
      departamento: "Ingeniería de Sistemas e Informática",
    },
    { nombre: "INGENIERÍA WEB", codigo: "ingenieria-web", departamento: "Ingeniería de Sistemas e Informática" },
    {
      nombre: "CONMUTACIÓN Y ENRUTAMIENTO",
      codigo: "conmutacion-y-enrutamiento",
      departamento: "Ingeniería de Sistemas e Informática",
    },
    {
      nombre: "INTELIGENCIA DE NEGOCIOS",
      codigo: "inteligencia-de-negocios",
      departamento: "Ingeniería de Sistemas e Informática",
    },
    { nombre: "DISEÑO WEB", codigo: "diseno-web", departamento: "Ingeniería de Sistemas e Informática" },
    { nombre: "CLOUD COMPUTING", codigo: "cloud-computing", departamento: "Ingeniería de Sistemas e Informática" },
    {
      nombre: "SISTEMAS OPERATIVOS",
      codigo: "sistemas-operativos",
      departamento: "Ingeniería de Sistemas e Informática",
    },
    {
      nombre: "ARQUITECTURA ORIENTADA A SERVICIOS",
      codigo: "arquitectura-orientada-a-servicios",
      departamento: "Ingeniería de Sistemas e Informática",
    },
    {
      nombre: "TALLER DE PROYECTOS 1 - INGENIERÍA DE SISTEMAS E INFORMÁTICA",
      codigo: "taller-de-proyectos-1-ingenieria-de-sistemas-e-informatica",
      departamento: "Ingeniería de Sistemas e Informática",
    },
    {
      nombre: "TALLER DE INVESTIGACIÓN 1 - INGENIERÍA DE SISTEMAS E INFORMÁTICA",
      codigo: "taller-de-investigacion-1-ingenieria-de-sistemas-e-informatica",
      departamento: "Ingeniería de Sistemas e Informática",
    },
    {
      nombre: "TALLER DE PROYECTOS 2 - INGENIERÍA DE SISTEMAS E INFORMÁTICA",
      codigo: "taller-de-proyectos-2-ingenieria-de-sistemas-e-informatica",
      departamento: "Ingeniería de Sistemas e Informática",
    },
    {
      nombre: "DESARROLLO DE VIDEOJUEGOS",
      codigo: "desarrollo-de-videojuegos",
      departamento: "Ingeniería de Sistemas e Informática",
    },
    {
      nombre: "ANÁLISIS Y REQUERIMIENTOS DE SOFTWARE",
      codigo: "analisis-y-requerimientos-de-software",
      departamento: "Ingeniería de Sistemas e Informática",
    },
    {
      nombre: "ESTRUCTURA DE DATOS",
      codigo: "estructura-de-datos",
      departamento: "Ingeniería de Sistemas e Informática",
    },
    {
      nombre: "CONSTRUCCIÓN DE SOFTWARE",
      codigo: "construccion-de-software",
      departamento: "Ingeniería de Sistemas e Informática",
    },
    {
      nombre: "PROCESOS DE SOFTWARE",
      codigo: "procesos-de-software",
      departamento: "Ingeniería de Sistemas e Informática",
    },
    {
      nombre: "TALLER DE INVESTIGACIÓN 2 - INGENIERÍA DE SISTEMAS E INFORMÁTICA",
      codigo: "taller-de-investigacion-2-ingenieria-de-sistemas-e-informatica",
      departamento: "Ingeniería de Sistemas e Informática",
    },
    {
      nombre: "NEGOCIOS ELECTRÓNICOS",
      codigo: "negocios-electronicos",
      departamento: "Ingeniería de Sistemas e Informática",
    },
    {
      nombre: "PLANEAMIENTO ESTRATÉGICO DE LOS SI/TI",
      codigo: "planeamiento-estrategico-de-los-siti",
      departamento: "Ingeniería de Sistemas e Informática",
    },
    {
      nombre: "DISEÑO DE SOFTWARE",
      codigo: "diseno-de-software",
      departamento: "Ingeniería de Sistemas e Informática",
    },
    {
      nombre: "SEGURIDAD DE LA INFORMACIÓN CORPORATIVA",
      codigo: "seguridad-de-la-informacion-corporativa",
      departamento: "Ingeniería de Sistemas e Informática",
    },
    {
      nombre: "INTRODUCCIÓN A LA INGENIERÍA DE SISTEMAS E INFORMÁTICA",
      codigo: "introduccion-a-la-ingenieria-de-sistemas-e-informatica",
      departamento: "Ingeniería de Sistemas e Informática",
    },
    {
      nombre: "PROGRAMACIÓN ORIENTADA A OBJETOS",
      codigo: "programacion-orientada-a-objetos",
      departamento: "Ingeniería de Sistemas e Informática",
    },
    {
      nombre: "PRUEBAS Y CALIDAD DE SOFTWARE",
      codigo: "pruebas-y-calidad-de-software",
      departamento: "Ingeniería de Sistemas e Informática",
    },
    {
      nombre: "AUDITORÍA DE SISTEMAS",
      codigo: "auditoria-de-sistemas",
      departamento: "Ingeniería de Sistemas e Informática",
    },
    {
      nombre: "ADMINISTRACIÓN DE BASE DE DATOS",
      codigo: "administracion-de-base-de-datos",
      departamento: "Ingeniería de Sistemas e Informática",
    },
    {
      nombre: "ESCALAMIENTO DE REDES DE COMPUTADORAS",
      codigo: "escalamiento-de-redes-de-computadoras",
      departamento: "Ingeniería de Sistemas e Informática",
    },
    {
      nombre: "GESTIÓN DE SERVICIOS TI",
      codigo: "gestion-de-servicios-ti",
      departamento: "Ingeniería de Sistemas e Informática",
    },
    {
      nombre: "ARQUITECTURA DEL COMPUTADOR",
      codigo: "arquitectura-del-computador",
      departamento: "Ingeniería de Sistemas e Informática",
    },
    {
      nombre: "METODOLOGÍAS ÁGILES DE DESARROLLO DE SOFTWARE",
      codigo: "metodologias-agiles-de-desarrollo-de-software",
      departamento: "Ingeniería de Sistemas e Informática",
    },
    {
      nombre: "SISTEMAS DE INFORMACIÓN INTEGRADOS",
      codigo: "sistemas-de-informacion-integrados",
      departamento: "Ingeniería de Sistemas e Informática",
    },
  ]
  const cursosDocs = await Curso.insertMany(cursosData)
  const codigoToId = {}
  cursosDocs.forEach((c) => {
    codigoToId[c.codigo] = c._id
  })
  console.log("📖 Cursos creados")

  // Crear profesores - MANTENIENDO EXACTAMENTE LOS MISMOS DEL CÓDIGO ORIGINAL
  const profesoresData = [
    {
      nombre: "ALMIDON, ORTIZ Carlos",
      departamento: dept._id,
      sede: "Huancayo",
      cursos: [codigoToId["matematica-discreta-2"]],
      comentarios: ["Podría utilizar más ejemplos prácticos."],
      correo: "calmidon@continental.edu.pe",
      especializacion: "Matemáticas",
    },
    {
      nombre: "CERRON, OCHOA Juan Silvio",
      departamento: dept._id,
      sede: "Huancayo",
      cursos: [codigoToId["tecnicas-de-programacion"]],
      comentarios: [
        "Fomenta la participación en clase.",
        "Excelente docente, explica muy bien.",
        "Muy accesible y dispuesto a ayudar.",
      ],
      correo: "jcerron@continental.edu.pe",
      especializacion: "Programación",
    },
    {
      nombre: "CASAYCO, CONTRERAS Yan Francis",
      departamento: dept._id,
      sede: "Huancayo",
      cursos: [
        codigoToId["arquitectura-orientada-a-servicios"],
        codigoToId["negocios-electronicos"],
        codigoToId["sistemas-de-informacion-integrados"],
        codigoToId["inteligencia-de-negocios"],
        codigoToId["desarrollo-de-aplicaciones-moviles"],
      ],
      comentarios: ["Las evaluaciones fueron justas y claras."],
      correo: "ycasayco@continental.edu.pe",
      especializacion: "Sistemas de Información",
    },
    {
      nombre: "MEDINA, RAYMUNDO Carlos Alberto",
      departamento: dept._id,
      sede: "Huancayo",
      cursos: [codigoToId["arquitectura-del-computador"], codigoToId["ingenieria-web"]],
      comentarios: [
        "Excelente docente, explica muy bien.",
        "Necesita mejorar su metodología de enseñanza.",
        "Gran conocimiento del tema.",
      ],
      correo: "cmedina@continental.edu.pe",
      especializacion: "Arquitectura de Computadoras",
    },
    {
      nombre: "CONDORI, TORRES Giancarlo",
      departamento: dept._id,
      sede: "Huancayo",
      cursos: [codigoToId["conmutacion-y-enrutamiento"], codigoToId["escalamiento-de-redes-de-computadoras"]],
      comentarios: [
        "Gran conocimiento del tema.",
        "El material proporcionado fue muy útil.",
        "Las evaluaciones fueron justas y claras.",
      ],
      correo: "gcondori@continental.edu.pe",
      especializacion: "Redes",
    },
    {
      nombre: "ALONZO, HUAMAN Max Walter",
      departamento: dept._id,
      sede: "Huancayo",
      cursos: [codigoToId["inteligencia-de-negocios"], codigoToId["negocios-electronicos"]],
      comentarios: ["Gran conocimiento del tema.", "Fomenta la participación en clase."],
      correo: "malonzo@continental.edu.pe",
      especializacion: "Business Intelligence",
    },
    {
      nombre: "PEÑA, GARCIA Guillermo Eduardo",
      departamento: dept._id,
      sede: "Huancayo",
      cursos: [
        codigoToId["diseno-web"],
        codigoToId["ingenieria-web"],
        codigoToId["introduccion-a-la-ingenieria-de-sistemas-e-informatica"],
        codigoToId["desarrollo-de-videojuegos"],
        codigoToId["desarrollo-de-aplicaciones-moviles"],
      ],
      comentarios: ["A veces las clases eran un poco rápidas."],
      correo: "gpena@continental.edu.pe",
      especializacion: "Desarrollo Web y Móvil",
    },
    {
      nombre: "ROJAS, MORENO Carol Roxana",
      departamento: dept._id,
      sede: "Huancayo",
      cursos: [codigoToId["tecnicas-de-programacion"], codigoToId["programacion-orientada-a-objetos"]],
      comentarios: ["Fomenta la participación en clase."],
      correo: "crojas@continental.edu.pe",
      especializacion: "Programación Orientada a Objetos",
    },
    {
      nombre: "MELGAR, ALIAGA Freud Enrique",
      departamento: dept._id,
      sede: "Huancayo",
      cursos: [codigoToId["cloud-computing"]],
      comentarios: ["Excelente docente, explica muy bien.", "A veces las clases eran un poco rápidas."],
      correo: "fmelgar@continental.edu.pe",
      especializacion: "Cloud Computing",
    },
    {
      nombre: "SIFUENTES, LOPEZ Jorge Asencio",
      departamento: dept._id,
      sede: "Huancayo",
      cursos: [codigoToId["arquitectura-del-computador"], codigoToId["sistemas-operativos"]],
      comentarios: [
        "El curso fue desafiante pero gratificante.",
        "El material proporcionado fue muy útil.",
        "Necesita mejorar su metodología de enseñanza.",
      ],
      correo: "jsifuentes@continental.edu.pe",
      especializacion: "Sistemas Operativos",
    },
    {
      nombre: "URBANO, GRADOS Oscar Antonio",
      departamento: dept._id,
      sede: "Huancayo",
      cursos: [codigoToId["arquitectura-orientada-a-servicios"], codigoToId["sistemas-de-informacion-integrados"]],
      comentarios: ["Necesita mejorar su metodología de enseñanza."],
      correo: "ourbano@continental.edu.pe",
      especializacion: "Arquitectura de Software",
    },
    {
      nombre: "GUEVARA, JIMENEZ Jorge Alfredo",
      departamento: dept._id,
      sede: "Huancayo",
      cursos: [
        codigoToId["diseno-de-software"],
        codigoToId["procesos-de-software"],
        codigoToId["taller-de-proyectos-1-ingenieria-de-sistemas-e-informatica"],
      ],
      comentarios: [
        "Excelente docente, explica muy bien.",
        "Las evaluaciones fueron justas y claras.",
        "Necesita mejorar su metodología de enseñanza.",
      ],
      correo: "jguevara@continental.edu.pe",
      especializacion: "Ingeniería de Software",
    },
    {
      nombre: "ARANA, CAPARACHIN Maglioni",
      departamento: dept._id,
      sede: "Huancayo",
      cursos: [
        codigoToId["taller-de-investigacion-1-ingenieria-de-sistemas-e-informatica"],
        codigoToId["pruebas-y-calidad-de-software"],
      ],
      comentarios: [
        "El curso fue desafiante pero gratificante.",
        "Gran conocimiento del tema.",
        "A veces las clases eran un poco rápidas.",
      ],
      correo: "marana@continental.edu.pe",
      especializacion: "Calidad de Software",
    },
    {
      nombre: "CALDERON, SEDANO Carlos Alberto",
      departamento: dept._id,
      sede: "Huancayo",
      cursos: [codigoToId["tecnicas-de-programacion"]],
      comentarios: ["Gran conocimiento del tema.", "El material proporcionado fue muy útil."],
      correo: "ccalderon@continental.edu.pe",
      especializacion: "Programación",
    },
    {
      nombre: "GAMARRA, MORENO Job Daniel",
      departamento: dept._id,
      sede: "Huancayo",
      cursos: [
        codigoToId["taller-de-proyectos-2-ingenieria-de-sistemas-e-informatica"],
        codigoToId["taller-de-investigacion-2-ingenieria-de-sistemas-e-informatica"],
        codigoToId["construccion-de-software"],
      ],
      comentarios: [
        "Excelente docente, explica muy bien.",
        "El curso fue desafiante pero gratificante.",
        "El material proporcionado fue muy útil.",
      ],
      correo: "jgamarra@continental.edu.pe",
      especializacion: "Gestión de Proyectos",
    },
    {
      nombre: "FERNANDEZ, RIVERA Diego Alejandro",
      departamento: dept._id,
      sede: "Huancayo",
      cursos: [codigoToId["desarrollo-de-videojuegos"]],
      comentarios: ["A veces las clases eran un poco rápidas."],
      correo: "dfernandez@continental.edu.pe",
      especializacion: "Desarrollo de Videojuegos",
    },
    {
      nombre: "CARMEN, DELGADILLO Elvis Wilfredo",
      departamento: dept._id,
      sede: "Huancayo",
      cursos: [codigoToId["analisis-y-requerimientos-de-software"]],
      comentarios: [
        "Necesita mejorar su metodología de enseñanza.",
        "Muy accesible y dispuesto a ayudar.",
        "El curso fue desafiante pero gratificante.",
      ],
      correo: "ecarmen@continental.edu.pe",
      especializacion: "Análisis de Requerimientos",
    },
    {
      nombre: "OSORIO, CONTRERAS Rosario Delia",
      departamento: dept._id,
      sede: "Huancayo",
      cursos: [codigoToId["estructura-de-datos"], codigoToId["programacion-orientada-a-objetos"]],
      comentarios: [
        "Gran conocimiento del tema.",
        "El curso fue desafiante pero gratificante.",
        "Muy accesible y dispuesto a ayudar.",
      ],
      correo: "rosorio@continental.edu.pe",
      especializacion: "Estructuras de Datos",
    },
    {
      nombre: "CHUMPITAZ, VELEZ Jorge Luis",
      departamento: dept._id,
      sede: "Huancayo",
      cursos: [
        codigoToId["planeamiento-estrategico-de-los-siti"],
        codigoToId["metodologias-agiles-de-desarrollo-de-software"],
        codigoToId["construccion-de-software"],
        codigoToId["gestion-de-servicios-ti"],
      ],
      comentarios: ["A veces las clases eran un poco rápidas.", "Las evaluaciones fueron justas y claras."],
      correo: "jchumpitaz@continental.edu.pe",
      especializacion: "Metodologías Ágiles",
    },
    {
      nombre: "MENDEZ, GUILLEN Jan Kenny",
      departamento: dept._id,
      sede: "Huancayo",
      cursos: [codigoToId["analisis-y-requerimientos-de-software"], codigoToId["tecnicas-de-programacion"]],
      comentarios: [
        "Podría utilizar más ejemplos prácticos.",
        "El material proporcionado fue muy útil.",
        "Fomenta la participación en clase.",
      ],
      correo: "jmendez@continental.edu.pe",
      especializacion: "Análisis de Sistemas",
    },
    {
      nombre: "ULLOA, TORRES Eduardo Raul",
      departamento: dept._id,
      sede: "Huancayo",
      cursos: [codigoToId["seguridad-de-la-informacion-corporativa"], codigoToId["auditoria-de-sistemas"]],
      comentarios: [
        "A veces las clases eran un poco rápidas.",
        "Muy accesible y dispuesto a ayudar.",
        "El material proporcionado fue muy útil.",
      ],
      correo: "eulloa@continental.edu.pe",
      especializacion: "Seguridad Informática",
    },
    {
      nombre: "COHAILA, BRAVO Ninoska Nataly",
      departamento: dept._id,
      sede: "Huancayo",
      cursos: [codigoToId["introduccion-a-la-ingenieria-de-sistemas-e-informatica"]],
      comentarios: [
        "Las evaluaciones fueron justas y claras.",
        "El curso fue desafiante pero gratificante.",
        "Podría utilizar más ejemplos prácticos.",
      ],
      correo: "ncohaila@continental.edu.pe",
      especializacion: "Introducción a la Ingeniería",
    },
    {
      nombre: "CAMBORDA, ZAMUDIO María Gabriela",
      departamento: dept._id,
      sede: "Huancayo",
      cursos: [codigoToId["introduccion-a-la-ingenieria-de-sistemas-e-informatica"]],
      comentarios: ["Necesita mejorar su metodología de enseñanza."],
      correo: "mcamborda@continental.edu.pe",
      especializacion: "Fundamentos de Ingeniería",
    },
    {
      nombre: "MERCADO, RIVAS Richard Yuri",
      departamento: dept._id,
      sede: "Huancayo",
      cursos: [codigoToId["administracion-de-base-de-datos"]],
      comentarios: [
        "A veces las clases eran un poco rápidas.",
        "Excelente docente, explica muy bien.",
        "Fomenta la participación en clase.",
      ],
      correo: "rmercado@continental.edu.pe",
      especializacion: "Bases de Datos",
    },
    {
      nombre: "PEÑA, ROJAS Anieval",
      departamento: dept._id,
      sede: "Huancayo",
      cursos: [codigoToId["matematica-discreta-2"]],
      comentarios: [
        "El material proporcionado fue muy útil.",
        "Muy accesible y dispuesto a ayudar.",
        "Necesita mejorar su metodología de enseñanza.",
      ],
      correo: "apena@continental.edu.pe",
      especializacion: "Matemática Discreta",
    },
  ]
  const profesoresDocs = await Profesor.insertMany(profesoresData)
  console.log("👨‍🏫 Profesores creados")

  // Crear usuarios (15 estudiantes + 1 admin)
  const usuariosData = [
    {
      nombreUsuario: "ADMIN SISTEMA",
      correo: "admin@continental.edu.pe",
      hashContrasena: await bcrypt.hash("admin123", 10),
      rol: "admin",
      verificado: true,
      carrera: "Ingeniería de Sistemas",
      ciclo: 10,
    },
    {
      nombreUsuario: "MARIA FERNANDA LOPEZ GARCIA",
      correo: "maria.lopez@continental.edu.pe",
      hashContrasena: await bcrypt.hash("password123", 10),
      rol: "estudiante",
      verificado: true,
      carrera: "Ingeniería de Sistemas",
      ciclo: 6,
    },
    {
      nombreUsuario: "CARLOS EDUARDO MARTINEZ SILVA",
      correo: "carlos.martinez@continental.edu.pe",
      hashContrasena: await bcrypt.hash("password123", 10),
      rol: "estudiante",
      verificado: true,
      carrera: "Ingeniería de Sistemas",
      ciclo: 7,
    },
    {
      nombreUsuario: "ANA LUCIA RODRIGUEZ TORRES",
      correo: "ana.rodriguez@continental.edu.pe",
      hashContrasena: await bcrypt.hash("password123", 10),
      rol: "estudiante",
      verificado: true,
      carrera: "Ingeniería de Sistemas",
      ciclo: 5,
    },
    {
      nombreUsuario: "DIEGO ALEJANDRO VARGAS MENDEZ",
      correo: "diego.vargas@continental.edu.pe",
      hashContrasena: await bcrypt.hash("password123", 10),
      rol: "estudiante",
      verificado: true,
      carrera: "Ingeniería de Sistemas",
      ciclo: 8,
    },
    {
      nombreUsuario: "SOFIA VALENTINA HERRERA CRUZ",
      correo: "sofia.herrera@continental.edu.pe",
      hashContrasena: await bcrypt.hash("password123", 10),
      rol: "estudiante",
      verificado: true,
      carrera: "Ingeniería de Sistemas",
      ciclo: 6,
    },
    {
      nombreUsuario: "MIGUEL ANGEL CASTILLO RAMOS",
      correo: "miguel.castillo@continental.edu.pe",
      hashContrasena: await bcrypt.hash("password123", 10),
      rol: "estudiante",
      verificado: true,
      carrera: "Ingeniería de Sistemas",
      ciclo: 7,
    },
    {
      nombreUsuario: "VALERIA NICOLE FLORES SANTOS",
      correo: "valeria.flores@continental.edu.pe",
      hashContrasena: await bcrypt.hash("password123", 10),
      rol: "estudiante",
      verificado: true,
      carrera: "Ingeniería de Sistemas",
      ciclo: 5,
    },
    {
      nombreUsuario: "SEBASTIAN ANDRE MORALES DIAZ",
      correo: "sebastian.morales@continental.edu.pe",
      hashContrasena: await bcrypt.hash("password123", 10),
      rol: "estudiante",
      verificado: true,
      carrera: "Ingeniería de Sistemas",
      ciclo: 8,
    },
    {
      nombreUsuario: "CAMILA ALEJANDRA JIMENEZ VEGA",
      correo: "camila.jimenez@continental.edu.pe",
      hashContrasena: await bcrypt.hash("password123", 10),
      rol: "estudiante",
      verificado: true,
      carrera: "Ingeniería de Sistemas",
      ciclo: 6,
    },
    {
      nombreUsuario: "RODRIGO FERNANDO GUTIERREZ LEON",
      correo: "rodrigo.gutierrez@continental.edu.pe",
      hashContrasena: await bcrypt.hash("password123", 10),
      rol: "estudiante",
      verificado: true,
      carrera: "Ingeniería de Sistemas",
      ciclo: 7,
    },
    {
      nombreUsuario: "ISABELLA SOPHIA PAREDES ROJAS",
      correo: "isabella.paredes@continental.edu.pe",
      hashContrasena: await bcrypt.hash("password123", 10),
      rol: "estudiante",
      verificado: true,
      carrera: "Ingeniería de Sistemas",
      ciclo: 5,
    },
    {
      nombreUsuario: "MATEO NICOLAS AGUILAR CAMPOS",
      correo: "mateo.aguilar@continental.edu.pe",
      hashContrasena: await bcrypt.hash("password123", 10),
      rol: "estudiante",
      verificado: true,
      carrera: "Ingeniería de Sistemas",
      ciclo: 8,
    },
    {
      nombreUsuario: "FERNANDA GABRIELA ORTIZ LUNA",
      correo: "fernanda.ortiz@continental.edu.pe",
      hashContrasena: await bcrypt.hash("password123", 10),
      rol: "estudiante",
      verificado: true,
      carrera: "Ingeniería de Sistemas",
      ciclo: 6,
    },
    {
      nombreUsuario: "ADRIAN SANTIAGO PEREZ MORENO",
      correo: "adrian.perez@continental.edu.pe",
      hashContrasena: await bcrypt.hash("password123", 10),
      rol: "estudiante",
      verificado: true,
      carrera: "Ingeniería de Sistemas",
      ciclo: 7,
    },
    {
      nombreUsuario: "DANIELA VICTORIA RAMIREZ CASTRO",
      correo: "daniela.ramirez@continental.edu.pe",
      hashContrasena: await bcrypt.hash("password123", 10),
      rol: "estudiante",
      verificado: true,
      carrera: "Ingeniería de Sistemas",
      ciclo: 5,
    },
  ]

  const usuariosDocs = await Usuario.insertMany(usuariosData)
  const estudiantes = usuariosDocs.filter((u) => u.rol === "estudiante")
  console.log("👥 Usuarios creados")

  // Generar comentarios únicos y variados
  const comentariosUnicos = [
    // Comentarios positivos
    "Excelente profesor, explica los conceptos de manera muy clara y siempre está dispuesto a resolver dudas. Sus clases son dinámicas y motivadoras.",
    "Me encanta su metodología de enseñanza, hace que temas complejos sean fáciles de entender. Definitivamente uno de los mejores docentes que he tenido.",
    "Muy buen dominio del tema y gran capacidad para transmitir conocimientos. Sus ejemplos prácticos ayudan mucho a comprender la teoría.",
    "Profesor muy dedicado y comprometido con el aprendizaje de sus estudiantes. Siempre busca nuevas formas de explicar los conceptos.",
    "Sus clases son muy interactivas y participativas. Fomenta el pensamiento crítico y la resolución creativa de problemas.",
    "Excelente preparación de clases y material didáctico muy útil. Se nota su experiencia y pasión por la enseñanza.",
    "Muy accesible para consultas fuera de clase y siempre brinda retroalimentación constructiva en los trabajos y exámenes.",
    "Gran conocimiento técnico y capacidad para relacionar la teoría con aplicaciones del mundo real. Muy recomendado.",
    "Profesor muy organizado y puntual. Sus explicaciones son claras y el ritmo de clase es adecuado para el aprendizaje.",
    "Excelente uso de herramientas tecnológicas en clase. Hace que el aprendizaje sea más dinámico e interesante.",

    // Comentarios constructivos
    "Buen profesor en general, aunque a veces las clases van un poco rápido. Sería genial si pudiera dedicar más tiempo a los ejercicios prácticos.",
    "Domina muy bien el tema pero podría mejorar la interacción con los estudiantes. A veces las clases se sienten un poco unidireccionales.",
    "El contenido del curso es excelente, pero creo que necesita más ejemplos prácticos para complementar la teoría.",
    "Muy conocedor de la materia, aunque a veces utiliza terminología muy técnica que puede ser difícil de seguir para principiantes.",
    "Las evaluaciones son justas pero podrían ser más frecuentes para tener mejor seguimiento del progreso de aprendizaje.",
    "Buen profesor, pero sería útil que proporcionara más material de apoyo y referencias adicionales para profundizar en los temas.",
    "Explica bien pero a veces se enfoca demasiado en la teoría. Más ejercicios prácticos ayudarían a consolidar el aprendizaje.",
    "Profesor competente, aunque podría beneficiarse de usar más recursos multimedia para hacer las clases más atractivas.",

    // Comentarios críticos pero constructivos
    "El profesor tiene conocimiento pero necesita mejorar su metodología de enseñanza. Las clases pueden ser un poco monótonas.",
    "Domina el tema pero le falta dinamismo en clase. Sería bueno que implementara más actividades grupales y participativas.",
    "Buen contenido académico pero la comunicación con los estudiantes podría mejorar. A veces es difícil hacer preguntas en clase.",
    "Conoce la materia pero las explicaciones a veces son confusas. Necesita estructurar mejor el contenido de las clases.",
    "Las clases son informativas pero poco inspiradoras. Falta más conexión entre la teoría y las aplicaciones prácticas.",
    "Profesor preparado académicamente pero podría ser más flexible con los horarios de consulta y más accesible para los estudiantes.",

    // Comentarios específicos por área
    "Excelente para enseñar programación, sus ejercicios prácticos son muy útiles y siempre está actualizado con las últimas tecnologías.",
    "Muy bueno explicando algoritmos complejos, tiene la habilidad de desglosar problemas difíciles en pasos simples de entender.",
    "Gran experiencia en desarrollo web, comparte muchos tips prácticos que son muy valiosos para proyectos reales.",
    "Excelente conocimiento en bases de datos, sus ejemplos con casos reales de empresas ayudan mucho a entender la aplicación práctica.",
    "Muy actualizado en temas de seguridad informática, siempre comparte las últimas tendencias y amenazas del sector.",
    "Excelente para enseñar redes, tiene mucha experiencia práctica y siempre relaciona la teoría con configuraciones reales.",
    "Muy bueno en temas de inteligencia artificial, explica conceptos complejos de manera accesible y con ejemplos interesantes.",
    "Gran dominio de metodologías ágiles, comparte experiencias reales de proyectos y enseña buenas prácticas de la industria.",
  ]

  // Crear comentarios - cada estudiante comenta a al menos 2 profesores diferentes
  const comentarios = []
  let comentarioIndex = 0

  for (let i = 0; i < estudiantes.length; i++) {
    const estudiante = estudiantes[i]

    // Seleccionar 2-4 profesores aleatorios para cada estudiante
    const numComentarios = Math.floor(Math.random() * 3) + 2 // 2-4 comentarios
    const profesoresSeleccionados = []

    while (profesoresSeleccionados.length < numComentarios) {
      const profesorAleatorio = profesoresDocs[Math.floor(Math.random() * profesoresDocs.length)]
      if (!profesoresSeleccionados.find((p) => p._id.equals(profesorAleatorio._id))) {
        profesoresSeleccionados.push(profesorAleatorio)
      }
    }

    // Crear comentarios para cada profesor seleccionado
    for (const profesor of profesoresSeleccionados) {
      const cursoAleatorio = profesor.cursos[Math.floor(Math.random() * profesor.cursos.length)]
      const cursoInfo = cursosDocs.find((c) => c._id.equals(cursoAleatorio))

      // Formatear el nombre del profesor para mostrar
      const nombreProfesorPartes = profesor.nombre.split(",")
      const nombreProfesorFormateado =
        nombreProfesorPartes.length > 1
          ? `${nombreProfesorPartes[1].trim()} ${nombreProfesorPartes[0].trim()}`
          : profesor.nombre

      const comentario = {
        idEstudiante: estudiante._id.toString(),
        idProfesor: profesor._id,
        nombreProfesor: profesor.nombre,
        nombreProfesorFormateado: nombreProfesorFormateado,
        codigoCurso: cursoInfo.codigo,
        nombreCurso: cursoInfo.nombre,
        calificacion: Math.floor(Math.random() * 2) + 4, // 4-5 estrellas mayormente
        texto: comentariosUnicos[comentarioIndex % comentariosUnicos.length],
        fechaHora: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Últimos 30 días
        likes: Math.floor(Math.random() * 15),
        analisis: {
          sentimiento: ["Positivo", "Crítico (constructivo)", "Positivo"][Math.floor(Math.random() * 3)],
          temas: ["Metodología", "Conocimiento técnico", "Comunicación", "Evaluación"][Math.floor(Math.random() * 4)],
          fortalezas: ["Claridad en explicaciones", "Dominio del tema", "Disponibilidad", "Metodología práctica"][
            Math.floor(Math.random() * 4)
          ],
          areasAMejorar: comentarioIndex % 3 === 0 ? ["Ritmo de clase", "Interacción con estudiantes"] : [],
          resumen: "Comentario constructivo sobre el desempeño docente",
        },
      }

      comentarios.push(comentario)
      comentarioIndex++
    }
  }

  await Comentario.insertMany(comentarios)
  console.log("💬 Comentarios creados")

  console.log("✅ Seed completado exitosamente!")
  console.log(`📊 Resumen:`)
  console.log(`   - ${profesoresDocs.length} profesores`)
  console.log(`   - ${usuariosDocs.length} usuarios (${estudiantes.length} estudiantes + 1 admin)`)
  console.log(`   - ${comentarios.length} comentarios`)
  console.log(`   - ${cursosDocs.length} cursos`)

  mongoose.disconnect()
}

main().catch((err) => {
  console.error("❌ Error en seed:", err)
  process.exit(1)
})
