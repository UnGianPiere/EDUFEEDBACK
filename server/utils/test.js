const Mailjet = require("node-mailjet");

const mailjet = Mailjet.apiConnect(
    "6abe4e7cb7f7b825e07c7c0fe89404cb", // Reemplaza aquí con tu API Key
    "06d9bd80f762bed74d83b3ae2fa8bfa7" // Reemplaza aquí con tu API Secret
);

const request = mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
        {
            From: {
                Email: "piergamer777@gmail.com", // Debe estar verificado en Mailjet
                Name: "pier",
            },
            To: [
                {
                    Email: "74022578@continental.edu.pe", // Cambia al correo donde quieres probar que llegue
                    Name: "Destinatario",
                },
            ],
            Subject: "Prueba básica de envío con Mailjet",
            TextPart: "Hola, este es un correo de prueba desde Mailjet y Node.js",
            HTMLPart:
                "<h3>Hola, este es un correo de prueba desde Mailjet y Node.js</h3>",
        },
    ],
});

request
    .then((result) => {
        console.log("Correo enviado con éxito:", result.body);
    })
    .catch((err) => {
        console.error("Error enviando correo:", err.statusCode, err.message);
    });
