const { Schema } = require('../src/schema');
const { Invalid } = require('../src/validate');


describe("Schema tests", function() {

    describe("Schema()", function () {
        it("creates data with default options", function () {
            const s = new Schema();
            const data = s.createData();

            expect(data).toEqual({
                value: null,
                viewValue: null,
                errors: {}
            });
        });

        it("creates data with initial value", function () {
            const s = new Schema({
                initialValue: 'abc'
            });
            const data = s.createData();

            expect(data).toEqual({
                value: 'abc',
                viewValue: 'abc',
                errors: {}
            });
        });
    });

    describe(".setModelValue()", function () {
        it("sets value", function () {
            const s = new Schema();
            const data = s.createData();
            const data2 = s.setModelValue(data, 'abc');

            expect(data2).toEqual({
                value: 'abc',
                viewValue: 'abc',
                errors: {}
            });
        });

        it("calls formatters", function () {
            const formatters = [
                jest.fn(() => 'b'),
                jest.fn(() => 'c'),
                jest.fn(() => 'd')
            ];

            const s = new Schema({
                formatter: formatters[0],
                formatters: [formatters[1], formatters[2]]
            });

            const data = s.setModelValue({}, 'a');

            for(let f of formatters) {
                expect(f.mock.calls.length).toBe(1);
            }

            expect(formatters[0].mock.calls[0][0]).toBe('a');
            expect(formatters[1].mock.calls[0][0]).toBe('b');
            expect(formatters[2].mock.calls[0][0]).toBe('c');

            expect(data.value).toEqual('a');
            expect(data.viewValue).toEqual('d');
        });
    });

    describe(".setViewValue()", function () {
        it("sets value", function () {
            const s = new Schema();
            const data = s.createData();
            const data2 = s.setViewValue(data, 'abc');

            expect(data2).toEqual({
                value: 'abc',
                viewValue: 'abc',
                errors: {}
            });
        });

        it("handles validation errors in parsers", function () {
            const parser1 = jest.fn();
            const parser3 = jest.fn();

            const s = new Schema({
                value: '10',
                parsers: [
                    parser1,
                    function parser2(val) {
                        throw new Invalid('test exception');
                    },
                    parser3
                ]
            });

            const data1 = s.createData();
            const data2 = s.setViewValue(data1, '42');

            expect(parser1.mock.calls.length).toBe(1);
            expect(parser3.mock.calls.length).toBe(0);

            expect(data2.errors).toEqual(jasmine.objectContaining({
                '$parser': 'test exception'
            }));
            expect(data2.value).toBeUndefined();
            // view value should always change to provide feedback for the user
            expect(data2.viewValue).toBe('42');
        });

        xit("calls validate()", function () {
            const s = new Schema();
            const data1 = s.createData();

            s.validate = jest.genMockFunction();
            const data2 = s.parse(data1, '42');

            expect(s.validate.mock.calls.length).toBe(1);
            expect(s.validate.mock.calls[0][0]).toBe(data1);
        });
    });

    xdescribe(".setFromJSON()", function () {

    });
});
