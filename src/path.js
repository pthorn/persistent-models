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
        const el_as_int = parseInt(el);
        return _.isNaN(el_as_int) ? el : el_as_int;
    });

    return path_split.value();
}
