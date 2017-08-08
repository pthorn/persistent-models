const NumberSchema = require('../src/schema/number').default;


describe("NumberSchema", function() {
    describe("NumberSchema()", function () {
        it("creates with no options", function () {
            const s = new NumberSchema();
            const data = s.createData();

            expect(data).toEqual({
                value: null,
                viewValue: '',
                $errors: {}
            });
        });

        it("creates with initial value", function () {
            const s = new NumberSchema({initialValue: 42});
            const data = s.createData();

            expect(data).toEqual({
                value: 42,
                viewValue: '42',
                $errors: {}
            });
        });
    });

    describe(".setViewValue()", function() {
        it("parses int", function () {
            const s = new NumberSchema();
            const data = s.setViewValue({}, '42');

            expect(data).toEqual({
                value: 42,
                viewValue: '42',
                $errors: {}
            });
        });

        it("parses hex int", function () {
            const s = new NumberSchema({format: 'hex'});
            const data = s.setViewValue({}, '42');

            expect(data).toEqual({
                value: 66,
                viewValue: '42',
                $errors: {}
            });
        });

        it("parses float", function () {
            const s = new NumberSchema({format: 'float'});
            const data = s.setViewValue({}, '42.3');

            expect(data).toEqual({
                value: 42.3,
                viewValue: '42.3',
                $errors: {}
            });
        });

        it("parses bad number", function () {
            const s = new NumberSchema();
            const data = s.setViewValue({}, 'abc');

            expect(data).toEqual({
                viewValue: 'abc',
                $errors: {'$parser': s.options.parser_message}
            });
        });
    });
});
