function processJpeg(jpegBuffer, targetWidth, targetHeight) {
    let offset = 2;
    let width = 0;
    let height = 0;

   
    while (offset < jpegBuffer.length) {
        if (jpegBuffer[offset] === 0xFF) {
            const marker = jpegBuffer[offset + 1];
           
            if (marker === 0xC0) {
               
                height = jpegBuffer.readUInt16BE(offset + 5);
               
                width = jpegBuffer.readUInt16BE(offset + 7);
                break;
            }
           
            offset += 2 + jpegBuffer.readUInt16BE(offset + 2);
        } else {
            offset++;
        }
    }

   
    if (!width || !height) {
        return { data: Buffer.alloc(targetWidth * targetHeight * 3), info: { width: targetWidth, height: targetHeight } };
    }

   
   
   
    const rawData = jpegBuffer.subarray(offset);
    const rgbBuffer = Buffer.alloc(targetWidth * targetHeight * 3);

    for (let y = 0; y < targetHeight; y++) {
        for (let x = 0; x < targetWidth; x++) {
           
            const origX = Math.floor((x / targetWidth) * width);
            const origY = Math.floor((y / targetHeight) * height);

           
            const origIdx = (origY * width + origX) * 3;
            const targetIdx = (y * targetWidth + x) * 3;

           
            rgbBuffer[targetIdx] = rawData[origIdx] || 0;    
            rgbBuffer[targetIdx + 1] = rawData[origIdx + 1] || 0;
            rgbBuffer[targetIdx + 2] = rawData[origIdx + 2] || 0;
        }
    }

    return {
        data: rgbBuffer,
        info: { width: targetWidth, height: targetHeight }
    };
}

module.exports = { processJpeg };
