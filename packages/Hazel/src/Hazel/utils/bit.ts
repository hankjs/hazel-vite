export interface Bit {
    (slot: number): number;
    contain: (bits: number, bit: number) => boolean;
}

const _Bit: Bit = function BIT(slot: number) {
    if (slot - 1 < 0) {
        return 0
    }
    return 1 << (slot - 1);
}

_Bit.contain = (bits: number, bit: number) => {
    return (bits & bit) === bit;
}

export const BIT = _Bit