const MapSchema = require('../src/schema/map').default;
const { Schema } = require('../src/schema');


describe("MapSchema tests", function() {

    describe("MapSchema()", function () {
        const error = new TypeError('Map: children must be an object');

        it("throws when no children are supplied", function () {
            expect(() => new MapSchema()).toThrow(error);
        });

        it("throws when children are supplied improperly", function () {
            const s = new Schema();

            expect(() => new MapSchema([s])).toThrow(error);
            expect(() => new MapSchema(s)).toThrow(error);
        });

        it("creates", function () {
            const s = new Schema();
            const m = new MapSchema({
                s
            });

            expect(m.children).toEqual({s});
        });
    });

    describe(".getSchemaChild()", function () {
        const s = new Schema();
        const m = new MapSchema({
            s
        });

        it("returns children", function () {
            expect(m.getSchemaChild('s')).toBe(s);
        });

        it("throws when asked for nonexistent children", function () {
            expect(() => m.getSchemaChild('wat')).toThrow(); // TODO
        });
    });

    describe(".createData()", function () {
        const s = new Schema();
        const m = new MapSchema({
            s: s
        });

        it("creates data with no options", function () {
            const data = m.createData();
            const subdata = s.createData();

            expect(data.s).toEqual(subdata);
        });
    });

    describe(".setChild()", function () {
        const s = new Schema();
        const m = new MapSchema({
            s
        });

        it("alters child data in a persistent way", function () {
            const data = m.createData();
            const new_s_data = s.setModelValue('abc');
            const new_data = m.setChild(data, 's', new_s_data);

            expect(new_data).not.toBe(data);
            expect(new_data.s).toBe(new_s_data);
        });

        it("throws when child does not exist", function () {
            const data = m.createData();
            const new_s_data = s.setModelValue('abc');

            expect(() => m.setChild(data, 'x', new_s_data)).toThrow(); // TODO
        });
    });

    describe("accessors", function () {
        const s = new Schema({initialValue: 'foo'});
        const m = new MapSchema({
            s
        });
        const node = m.createData();

        it(".getModelValue()", function () {
            const value = m.getModelValue(node);

            expect(value).toEqual({s: 'foo'});
        });

        it(".getViewValue()", function () {
            const value = m.getViewValue(node);

            expect(value).toEqual({s: 'foo'});
        });
    });

    describe(".setModelValue()", function () {
        const m = new MapSchema({
            s: new Schema(),
            t: new Schema()
        });

        const expected_value = {
            s: {
                value: 'cat',
                viewValue: 'cat',
                $dirty: false,
                $errors: {}
            },
            t: {
                value: 'dog',
                viewValue: 'dog',
                $dirty: false,
                $errors: {}
            },
            $errors: {}
        };

        it("throws when called with a non-object", function () {
            const error = new TypeError('MapSchema.setModelValue(): argument must be an object');

            expect(() => m.setModelValue({}, 'meow')).toThrow(error);
            expect(() => m.setModelValue({}, [])).toThrow(error);
        });

        it("sets values", function () {
            const new_value = {
                s: 'cat',
                t: 'dog'
            };

            const data = m.createData();

            expect(m.setModelValue(data, new_value)).toEqual(expected_value);
            expect(m.setModelValue({}, new_value)).toEqual(expected_value);
            expect(m.setModelValue(undefined, new_value)).toEqual(expected_value);
        });

        it("sets partial values", function () {
            const data = {
                s: {
                    value: 'cat',
                    viewValue: 'cat',
                    $dirty: false,
                    $errors: {}
                },
                t: {
                    value: null,
                    viewValue: null,
                    $dirty: false,
                    $errors: {}
                },
                $errors: {}
            };

            const new_data = m.setModelValue(data, {
                t: 'dog'
            });

            expect(new_data).toEqual(expected_value);
            expect(data.s).toBe(new_data.s);  // unchanged by setModelValue()
        });
    });

    describe(".setViewValue()", function () {
        const m = new MapSchema({
            s: new Schema(),
            t: new Schema()
        });

        const expected_value = {
            s: {
                value: 'cat',
                viewValue: 'cat',
                $dirty: true,
                $errors: {}
            },
            t: {
                value: 'dog',
                viewValue: 'dog',
                $dirty: true,
                $errors: {}
            },
            $errors: {}
        };

        it("throws when called with a non-object", function () {
            const error = new TypeError('MapSchema.setViewValue(): argument must be an object');

            expect(() => m.setViewValue({}, 'meow')).toThrow(error);
            expect(() => m.setViewValue({}, [])).toThrow(error);
        });

        it("sets values", function () {
            const new_view_value = {
                s: 'cat',
                t: 'dog'
            };

            const data = m.createData();

            expect(m.setViewValue(data, new_view_value)).toEqual(expected_value);
        });

        it("sets partial values", function () {
            const data = {
                s: {
                    value: 'cat',
                    viewValue: 'cat',
                    $dirty: true,
                    $errors: {}
                },
                t: {
                    value: null,
                    viewValue: null,
                    $dirty: false,
                    $errors: {}
                },
                $errors: {}
            };

            const new_data = m.setViewValue(data, {
                t: 'dog'
            });

            expect(new_data).toEqual(expected_value);
            expect(data.s).toBe(new_data.s);  // unchanged by setViewValue()
        });
    });

    // TODO json
    xdescribe("toJSON()", function () {
        it("toJSON()", function () {
            const m = new MapSchema({
                s: new StringSchema({value: 'foo'})
            });
            const node = m.createNode();
            const value = m.toJSON(node);

            expect(value).toEqual({s: 'foo'});
        });

        it("with submit: false", function () {
            const m = new MapSchema({
                s: new StringSchema({value: 'foo'}),
                t: new StringSchema({value: 'bar', submit: false})
            });
            const node = m.createNode();
            const value = m.toJSON(node);

            expect(value).toEqual({s: 'foo'});
        });
    });
});
