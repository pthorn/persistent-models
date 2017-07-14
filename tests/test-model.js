const MapSchema = require('../src/schema/map').default;
const { Schema } = require('../src/schema');
const Model = require('../src/model').default;
// const ListSchema = require('../js/schema/list').default;
// const Action = require('../js/actions').default;
// const mutate = require('../js/mutate').default;
//const { Invalid } = require('../js/validate');


describe("Model tests", function() {

    describe("TODO", function () {
        it("a", function () {
            const s = new MapSchema({
                a: new Schema(),
                b: new Schema()
            });
            const node = s.createData();

            const new_node = Model(s, node, 'a').setModelValue('aaa');
            // console.log('old node:', node);
            // console.log('setModelValue() result:', new_node);

            expect(new_node.b).toBe(node.b);
            expect(new_node.a).not.toBe(node.a);
            expect(new_node).not.toBe(node);
            expect(new_node.a.value).toEqual('aaa');
        });
    });

    xdescribe("Mutate", function () {
        it("a", function () {
            const s = new StringSchema();
            const node = s.createNode();

            const new_node = mutate(Action(node, s).setValue('.', 'aaa'));

            expect(new_node).not.toBe(node);
            expect(new_node.value).toEqual('aaa');
        });

        it("b", function () {
            const s = new MapSchema({
                a: new StringSchema(),
                b: new StringSchema()
            });

            const node = s.createNode();

            const new_node = mutate(Action(node, s).setValue('a', 'aaa'));

            expect(new_node.b).toBe(node.b);
            expect(new_node.a).not.toBe(node.a);
            expect(new_node).not.toBe(node);
            expect(new_node.a.value).toEqual('aaa');
        });

        it("c", function () {
            const s = new MapSchema({
                a: new StringSchema(),
                b: new ListSchema(new MapSchema({
                    c: new StringSchema(),
                    d: new StringSchema()
                }))
            });

            const node = s.createNode();
            //console.log('INIT', node);

            const node2 = mutate(Action(node, s).add('b'));
            //console.log('ADD', node2);

            expect(node2.a).toBe(node.a);
            expect(node2.b).not.toBe(node.b);
            expect(node2).not.toBe(node);

            const node3 = mutate(Action(node2, s).setValue('b.0.c', 'b.c value'));
            //console.log('NEW', node3);
            //console.log('NEW b.0', node3.b[0]);

            expect(node3.a).toBe(node2.a);
            expect(node3.b[0].d).toBe(node2.b[0].d);
            expect(node3.b[0].c).not.toBe(node2.b[0].c);
            expect(node3.b[0]).not.toBe(node2.b[0]);
            expect(node3.b).not.toBe(node2.b);
            expect(node3).not.toBe(node2);
        });
    });
});
