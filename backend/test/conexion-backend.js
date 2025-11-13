var assert=require("assert");

var APP_NAME=require("shared");

describe("Pruebas en el backend",function() {
        it("Muestra nombre de app compartido",function() {
            assert.ok(typeof APP_NAME==="object");
        });
});