export function getImageData(img: HTMLImageElement): Uint8ClampedArray {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d")!;
    const originWidth = img.width;
    const originHeight = img.height;
    // canvas尺寸设置
    canvas.width = originWidth;
    canvas.height = originHeight;
    // 清除画布
    context.clearRect(0, 0, originWidth, originHeight);
    // 图片绘制在画布上
    context.drawImage(img, 0, 0);
    // 获取图片像素信息
    return context.getImageData(0, 0, originWidth, originHeight).data;
}

export function isAlphaChannel(data: HTMLImageElement | Uint8ClampedArray) {
    if (data instanceof Element) {
        data =  getImageData(data)
    }

    for (let index = 3; index < data.length; index += 4) {
        if (data[index] != 255) {
            return true;
        }
    }

    return false;
}
