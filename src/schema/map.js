import _ from 'lodash';

import { ValidateMixin } from '../validate';


class MapSchema {
    constructor(children, options) {
        if (!_.isPlainObject(children)) {
            throw new TypeError('Map: children must be an object');
        }

        this.options = _.assign({
            submit: true
        }, options);

        this.children = _.pickBy(children, (child) => !!child);

        this.initValidateMixin();
    }

    /**
     * returns child schema node
     */
    getSchemaChild(child_id) {
        if (!this.children.hasOwnProperty(child_id)) {  // TODO startswith $
            throw new Error(`bad schema child ${child_id}`);
        }

        return this.children[child_id];
    }

    createData() {
        const child_nodes = _.mapValues(this.children, (child) => child.createData());

        return this.validate({}, child_nodes);  // TODO 1st arg?
    }

    setChild(data, key, new_child_data) {
        let new_data = _.assign({}, data, {
            [key]: new_child_data
        });

        return this.validate({}, new_data);  // TODO 1st arg?
    }

    getModelValue(data) {
        return _.mapValues(this.children, (child_schema_node, key) =>
            child_schema_node.getModelValue(data[key]));
    }

    /**
     * @return new data
     */
    setModelValue(data, new_val) {
        if (!_.isPlainObject(new_val)) {
            throw new TypeError('MapSchema.setModelValue(): argument must be an object')
        }

        let new_data = this._mapSchemaChildren(data, new_val,
            (child, node, arg) => child.setModelValue(node, arg));

        return this.validate(data, new_data);  // TODO 1st arg?
    }

    getViewValue(data) {
        return _.mapValues(this.children, (child_schema_node, key) =>
            child_schema_node.getViewValue(data[key]));
    }

    /**
     * @return new data
     */
    setViewValue(data, new_view_val) {
        if (!_.isPlainObject(new_view_val)) {
            throw new TypeError('MapSchema.setViewValue(): argument must be an object')
        }

        let new_data = this._mapSchemaChildren(data, new_view_val,
            (child, node, arg) => child.setViewValue(node, arg));

        return this.validate(data, new_data);  // TODO 1st arg?
    }

    /**
     * @return value (object)
     * children with submit: false will return undefined and will not be included
     */
    toJSON(node) {
        if (!this.options.submit) {
            return undefined;
        }

        return _(this.children).mapValues(
            (child, name) => child.toJSON(node[name])
        ).pickBy((v) => !_.isUndefined(v)).value();
    }

    /**
     * @return transaction
     */
    setFromJSON(node, json_val) {
        if (!_.isPlainObject(json_val)) {
            throw new TypeError('MapSchema.setFromJSON(): argument must be an object')
        }

        return this._mapSchemaChildren(node, json_val,
            (child, node, arg) => child.setFromJSON(node, arg));
    }

    isValid(node) {
        const me_valid = _.isUndefined(_.find(node.errors, el => el !== null));
        if (!me_valid) {
            return false;
        }

        const children_valid = _(this.children).map((child, name) =>
            child.isValid(node.children[name]));

        //console.log('MapSchema.isValid(): children_valid:', children_valid);

        return children_valid.every();
    }

    map(node, fn) {
        //return node.children.map(fn);
        return _.map(node.children, fn);
    }

    _mapSchemaChildren(node, arg, fn) {
        const NONE = {};

        const result = _(this.children).mapValues((child, name) => {
            if (name in arg) {
                return fn(child, node[name], arg[name]);
            } else {
                return NONE;
            }
        });

        return result.pickBy((el) => el !== NONE).value();
    }
}

_.assign(MapSchema.prototype, ValidateMixin);

export default MapSchema;