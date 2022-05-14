import { describe, it, expect } from "vitest";
import { randomizeList } from "~/lists";

describe("list-randomizer", () => {
  it("should return the list offseted given a list and an offset", () => {
    const list = [1, 2, 3, 4, 5];
    const offset = 2;
    const sut = randomizeList(list, offset);
    expect(sut).toEqual([3, 4, 5, 1, 2]);
  });
  it("should return the original list given a list and an offset out of range", () => {
    const list = [1, 2, 3, 4, 5];
    const offset = 6;
    const sut = randomizeList(list, offset);
    expect(sut).toEqual([1, 2, 3, 4, 5]);
  });
});
