const index = require('./index.js');

describe("UnitTests", function() {

  test("add", async function() {
    expect(add(1, 2)).toBe(3);
  });

});