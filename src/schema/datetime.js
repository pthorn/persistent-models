import _ from 'lodash';
import moment from 'moment';

import { Schema } from '.';
import { Invalid } from '../validate';


function DateTimeSchema(options) {
    const parser = function (value) {
        if (value.trim() === '') {
            return null;
        }

        // http://momentjs.com/docs/#/parsing/string-format/
        const result = moment(value, this.options.view_format, true);

        if (!result.isValid()) {
            throw new Invalid(this.options.parser_message);
        }

        return result.format();
    };

    const formatter = function (value) {
        if (value === null) {
            return '';
    }

        return moment(value).format(this.options.view_format);
    };

    /*
    _jsonValue(node) {
        //console.log('DateTimeSchema.toJSON(): node:', node, 'value:', node.value);
        // http://stackoverflow.com/questions/25725019/how-do-i-format-a-date-as-iso-8601-in-moment-js
        // TODO seamless mangles moment objects!
        return node.value.format();
    }

    setFromJSON(node, json_value) {
        // json_value is an ISO string http://momentjs.com/docs/#/parsing/string/
        return super.setFromJSON(node, json_value === null ? null : moment(json_value));
    }
    */

    const schema = new Schema(_.assign({
        view_format: 'DD.MM.YYYY HH:mm:ss',
        parser_message: 'Bad date format'
    }, options));

    schema.parsers.push(parser);
    schema.formatters.unshift(formatter);

    return schema;
}

export default DateTimeSchema;
