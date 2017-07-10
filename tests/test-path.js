const { normalizePath, getDataNodeByPath, getSchemaNodeByPath } = require('../src/path');


describe("path", function () {
    describe("normalizePath()", function () {
        it("accepts . and empty string", function () {
            expect(normalizePath('.')).toEqual([]);
            expect(normalizePath('')).toEqual([]);
        });

        it("accepts dotted strings", function () {
            expect(normalizePath('a.b.c')).toEqual(['a', 'b', 'c']);
            expect(normalizePath('.a.b')).toEqual(['a', 'b']);
        });

        it("accepts numbers", function () {
            expect(normalizePath('3')).toEqual([3]);
            expect(normalizePath('a.0.c')).toEqual(['a', 0, 'c']);
        });

        it("accepts arrays", function () {
            expect(normalizePath(['a', 'b', 'c'])).toEqual(['a', 'b', 'c']);
        });
    });

    describe("getDataNodeByPath()", function () {
        it("handles empty path", function () {
            const data = {};
            expect(getDataNodeByPath(data, [])).toBe(data);
        });

        it("returns data node", function () {
            const data = {a: {b: {foo: 'foo'}}};
            const path = ['a', 'b'];

            expect(getDataNodeByPath(data, path)).toBe(data.a.b);
        });

        it("returns data node with lists", function () {
            const data = {a: [{value: 'foo'}, {b: {value: 'bar'}}]};
            const path = ['a', 1, 'b'];

            expect(getDataNodeByPath(data, path)).toBe(data.a[1].b);
        });

        it("throws bad path error", function () {
            const data = {a: {b: {value: 'foo'}}};
            const path1 = ['a', 'c'];
            const path2 = ['x', 'b'];

            expect(() => getDataNodeByPath(data, path1)).toThrow(
                new TypeError('bad path "a.c"')
            );
            expect(() => getDataNodeByPath(data, path2)).toThrow(
                new TypeError('bad path "x.b"')
            );
        });
    });

    xdescribe("getSchemaNodeByPath()", function () {
        // TODO
    });
});
