import * as _Hazel from "./Hazel";
import * as Platform from "./Platform";

export namespace Hazel {
    export type WindowProps = _Hazel.WindowProps;

    export const Application = Platform.Application;

    // To be defined in CLIENT
    export type CreateApplication = (props: WindowProps) => _Hazel.Application;
}
