import { test, expect } from "vitest";
import { BIT } from "../../src/utils";

test("use BIT", () => {
    expect(BIT(0)).toBe(0b00000);
    expect(BIT(1)).toBe(0b00001);
    expect(BIT(2)).toBe(0b00010);
    expect(BIT(3)).toBe(0b00100);
    expect(BIT(4)).toBe(0b01000);
    expect(BIT(5)).toBe(0b10000);
});

test("compare BIT", () => {
    expect(BIT(0) === BIT(0)).toBe(true)

    expect((BIT(1) | BIT(2)) === BIT(1)).toBe(false)
    expect(BIT(0) === BIT(1)).toBe(false)
});

test("contain BIT", () => {
    expect(BIT.contain(BIT(0), BIT(0))).toBe(true)
    expect(BIT.contain(BIT(0) | BIT(1), BIT(1))).toBe(true)
    expect(BIT.contain(BIT(2) | BIT(3), BIT(2))).toBe(true)
    expect(BIT.contain(BIT(2) | BIT(3), BIT(3))).toBe(true)

    expect(BIT.contain(BIT(2) | BIT(3), BIT(1))).toBe(false)
    expect(BIT.contain(BIT(0), BIT(1))).toBe(false)
});