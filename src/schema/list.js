import _ from 'lodash';

import { ValidateMixin } from '../validate';


/**
 * contains a variable number of children of the same type
 */
class ListSchema {
    constructor(child, options) {
        if (child === undefined || child.createData === undefined) {
            throw new TypeError('ListSchema: child must be a schema object');
        }

        this.options = _.assign({
            includeIf: true,
            submit: true
        }, options);
        this.child = child;

        this.initValidateMixin();
    }

    getSchemaChild(child_id) {
        // TODO check child_id is a number?
        return this.child;
    }

    /**
     * @return node
     */
    createData() {
        const node = [];

        return this.validate([], node);
    }

    setChild(data, key, new_child_data) {
        // TODO check key is int

        const new_data = _.assign([], data);  // TODO Array.from(data); ?
        new_data[key] = new_child_data;

        return this.validate(data, new_data);  // TODO 1st arg?
    }

    /**
     * @return value
     */
    getModelValue(data) {
        return _.map(data, data_child =>
            this.child.getModelValue(data_child));
    }

    /**
     * @return new data
     */
    setModelValue(data, new_val) {
        if (!_.isArray(new_val)) {
            throw new TypeError('ListSchema.setModelValue(): argument must be an array')
        }

        let new_data = new_val.map((arg_child, i) =>
            this.child.setModelValue(data[i], arg_child));

        return this.validate(data, new_data);  // TODO 1st arg?
    }

    /**
     * @return value
     */
    getViewValue(data) {
        return _.map(data, data_child =>
            this.child.getViewValue(data_child));
    }

    /**
     * @return transaction
     */
    setViewValue(data, new_view_val) {
        if (!_.isArray(new_view_val)) {
            throw new TypeError('ListSchema.setViewValue(): argument must be an array')
        }

        let new_data = new_view_val.map((arg_child, i) =>
            this.child.setViewValue(data[i], arg_child));

        return this.validate(data, new_data);  // TODO 1st arg?
    }

    /**
     * @return JSON value (array)
     */
    toJSON(node) {
        return node.children.map(
            (child_node) => this.child.toJSON(child_node)
        ).filter((v) => !_.isUndefined(v));
    }

    /**
     * @return transaction
     */
    setFromJSON(node, json_val) {
        if (!_.isArray(json_val)) {
            throw new TypeError('ListSchema.setFromJSON(): value must be an array')
        }

        return {
            // TODO loop over child's children, not
            children: json_val.map((val) => {
                const child_node = this.child.createData();
                const transaction = this.child.setFromJSON(child_node, val);
                //console.log('ListSchema.setFromJSON(): child_node', child_node, 'txn', transaction);
                return _.merge(child_node, transaction);  // TODO does it handle nested arrays properly?
            })
        };
    }

    /**
     * @return boolean
     */
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

    getErrors(data) {
        // TODO!
        return _.map(data, data_child =>
            this.child.getErrors(data_child));
    }

    //
    // List-specific methods
    //

    size(data) {
        return data.length;
    }

    map(data, fn) {
        return _.map(data, fn);
    }

    /**
     * Remove all children for which fn(child_node) returns false.
     * @return transaction
     */
    filter(data, fn) {
        return _.filter(data, fn);
    }

    /**
     * @return transaction
     */
    add(data) {
        const new_child = this.child.createData();
        return data.concat(new_child);  // TODO preserve properties!
    }

    // TODO wtf is item
    //addAt(node, index, item) {
    //}

    /**
     * @return transaction
     */
    move(node, index_from, index_to) {
        alert('TODO ListSchema.move()');
    }

    /**
     * Remove child at index 'index'.
     * @return transaction
     */
    removeAt(node, index) {
        const my_size = this.size(node);
        if (index < 0 || index >= my_size) {
            throw new Error(`ListSchema.removeAt(): bad index ${index}, size is ${my_size}`);
        }

        return {
            children: _.without(node.children, node.children[index])
        };
    }
}

_.assign(ListSchema.prototype, ValidateMixin);

export default ListSchema;
