import { Users, BarChart, BookOpen } from "lucide-react"

const AcercaDe = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="border rounded-lg p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
          <img src="/images/logo.png" alt="EduFeedback" className="h-24" />
          <div>
            <h1 className="text-2xl font-bold mb-2">EduFeedback</h1>
            <p className="text-gray-600 mb-6">
              Plataforma de análisis de comentarios para mejorar la calidad educativa en la Universidad Continental
            </p>

            <p className="mb-4">
              <strong>EduFeedback</strong> es una plataforma que permite a los estudiantes de la Universidad Continental
              compartir sus experiencias con profesores universitarios de forma anónima. Nuestro objetivo es
              proporcionar información valiosa a otros estudiantes y ayudar a mejorar la calidad educativa.
            </p>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <span className="text-blue-600 mr-2">🔍</span> ¿Cómo funciona?
        </h2>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="border rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-lg mr-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium">Comentarios Anónimos</h3>
            </div>
            <p className="text-gray-600">
              Los estudiantes publican comentarios anónimos sobre sus profesores, incluyendo una calificación y detalles
              sobre su experiencia.
            </p>
          </div>

          <div className="border rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-lg mr-4">
                <BarChart className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium">Análisis con IA</h3>
            </div>
            <p className="text-gray-600">
              Utilizamos inteligencia artificial para analizar estos comentarios y extraer información útil, como
              fortalezas y áreas de mejora.
            </p>
          </div>

          <div className="border rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-lg mr-4">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium">Decisiones Informadas</h3>
            </div>
            <p className="text-gray-600">
              Otros estudiantes pueden explorar estos comentarios para tomar decisiones informadas sobre sus profesores.
            </p>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <span className="text-blue-600 mr-2">🎯</span> Nuestra Misión
        </h2>

        <p className="mb-8">
          Nuestra misión es mejorar la transparencia en la educación superior de la Universidad Continental y
          proporcionar a los estudiantes la información que necesitan para tomar decisiones informadas sobre su
          educación.
        </p>

        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <span className="text-blue-600 mr-2">🔒</span> Privacidad
        </h2>

        <p className="mb-4">
          Valoramos la privacidad de nuestros usuarios. Todos los comentarios son anónimos por defecto, y no recopilamos
          información personal identificable a menos que los usuarios decidan proporcionarla.
        </p>
      </div>

      {/* Footer con logo de Continental */}
      <div className="border rounded-lg p-6 text-center mb-8">
        <div className="flex flex-col items-center">
          <img src="/images/logo_conti.png" alt="Universidad Continental" className="h-16 mb-4" />
          <p className="text-gray-600">EduFeedback es una iniciativa desarrollada para la Universidad Continental</p>
          <p className="text-gray-500 text-sm mt-2">
            © {new Date().getFullYear()} EduFeedback - Universidad Continental. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AcercaDe
