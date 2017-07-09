import _ from 'lodash';

/**
 * Invalid exception
 */
export function Invalid(message, stop=false) {
    this.name = 'Invalid';
    this.message = message;
    this.stop = stop;
    this.stack = Error(this.message).stack;  // http://es5.github.io/#x15.11.1
}

Invalid.prototype = Object.create(Error.prototype);
Invalid.prototype.constructor = Invalid;


/**
 * Validation mixin
 */
export const ValidateMixin = {
    initValidateMixin() {
        this.validators = _([
            this.options.validator, this.options.validators
        ]).flatten().filter().value();
    },

    /** validate one level of hierarchy
     * (old_data, new_data)
     */
    validate(old_data, new_data) {
        let errors = {};

        for(let validator of this.validators) {
            // TODO implement path arg to invalidate children
            const setValid = function (valid, message) {
                if (!valid) {
                    errors[validator.key] = message;
                }
            };

            const new_value = ('value' in new_data) ? new_data.value : old_data.value;

            try {
                let ret = validator.validate(new_value, setValid, this, old_data, new_data);
            } catch (ex) {
                if (!(ex instanceof Invalid)) {
                    throw ex;
                }

                errors[validator.key] = ex.message;

                if (ex.stop) {
                    break;
                }
            }
        }

        new_data.errors = errors;

        return new_data;
    }
};
