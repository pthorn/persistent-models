import _ from 'lodash';

import { ValidateMixin, Invalid } from '../validate';


export class Schema {
    constructor(options) {
        this.options = _.assign({
            initialValue: null,
            submit: true
        }, options);

        this.parsers = _([
            this.options.parsers, this.options.parser
        ]).flatten().filter().value();

        this.formatters = _([
            this.options.formatter, this.options.formatters
        ]).flatten().filter().value();

        this.initValidateMixin();
    }

    createData() {
        return this.setModelValue({}, this.options.initialValue);
    }

    getModelValue(data) {
        return data.value;
    }

    /**
     * @return new data
     */
    setModelValue(data, new_val) {
        let new_view_val = new_val;
        for (let fn of this.formatters) {
            new_view_val = fn.call(this, new_view_val);
            // TODO
            if (_.isUndefined(new_view_val)) {
                return;
            }
        }

        return this.validate(data, {
            value: new_val,
            viewValue: new_view_val,
            $dirty: !!data.$dirty
        });
    }

    getViewValue(data) {
        return data.viewValue;
    }

    /**
     * @return new data
     * TODO implement setValid() for parsers like in validators
     */
    setViewValue(data, new_view_val) {
        let new_val = new_view_val;

        try {
            for (let fn of this.parsers) {
                new_val = fn.call(this, new_val);
                // TODO ?
                //if (_.isUndefined(new_val)) {
                //    break;
                //}
            }
        } catch (ex) {
            //console.log('CATCH', ex);
            if (!(ex instanceof Invalid)) {
                throw ex;
            }

            return {
                viewValue: new_view_val,
                $dirty: true,
                $errors: {'$parser': ex.message}
            };
        }

        return this.validate(data, {
            value: new_val,
            viewValue: new_view_val,
            $dirty: true
        });
    }

    toJSON(node) {
        //if ('submit' in node.extras && !node.extras.submit) {
        if (!this.options.submit) {
            return undefined;
        }

        return this._jsonValue(node);
    }

    _jsonValue(node) {
        return node.value;
    }

    /**
     * @return transaction
     */
    setFromJSON(node, json_val) {
        return this.format(node, json_val);
    }

    /**
     * @return boolean
     */
    isValid(node) {
        return _.isEmpty(node.$errors);
    }

    /**
     * @return object
     */
    getErrors(node) {
        return node.$errors;
    }

    /**
     * @return boolean
     */
    isDirty(data) {
        return data.$dirty;
    }
}

_.assign(Schema.prototype, ValidateMixin);
