var assert = require("assert");
var sumar = require("../src/sumar");

describe("Frontend - Sumar números", function() {
    it("Regresa la suma de 5 + 6", function() {
        assert.equal(sumar(5, 6), 11);
    });
});
