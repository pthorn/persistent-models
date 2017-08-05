import _ from 'lodash';


export function normalizePath (path) {
    let path_split;

    if (_.isArray(path)) {
        path_split = _(path).map(
            el => typeof el === 'string' ? el.split('.') : el
        ).flatten();
    } else {
        path_split = _(path.split('.'));
    }

    path_split = path_split.filter(el =>
        el !== ''
    ).map(el => {
        const el_as_int = parseInt(el, 10);
        return _.isNaN(el_as_int) ? el : el_as_int;
    });

    return path_split.value();
}


/**
 * path: array of components
 */
export function getSchemaNodeByPath (schema, path) {
    const schema_node = _.reduce(path, (node, comp) => node.getSchemaChild(comp), schema);

    // TODO better error handling
    if (_.isUndefined(schema_node)) {
       throw new TypeError(`path does not exist in schema: ${JSON.stringify(path)}`);
    }

    return schema_node;
}


export function getDataNodeByPath (data, path) {
    if (path.length === 0) {
        return data;
    }

    const node =  _.get(data, path);

    if (_.isUndefined(node)) {
        throw new TypeError(`bad path "${path.join('.')}"`);
    }

    return node;
}
