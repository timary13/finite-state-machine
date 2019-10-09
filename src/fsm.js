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

        this.storage = new Stack();
        
        this.config = config;
        this.state = config.initial;
        this.storage.pushing(this.state);
        this.getTransitions();


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
            console.log("getTransitions " + event);
            if(this.config.states[this.state].transitions.hasOwnProperty(event)) {
                console.log("+1");
                result.push(event);
            }
            console.log("result " + result);
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
        if(this.storage._size <= 1) {
            return false;
        }
        else {
            this.storage.poping();
            this.state = this.storage.poping();
            return true;
        }
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {

    }

    /**
     * Clears transition history
     */
    clearHistory() {}
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
