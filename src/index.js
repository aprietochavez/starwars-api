const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const app = express();
const port = 3000;
const swaggerDocument = YAML.load(path.join(__dirname, '../docs/swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});