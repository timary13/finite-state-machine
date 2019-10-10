var Stack = require('./stack');
const chai = require('../test/setup-mocha');


class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if(config ==null) {
            throw Error("No config!");
        }
        //main state storage
        this.storage = new Stack();
        //after-undo state storage
        this.storageReset = new Stack();
        this.config = config;
        //start state
        this.state = config.initial;
        this.storage.pushing(this.state);
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.state;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        //state is correct
        if(this.getStates().reduce((acum, item) => item == state ? acum += 1 : acum += 0, 0)) {
            this.state = state;
            this.storage.pushing(state);
            //save only last state
            this.storageReset.clearStorage();
            this.storageReset.pushing(state);
        }
        else {
            throw Error("Not correct state!");
        }

    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        console.log(" before trigger " + this.state);
        //event exist
        //event exist in transition
        if(this.getTransitions().reduce((acum, item) => event == item ? acum += 1 : acum += 0,0)
        && this.getTransitions(event).length != 0) {
            console.log("TRIGGER");
            this.state = this.config.states[this.state].transitions[event];
            this.storage.pushing(this.state);
        }
        else {
            console.log("Error");
            console.log("state " + this.state);
            throw Error("Not correct event!");
        }
        console.log("after trigger " + this.state);
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.state = this.config.initial;
        this.storage.pushing(this.state);
    }

    //return all transitions
    getTransitions(event) {
        let result = [];
        let stMas = this.getStates();
        if(event == undefined) {
            for(let st of stMas) {
                for(let key in this.config.states[st].transitions) {
                    result.push(key);
                }
            }
        }
        else {
            if(this.config.states[this.state].transitions.hasOwnProperty(event)) {
                result.push(event);
            }
        }
        return result;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        let result = [];
        //all states
        if(event == undefined) {
            for(let key in this.config.states) {
                result.push(key);
            }
        }
        //specified event
        else {
            for(let key in this.config.states) {
                if(this.config.states[key].transitions.hasOwnProperty(event)) {
                    result.push(key);
                }
            }
        }
        return result;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        //1st - initial
        if(this.storage._size <= 1) {
            return false;
        }
        else {
            this.storageReset.pushing(this.storage.poping());
            this.state = this.storage.poping();
            this.storage.pushing(this.state);
            return true;
        }
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        //when empty
        if( this.storageReset._size < 1) {
            return false;
        }
        else {
            this.state = this.storageReset.poping();
            this.storage.poping();
            return true;
        }
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.storageReset.clearStorage();
        this.storage.clearStorage();
        //to initial state
        this.state = this.config.initial;
        this.storage.pushing(this.state);
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
