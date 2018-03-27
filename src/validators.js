'use strict';

var _ = require('lodash');

import { Invalid } from './validate';


export function required (message = 'Field is required') {
    return {
        key: 'required',
        onAttached(schema) {
            // TODO add required flag
        },
        validate(value, setValid) {
            // TODO '' is for StringModel, null for everything else, what about string list?
            // TODO implement and use isEmptyValue()?

            const valid = value !== null && value !== '';
            setValid(valid, message);
        }
    };
}


export function length (min, max, message = 'Incorrect length') {
    return {
        key: 'length',
        validate(value, setValid) {
            var valid = true;

            if (min !== undefined) {
                if (value.length < min) {
                    valid = false;
                }
            }

            if (max !== undefined) {
                if (value.length > max) {
                    valid = false;
                }
            }

            setValid(valid, message);
        }
    };
}


export function identifier (message_) {
    const re = /^[A-Za-z0-9_\.-]+$/;
    const message = message_ || 'Invalid identifier';

    return {
        key: 'identifier',
        validate(value, setValid) {
            const valid = value === '' || re.test(value);
            //console.log('identifier.validate():', value, valid ? 'valid' : 'INVALID');
            setValid(valid, message);
            //if (!valid) {
            //    throw new Invalid(message);
            //}
        }
    };
}


export function email (message_) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    const message = message_ || 'Invalid email address';

    return {
        key: 'email',
        validate(value, setValid) {
            if (!value) {
                setValid(true);
                return;
            }

            const valid = re.test(value);
            setValid(valid, message);
        }
    };
}


export function range (min, max, message_) {
    const message = message_ || 'Value not in range';

    return {
        key: 'range',
        validate(value, setValid) {
            var valid = true;

            if (_.isNumber(min)) {
                valid = valid && value >= min;
            }

            if (_.isNumber(max)) {
                valid = valid && value <= max;
            }

            setValid(valid, message);
        }
    };
}


export function uuid(message_) {
    const re = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const message = message_ || 'Bad UUID';

    return {
        key: 'uuid',
        validate(value, setValid) {
            const valid = value === '' || re.test(value);
            setValid(valid, message);
        }
    };
}


/*
var PasswordsMatch = function (path1, path2, message) {
    var message = message || 'Passwords do not match';

    return function (model) {
        //console.log('PasswordsMatch: model =', model);

        var valid = model.child(path1).getValue() === model.child(path2).getValue();

        model.child(path1).setValid(valid, 'passwords-match', message);
        model.child(path2).setValid(valid, 'passwords-match', message);
    }
};
 */
