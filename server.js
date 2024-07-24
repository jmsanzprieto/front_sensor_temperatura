// index.js
require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_PATH = process.env.DATA_PATH || path.join(__dirname, 'sensor_temp', 'data.json'); // Usa la ruta desde .env o una ruta por defecto

// Configurar EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  fs.readFile(DATA_PATH, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).render('error', { error: 'Error al leer el archivo JSON' });
    }

    let records;
    try {
      records = JSON.parse(data); // Parsear todo el contenido del archivo JSON
    } catch (parseError) {
      return res.status(500).render('error', { error: 'Error al parsear el archivo JSON' });
    }

    if (!Array.isArray(records) || records.length === 0) {
      return res.status(404).render('error', { error: 'No hay registros en el archivo' });
    }

    // Ordenar los registros por timestamp en orden descendente
    records.sort((a, b) => b.timestamp - a.timestamp);

    // Obtener los últimos 10 registros
    const last10Records = records.slice(0, 10);
    const latestRecord = last10Records[0];

    res.render('index', { latestRecord, records: last10Records });
  });
});


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
