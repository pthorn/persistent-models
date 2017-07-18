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
                children: {
                    s
                }
            });

            //expect(() => new MapSchema([s])).toThrow(error);
            //expect(() => new MapSchema(s)).toThrow(error);
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
            s: s
        });

        it("creates data with no options", function () {
            const data = m.createData();
            const new_s_data = s.setModelValue('abc');
            const new_data = m.setChild(data, 's', new_s_data);

            expect(new_data).not.toBe(data);
            expect(new_data.s).toBe(new_s_data);
        });

        xit("creates data with no options", function () {
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
                $errors: {}
            },
            t: {
                value: 'dog',
                viewValue: 'dog',
                $errors: {}
            },
            $errors: {}
        };

        const error = new TypeError('MapSchema.setModelValue(): argument must be an object');

        it("throws when called with a non-object", function () {
            expect(() => m.setModelValue({}, 'meow')).toThrow(error);
            expect(() => m.setModelValue({}, [])).toThrow(error);
        });

        xit("sets values", function () {
            const new_value = {
                s: 'cat',
                t: 'dog'
            };

            const node = m.createData();

            expect(m.setModelValue(node, new_value)).toEqual(expected_value);
            expect(m.setModelValue({}, new_value)).toEqual(expected_value);
            expect(m.setModelValue(undefined, new_value)).toEqual(expected_value);
        });

        it("sets partial values", function () {
            const node = {
                s: {
                    value: 'cat',
                    viewValue: 'cat',
                    $errors: {}
                },
                t: {
                    value: null,
                    viewValue: null,
                    $errors: {}
                },
                $errors: {}
            };

            const new_node = m.setModelValue(node, {
                t: 'dog'
            });

            expect(new_node).toEqual(expected_value);
            // TODO expect(new_node.s).toBe(expected_value.s);
        });
    });

    // TODO same tests as for setModelValue
    describe(".setViewValue()", function () {
        const m = new MapSchema({
            s: new Schema()
        });

        const error = new TypeError('MapSchema.setViewValue(): argument must be an object');

        it("throws when called with a non-object", function () {
            expect(() => m.setViewValue({}, 'meow')).toThrow(error);
            expect(() => m.setViewValue({}, [])).toThrow(error);
        });

        it("parses", function () {
            const node = m.createData();

            // TODO ?
            expect(m.setViewValue(node, {
                s: 'foo'
            })).toEqual({
                s: {
                    value: 'foo',
                    viewValue: 'foo',
                    $errors: {}
                },
                $errors: {}
            });
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
