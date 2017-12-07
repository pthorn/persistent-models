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

    describe("accessors", function () {
        const s = new Schema({initialValue: 'foo'});
        const m = new ListSchema(s);
        const node = m.createData();

        // TODO
        xit(".getModelValue()", function () {
            const value = m.getModelValue(node);

            expect(value).toEqual({s: 'foo'});
        });

        // TODO
        xit(".getViewValue()", function () {
            const value = m.getViewValue(node);

            expect(value).toEqual({s: 'foo'});
        });
    });

    describe(".setModelValue()", function() {
        const s = new Schema();
        const m = new ListSchema(s);

        it("throws when setModelValue() is called with a non-list", function () {
            const error = new TypeError('ListSchema.setModelValue(): argument must be an array');

            expect(() => m.setModelValue('meow')).toThrow(error);
            expect(() => m.setModelValue({})).toThrow(error);
        });

        // TODO
        xit("sets values", function () {
            console.log('FORMAT', m.setModelValue([], ['a', 'b']));
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

        // TODO
        xit("parses", function () {

            console.log('PARSE', m.parse({
                //s: 'cat'
            }));

            //console.log('SCHEMA', m.children);
            //console.log('DATA', data);

            //expect(data.value).toBeNull();
            //expect(data.viewValue).toEqual('');
        });
    });

    // TODO json
});
