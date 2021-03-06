const StringSchema = require('../src/schema/string').default;


describe("StringSchema", function() {
    describe("StringSchema()", function() {
        it("creates with no options", function () {
            const s = new StringSchema();
            const data = s.createData();

            expect(data).toEqual({
                value: '',
                viewValue: '',
                $dirty: false,
                $errors: {}
            });
        });

        it("creates with initial value", function () {
            const s = new StringSchema({initialValue: 'abc'});
            const data = s.createData();

            expect(data).toEqual({
                value: 'abc',
                viewValue: 'abc',
                $dirty: false,
                $errors: {}
            });
        });
    });

    describe(".setViewValue()", function() {
        it("with trim", function () {
            const s = new StringSchema();
            const data = s.setViewValue({}, '  b ');

            expect(data).toEqual({
                value: 'b',
                viewValue: '  b ',
                $dirty: true,
                $errors: {}
            });
        });

        it("without trim", function () {
            const s = new StringSchema({trim: false});
            const data = s.setViewValue({}, '  b ');

            expect(data).toEqual({
                value: '  b ',
                viewValue: '  b ',
                $dirty: true,
                $errors: {}
            });
        });
    });
});
