export let gl: WebGL2RenderingContext;

export function setGL(context: WebGL2RenderingContext) {
    gl = new Proxy(context, {
        get(target, key, receiver) {
            const ret = Reflect.get(target, key, receiver);
            if (typeof ret === "function") {
                return ret.bind(target);
            }

            return ret;
        },
    });
}
