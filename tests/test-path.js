describe("path tests", function () {
    const { normalizePath } = require('../src/path');

    describe("normalizePath() tests", function () {
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
});
