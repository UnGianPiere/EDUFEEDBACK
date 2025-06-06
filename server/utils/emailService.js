require('dotenv').config();
const Mailjet = require('node-mailjet');

const mailjet = Mailjet.apiConnect(
  process.env.MJ_API_KEY,
  process.env.MJ_API_SECRET
);

/**
 * Envía un correo electrónico con un código de verificación utilizando Mailjet
 * @param {string} destinatario - Correo electrónico del destinatario
 * @param {string} codigo - Código de verificación
 * @param {string} nombre - Nombre del usuario
 * @returns {Promise}
 */
const enviarCodigoVerificacion = async (destinatario, codigo, nombre) => {
  try {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #2563eb; text-align: center;">EduFeedback - Universidad Continental</h2>
        <p>Hola ${nombre},</p>
        <p>Gracias por registrarte en EduFeedback. Para verificar tu cuenta, utiliza el siguiente código:</p>
        <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
          ${codigo}
        </div>
        <p>Este código expirará en 30 minutos.</p>
        <p>Si no has solicitado este código, puedes ignorar este correo.</p>
        <p style="margin-top: 30px; font-size: 12px; color: #6b7280; text-align: center;">
          Este es un correo automático, por favor no respondas a este mensaje.
        </p>
      </div>
    `;

    const response = await mailjet
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: process.env.MJ_FROM_EMAIL,
              Name: process.env.MJ_FROM_NAME,
            },
            To: [
              {
                Email: destinatario,
                Name: nombre,
              },
            ],
            Subject: 'Código de verificación - EduFeedback',
            HTMLPart: htmlContent,
          },
        ],
      });

    console.log('✅ Correo enviado con Mailjet:', response.body);
    return response.body;
  } catch (error) {
    console.error('❌ Error al enviar correo con Mailjet:', error.statusCode, error.response?.body || error.message);
    throw error;
  }
};

module.exports = { enviarCodigoVerificacion };
