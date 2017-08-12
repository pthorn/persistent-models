const moment = require('moment');
const DateTimeSchema = require('../src/schema/datetime').default;


describe("DateTimeSchema", function() {
    describe("DateTimeSchema()", function () {
        it("creates with no options", function () {
            const s = new DateTimeSchema();
            const data = s.createData();

            expect(data).toEqual({
                value: null,
                viewValue: '',
                $dirty: false,
                $errors: {}
            });
        });

        it("creates with initial value", function () {
            const now = moment().format();

            const s = new DateTimeSchema({initialValue: now});
            const data = s.createData();

            expect(data).toEqual({
                value: now,
                viewValue: moment(now).format(s.options.view_format),
                $dirty: false,
                $errors: {}
            });
        });
    });

    describe(".setViewValue()", function() {
        it("parses bad datetime", function () {
            const s = new DateTimeSchema();
            const data = s.setViewValue({}, 'abc');

            expect(data).toEqual({
                viewValue: 'abc',
                $dirty: true,
                $errors: {'$parser': s.options.parser_message}
            });
        });
    });
});
