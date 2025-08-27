// test-direct.js
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function testDirect() {
    let browser;
    try {
        console.log('🧪 Teste DIRETO do Puppeteer...');
        
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        
        // Conteúdo HTML simples
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h1 { color: #333; }
                </style>
            </head>
            <body>
                <h1>Teste de PDF</h1>
                <p>Gerado em: ${new Date().toLocaleString()}</p>
                <p>Este é um teste simples do Puppeteer</p>
            </body>
            </html>
        `;

        await page.setContent(htmlContent);
        const pdfBuffer = await page.pdf({ format: 'A4' });
        
        fs.writeFileSync('test-direct.pdf', pdfBuffer);
        console.log('✅ Teste DIRETO funcionou! PDF salvo.');
        
    } catch (error) {
        console.error('❌ Erro no teste direto:', error.message);
    } finally {
        if (browser) await browser.close();
    }
}

testDirect();