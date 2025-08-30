const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const QRCode = require('qrcode'); // Usaremos esta biblioteca

class ImageService {
    constructor() {
        this.templatePath = path.join(__dirname, '..', '..', 'certificates', 'templates', 'certificado-template.svg');
        this.assinaturaJosePath = path.join(__dirname, '..', '..', 'certificates', 'templates', 'Joseluiz.png');
        this.assinaturaDaniloPath = path.join(__dirname, '..', '..', 'certificates', 'templates', 'danilo.png');
    }

    getImageAsBase64(filePath) {
        try {
            const file = fs.readFileSync(filePath);
            return `data:image/png;base64,${file.toString('base64')}`;
        } catch (error) {
            console.error(`❌ Erro ao ler o arquivo de imagem: ${filePath}`, error);
            return '';
        }
    }

    async generateCertificateImageFromData(certificateData) {
        console.log('🚀 Iniciando geração de imagem para:', certificateData.participant_name);

        try {
            let svgContent = fs.readFileSync(this.templatePath, 'utf8');

            const assinaturaJoseBase64 = this.getImageAsBase64(this.assinaturaJosePath);
            const assinaturaDaniloBase64 = this.getImageAsBase64(this.assinaturaDaniloPath);
            const completionDate = new Date(certificateData.completion_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
            
            const verificationUrl = `${process.env.APP_BASE_URL}/verificar?certificate=${certificateData.certificate_id}`;
            
            console.log('Gerando QR Code localmente...');
            const qrCodeImageBase64 = await QRCode.toDataURL(verificationUrl, {
                width: 232,
                margin: 1,
                errorCorrectionLevel: 'H'
            });
            console.log('✅ QR Code gerado com sucesso.');

            const qrCodeBlock = `
                <rect x="0" y="0" width="280" height="280" rx="8" ry="8" fill="#0b1220" stroke="#1f2937"/>
                <image href="${qrCodeImageBase64}" x="24" y="24" width="232" height="232"/>
            `;

            const replacements = {
                '{{NOME_DO_PARTICIPANTE}}': certificateData.participant_name,
                '{{NOME_DO_CURSO}}': certificateData.course_name,
                '{{CARGA_HORARIA}}': `${certificateData.hours}h`,
                '{{DATA_CONCLUSAO}}': completionDate,
                '{{MODALIDADE}}': certificateData.modalidade,
                '{{CERTIFICATE_ID}}': certificateData.certificate_id,
                '{{HASH_VERIFICACAO}}': certificateData.hash_verificacao,
                '{{IMAGEM_ASSINATURA_JOSE}}': assinaturaJoseBase64,
                '{{IMAGEM_ASSINATURA_DANILO}}': assinaturaDaniloBase64,
                '{{QR_CODE_BLOCK}}': qrCodeBlock,
                '{{URL_VERIFICACAO}}': 'redinnovations.com.br'
            };

            for (const placeholder in replacements) {
                const regex = new RegExp(placeholder, 'g');
                svgContent = svgContent.replace(regex, replacements[placeholder]);
            }

            const pngBuffer = await sharp(Buffer.from(svgContent)).png().toBuffer();

            console.log('✅ Imagem PNG gerada com sucesso! Tamanho:', pngBuffer.length, 'bytes');
            return pngBuffer;

        } catch (error) {
            console.error('❌ Erro detalhado ao gerar a imagem a partir do SVG:', error.message);
            throw error;
        }
    }
}

module.exports = new ImageService();