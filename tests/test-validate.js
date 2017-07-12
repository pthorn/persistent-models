'use strict';


describe("validate tests", function() {
    const _ = require('lodash');
    const { ValidateMixin, Invalid } = require('../src/validate');

    describe("Validate", function () {
        const SchemaNode = function (options) {
            this.options = _.assign({}, options);
            this.initValidateMixin();
        };

        _.assign(SchemaNode.prototype, ValidateMixin);

        it("calls validators with correct args", function () {
            const validators = [{
                key: 'validator0',
                validate: jest.genMockFunction()
            }, {
                key: 'validator1',
                validate: jest.genMockFunction()
            }, {
                key: 'validator2',
                validate: jest.genMockFunction()
            }];

            const schema_node = new SchemaNode({
                validator: validators[0],
                validators: [validators[1], validators[2]]
            });

            const old_data = {value: 42};
            const new_data = {};
            schema_node.validate(old_data, new_data);

            for(let v of validators) {
                expect(v.validate.mock.calls.length).toBe(1);

                const args = v.validate.mock.calls[0];

                expect(args[0]).toBe(42);
                expect(args[2]).toBe(schema_node);
                expect(args[3]).toBe(old_data);
                expect(args[4]).toBe(new_data);
            }
        });

        it("puts validation messages in new_data.$errors", function () {
            const validators = [{
                key: 'validator0',
                validate: function () {}
            }, {
                key: 'validator1',
                validate: function () {
                    throw new Invalid('validator1 Invalid');
                }
            }, {
                key: 'validator2',
                validate: function (new_value, setValid) {
                    setValid(false, 'validator2 message');
                }
            }, {
                key: 'validator3',
                validate: function (new_value, setValid) {
                    setValid(true, 'validator3 message');
                }
            }];

            const schema_node = new SchemaNode({
                validators: validators
            });

            const old_data = {value: 42};
            const new_data = {};
            schema_node.validate(old_data, new_data);

            expect(new_data.$errors.validator0).toBeUndefined();
            expect(new_data.$errors.validator1).toBe('validator1 Invalid');
            expect(new_data.$errors.validator2).toBe('validator2 message');
            expect(new_data.$errors.validator3).toBeUndefined();
        });
    });
});
