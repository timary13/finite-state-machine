module.exports = class Stack {
    constructor() {
        this._size = 0;
        this._storage = {};
    }

    pushing(data) {
        let size = ++this._size;
        this._storage[size] = data;
    };

    poping() {
        let size = this._size,
            deletedData;

        if (size) {
            deletedData = this._storage[size];
            delete this._storage[size];
            this._size--;
            return deletedData;
        }
    };
}


