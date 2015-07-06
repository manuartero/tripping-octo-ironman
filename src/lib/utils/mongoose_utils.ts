/**
 * Exports common functions for every mongoose schema
 * 
 *  - toStringOverride
 *  - overwriteProperties
 *  - mergeProperties
 *  - updateAndCreate
 */
 
export function toStringOverride() : String {
    return JSON.stringify(this);
};

export function overwriteProperties(other: any) : void {
    for (var attrName in other) {
        this[attrName] = other[attrName];
    }
};

export function mergeProperties (other: any) : void {
    for (var attrName in other) {
        if (other[attrName] && !this[attrName]) {
            this[attrName] = other[attrName];
        }
    }
};

export function updateAndCreate(next: Function) : void {
    var now = new Date();
    this.updated_at = now;
    if (this.created_at) {
        this.increment();
    } else {
        this.created_at = now;
    }
    next();
};
