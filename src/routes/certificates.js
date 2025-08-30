// src/routes/certificates.js
const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');

// Rota de estatísticas (para a home page)
router.get('/stats', certificateController.getStats);

// Rota para buscar detalhes de um certificado
router.get('/certificate/:certificateId', certificateController.getCertificateById);

// Rota para gerar e baixar a imagem do certificado
router.get('/generate/:certificateId', certificateController.generateCertificateImage);

// Rota para criar um novo certificado (protegida no futuro)
router.post('/', certificateController.createCertificate);

module.exports = router;