package com.bookfair.service;

import org.springframework.stereotype.Service;

/**
 * QR Code Generation Service
 * 
 * TODO [BACKEND DEV 2]: Implement QR code generation using ZXing library
 * 
 * Steps:
 * 1. Add method: byte[] generateQrCode(String content)
 * 2. Use ZXing's QRCodeWriter to create QR code
 * 3. Return as PNG byte array
 * 
 * Example:
 *   QRCodeWriter writer = new QRCodeWriter();
 *   BitMatrix matrix = writer.encode(content, BarcodeFormat.QR_CODE, 200, 200);
 *   BufferedImage image = MatrixToImageWriter.toBufferedImage(matrix);
 */
@Service
public class QrService {
    
    public byte[] generateQrCode(String content) {
        // TODO: Implement QR generation
        // See: https://github.com/zxing/zxing
        return new byte[0];
    }
}
