const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors'); // Importa el paquete cors
const app = express();
const port = 3000;

// Configura CORS para permitir solicitudes desde http://localhost:4200
app.use(cors());

// Configura multer para manejar la carga de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Define la carpeta donde deseas guardar las imágenes (dentro de assets/imagenes)
    cb(null, 'src/assets/carpeta_imagenes');
  },
  filename: (req, file, cb) => {
    // Genera un nombre de archivo único para la imagen
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extname = path.extname(file.originalname);
    cb(null, uniqueSuffix + extname);
  },
});

const upload = multer({ storage });

// Ruta para subir una imagen
app.post('/subir-imagen', upload.single('imagen'), (req, res) => {
    if (!req.file) {
        console.error('No se proporcionó una imagen');
        return res.status(400).json({ error: 'No se proporcionó una imagen' });
      }
  // Devuelve la URL de la imagen o cualquier otra respuesta necesaria
  res.status(200).json({ imageUrl: `assets/carpeta_imagenes/${req.file.filename}` });
});

app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});
