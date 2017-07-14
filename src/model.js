import { normalizePath, getDataNodeByPath, getSchemaNodeByPath } from './path';


function propagate (path, schema_node, data_node, mutate_leaf_node) {
    if (path.length > 0) {
        const key = path[0];

        //console.log('path', path, 'schema_node', schema_node);

        if (typeof schema_node.getSchemaChild !== 'function') {
            throw new Error(`Not a container at ${key}`);  // TODO
        }

        return schema_node.setChild(
            data_node,
            key,
            propagate(
                path.slice(1),
                schema_node.getSchemaChild(key),
                data_node[key],  // TODO schema_node.getChild(data_node, key),
                mutate_leaf_node
            )
        );
    }

    return mutate_leaf_node(schema_node, data_node);
}


function Model(schema, data, path = "") {
    const norm_path = normalizePath(path);
    const schema_node = getSchemaNodeByPath(schema, norm_path);
    const data_node = getDataNodeByPath(data, norm_path);

    return {
        createData() {
            return schema_node.createData();
        },

        getModelValue() {
            return schema_node.getModelValue(data_node);
        },

        /**
         * @return new data
         */
        setModelValue(val) {
            return propagate(
                norm_path,
                schema,
                data,
                (leaf_schema_node, leaf_data_node) =>
                    leaf_schema_node.setModelValue(leaf_data_node, val)
            );
        },

        getViewValue() {
            return schema_node.getViewValue(data_node);
        },

        /**
         * @return new data
         */
        setViewValue(val) {
            return propagate(
                norm_path,
                schema,
                data,
                (leaf_schema_node, leaf_data_node) =>
                    leaf_schema_node.setViewValue(leaf_data_node, val)
            );
        },

        isValid() {
            return schema_node.isValid(data_node);
        },

        getErrors() {
            return schema_node.getErrors(data_node);
        },
    }
}

export default Model;
