import { helloWorld } from ".";

describe("hello world module", () => {
  test("says hello world", () => {
    expect(helloWorld("World")).toBe("Hello, World!");
  });
  test("does not say hello world", () => {
    expect(helloWorld("You")).not.toBe("Hello, World!");
  });
});
