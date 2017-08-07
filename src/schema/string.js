import _ from 'lodash';

import { Schema } from '.';


function StringSchema(options = {}) {
    const parser = function (value) {
        const val = this.options.trim ? value.trim() : value;

        if (this.options.useNull) {
            return val === '' ? null : val
        } else {
            return val;
        }
    };

    const formatter = function (value) {
        return value === null ? '' : value;
    };

    const schema = new Schema(_.assign({
        initialValue: '',
        trim: true,
        useNull: false
    }, options));

    schema.parsers.push(parser);
    schema.formatters.unshift(formatter);

    return schema;
}

export default StringSchema;
