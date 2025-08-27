// src/services/pdfService.js
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class PDFService {
    constructor() {
        this.templatePath = path.join(__dirname, '..', '..', 'certificates', 'templates', 'certificado-template.html');
    }

    async generateCertificate(participantName, courseName, hours, date, certificateId, hash) {
        console.log('🚀 Iniciando geração de PDF para:', participantName);
        console.log('📋 Dados recebidos:', { participantName, courseName, hours, date, certificateId, hash });

        let browser;
        try {
            browser = await puppeteer.launch({
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-gpu'
                ],
                timeout: 30000
            });

            const page = await browser.newPage();

            if (!fs.existsSync(this.templatePath)) {
                throw new Error(`Template não encontrado em: ${this.templatePath}. Verifique o caminho e o arquivo.`);
            }

            console.log('📂 Lendo template de:', this.templatePath);
            const htmlTemplate = fs.readFileSync(this.templatePath, 'utf8');
            console.log('📑 Template original (primeiras 200 caracteres):', htmlTemplate.substring(0, 200) + '...');

            const htmlContent = htmlTemplate
                .replace(/{{NOME_DO_PARTICIPANTE}}/g, participantName || 'Participante Desconhecido')
                .replace(/{{CURSO}}/g, courseName || 'Curso Desconhecido')
                .replace(/{{CARGA_HORARIA}}/g, hours || '0')
                .replace(/{{DATA}}/g, date ? new Date(date).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR'))
                .replace(/{{CERTIFICATE_ID}}/g, certificateId || 'SEM_ID')
                .replace(/{{HASH}}/g, hash || 'a7b9c3d2e1f4');

            console.log('📝 HTML gerado (primeiras 200 caracteres):', htmlContent.substring(0, 200) + '...');
            fs.writeFileSync(path.join(__dirname, '..', '..', 'debug.html'), htmlContent);

            await page.setContent(htmlContent, {
                waitUntil: ['load'],
                timeout: 15000
            });

            const pdfBuffer = await page.pdf({
                format: 'A4',
                printBackground: true,
                margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' },
                timeout: 30000
            });

            if (!pdfBuffer || pdfBuffer.length === 0) {
                throw new Error('Buffer do PDF está vazio após geração');
            }

            fs.writeFileSync(path.join(__dirname, '..', '..', 'test.pdf'), pdfBuffer);
            console.log('💾 PDF salvo localmente como test.pdf');

            await browser.close();
            console.log('✅ PDF gerado com sucesso!');
            return pdfBuffer;

        } catch (error) {
            console.error('❌ Erro ao gerar PDF:', error.message, error.stack);
            if (browser) await browser.close();
            throw error;
        }
    }

    async generateCertificateFromData(certificateData) {
        console.log('🔄 Convertendo dados do certificado:', certificateData);
        return this.generateCertificate(
            certificateData.participant_name,
            certificateData.course_name,
            certificateData.hours.toString(),
            certificateData.completion_date,
            certificateData.certificate_id,
            certificateData.hash_verificacao
        );
    }

    async cleanup() {
        console.log('🧹 Limpeza do serviço PDF concluída');
    }
}

module.exports = new PDFService();