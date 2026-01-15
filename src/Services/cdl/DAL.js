/**
 * Design Abstraction Language (DAL) class to work
 * with an instrumented DAL Specification (DALSpec).
 */
class DAL {
    /**
     * Initialize the DAL Interpretter
     * @param {Object} DALSpec
     */
    constructor (DALSpec) {
        this.DALSpec = DALSpec;
    }

    /**
     * Set the cursor of the DAL execution walker by passing
     * it the atomic design abstraction.
     */
    setCursor () {

    }

    /**
     * Move the cursor by passing the next abstraction that
     * was read from the execution. This function will validate
     * the next move through the designs structure.
     */
    moveCursor () {

    }

    /**
     * Lists the design abstractions specified in DALSpec.
     */
    listAbstractions () {

    }

    /**
     * Describes the specified DALSpec.
     * @param {String} id ID of the abstraction.
     */
    describeAbstraction (id) {

    }
}

export default DAL;
