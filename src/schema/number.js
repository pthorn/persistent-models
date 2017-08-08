import _ from 'lodash';

import { Schema } from '.';
import { Invalid } from '../validate';


function NumberSchema(options) {
    const parser = function (value) {
        if (value.trim() === '') {
            return true;
        }

        const result = (() => {
            if (this.options.format === 'float') {
                return parseFloat(value);
            } else if (this.options.format === 'hex') {
                return parseInt(value, 16);
            } else {
                return parseInt(value, 10);
            }
        })();

        let is_valid = !isNaN(result);
        if (!this.options.format === 'float') {
            is_valid = is_valid && (result | 0) === result;
        }

        if (!is_valid) {
            throw new Invalid(this.options.parser_message);
        }

        return result;
    };

    const formatter = function (value) {
        return value === null ? '' : value.toString();
    };

    const schema = new Schema(_.assign({
        format: 'int',
        parser_message: 'Bad number format'
    }, options));

    if (!_.find(['int', 'float', 'hex'], el => el === schema.options.format)) {
        throw new TypeError(`format expected to be int, float, or hex, got "${schema.options.format}" instead`);
    }

    schema.parsers.push(parser);
    schema.formatters.unshift(formatter);

    return schema;
}

export default NumberSchema;
