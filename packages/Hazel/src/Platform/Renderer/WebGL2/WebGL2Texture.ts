import { Texture2D } from "@pw/Hazel/Hazel/Renderer/Texture";
import { gl } from "./gl";
import { getImageData, isAlphaChannel } from "@hazel/share";

export class WebGL2Texture2D extends Texture2D {
    private glTexture!: WebGLTexture;
    private width: number = 0;
    private height: number = 0;
    private path: string;
    private channels!: 3 | 4;

    constructor(path: string) {
        super();
        this.path = path;
        const glTexture = gl.createTexture();
        if (!glTexture) {
            throw new Error("Failed to create texture");
        }
        this.glTexture = glTexture;

        this.width = 1;
        this.height = 1;

        const img = new Image();
        img.onload = () => this.handleImageLoad(img);
        img.src = path;
    }

    handleImageLoad(img: HTMLImageElement) {
        this.width = img.width;
        this.height = img.height;
        this.channels = isAlphaChannel(img) ? 4 : 3;

        this.bind();

        let internalFormat = 0;
        let dataFormat = 0;

        if (this.channels === 4) {
            internalFormat = gl.RGBA8;
            dataFormat = gl.RGBA;
        } else if (this.channels === 3) {
            internalFormat = gl.RGB8;
            dataFormat = gl.RGB;
        }

        gl.texStorage2D(
            gl.TEXTURE_2D,
            1,
            internalFormat,
            this.width,
            this.height,
        );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texSubImage2D(
            gl.TEXTURE_2D,
            0,
            0,
            0,
            this.width,
            this.height,
            dataFormat,
            gl.UNSIGNED_BYTE,
            img,
        );
        img.remove()
    }

    getWidth(): number {
        return this.width;
    }

    getHeight(): number {
        return this.height;
    }

    bind(slot = 0) {
        gl.activeTexture(gl.TEXTURE0 + slot);
        gl.bindTexture(gl.TEXTURE_2D, this.glTexture);
    }
}
