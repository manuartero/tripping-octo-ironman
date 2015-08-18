/**
 * Exports common usefull functions for every model
 *
 *  - overwriteProperties
 *  - mergeProperties
 *  - updateAndCreate
 */

export function overwriteProperties(other: any) {
    // FIXME check if this contains key (attrName)
    for (var attrName in other) {
        this[attrName] = other[attrName];
    }
};

export function mergeProperties(other: any) {
    // FIXME check if this contains key (attrName)
    for (var attrName in other) {
        if (other[attrName]) {
            this[attrName] = other[attrName];
        }
    }
};

export function updateAndCreate(next: Function) {
    var now = new Date();
    this.updated_at = now;
    this.created_at ? this.increment() : this.created_at = now;
    next();
};
