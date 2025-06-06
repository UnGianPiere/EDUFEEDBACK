const mongoose = require("mongoose")

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://piergamer777:e5yJ5RCq9Wg25sIP@cluster0.jgszwho.mongodb.net/EDUFEEDBACK?retryWrites=true&w=majority&appName=Cluster0", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log(`MongoDB conectado: ${conn.connection.host}`)
    return conn
  } catch (error) {
    console.error(`Error de conexión a MongoDB: ${error.message}`)
    process.exit(1)
  }
}

module.exports = connectDB
