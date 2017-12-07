const ListSchema = require('../src/schema/list').default;
const { Schema } = require('../src/schema');


describe("ListSchema", function() {
    describe("ListSchema()", function() {
        const error = new TypeError('ListSchema: child must be a schema object');

        it("throws when no children are supplied", function () {
            expect(() => new ListSchema()).toThrow(error);
        });

        it("throws when children are supplied improperly", function () {
            const s = new Schema();

            expect(() => new ListSchema([s])).toThrow(error);
            expect(() => new ListSchema({})).toThrow(error);
        });

        it("creates", function () {
            const s = new Schema();
            const m = new ListSchema(s);

            expect(m.child).toBe(s);
        });
    });

    describe(".getSchemaChild()", function() {
        const s = new Schema();
        const m = new ListSchema(s);

        it("returns child", function () {
            expect(m.getSchemaChild(0)).toBe(s);
            expect(m.getSchemaChild(42)).toBe(s);
        });
    });

    describe(".createData()", function() {
        const s = new Schema();
        const m = new ListSchema(s);

        it("creates data node with no options", function () {
            const data = m.createData();

            expect(Array.from(data)).toEqual([]);  // Array.from() strips properties
            expect(data.$errors).toEqual({});
        });
    });

    describe(".setModelValue()", function() {
        const s = new Schema();
        const m = new ListSchema(s);

        it("throws when setModelValue() is called with a non-array", function () {
            const error = new TypeError('ListSchema.setModelValue(): argument must be an array');

            expect(() => m.setModelValue('meow')).toThrow(error);
            expect(() => m.setModelValue({})).toThrow(error);
        });

        it("sets values", function () {
            const data = m.setModelValue(m.createData(), ['a', 'b']);

            expect(Array.from(data)).toEqual([
                { value: 'a', viewValue: 'a', $dirty: false, $errors: {} },
                { value: 'b', viewValue: 'b', $dirty: false, $errors: {} }
            ]);
            expect(data.$errors).toEqual({});
            //expect(data.$dirty).toEqual(false);
        });
    });

    describe(".setViewValue()", function() {
        const s = new Schema();
        const m = new ListSchema(s);

        it("throws when setViewValue() is called with a non-list", function () {
            const error = new TypeError('ListSchema.setViewValue(): argument must be an array');

            expect(() => m.setViewValue('meow')).toThrow(error);
            expect(() => m.setViewValue({})).toThrow(error);
        });

        it("sets view values", function () {
            const data = m.setViewValue(m.createData(), ['a', 'b']);

            expect(Array.from(data)).toEqual([
                { value: 'a', viewValue: 'a', $dirty: true, $errors: {} },
                { value: 'b', viewValue: 'b', $dirty: true, $errors: {} }
            ]);
            expect(data.$errors).toEqual({});
            //expect(data.$dirty).toEqual(true);
        });
    });

    describe("accessors", function () {
        const s = new Schema({initialValue: 'foo'});
        const m = new ListSchema(s);
        const data = m.setModelValue(m.createData(), ['a', 'b']);

        it(".getModelValue()", function () {
            const value = m.getModelValue(data);

            expect(value).toEqual(['a', 'b']);
        });

        it(".getViewValue()", function () {
            const value = m.getViewValue(data);

            expect(value).toEqual(['a', 'b']);
        });
    });

    // TODO json
});
