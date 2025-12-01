/**
 * This class constructures the execution tree using the abstraction map.
 */
class AbstractionMap {
    /**
     * Initialize the abstraction map.
     * @param {Object} map
     */
    constructor (map) {
        this.map = map.abstractions;
        this.printTreeToConsole = false;

        if (this.printTreeToConsole) {
            console.clear();
        }

        this.abstractionStack = [];
        this.currentAbstraction = null;
        this.executionTree = [];

        // Load the starting position into the abstraction map.
        for (const entry in this.map) {
            if (this.map[entry].start === true) {
                this.abstractionStack.push(this.map[entry]);
                this.currentAbstraction = this.map[entry];
            }
        }
    }

    /**
     * Add the provided id to the execution tree.
     * @param {Number} id
     */
    mapCurrentLevel (id) {
        if (this.abstractionStack.length > 0) {
            // move down abstraction level until you find parent of current id
            do {
                let found = false;
                this.currentAbstraction.abstractions.forEach((abs, index) => {
                    found = (abs.id === id)?true:found;
                });

                if (found) {
                    // found the abstraction, in the correct level
                    // we can exit the loop.
                    break;
                } else {
                    // haven't found the abstraction
                    // move down abstraction stack level
                    this.abstractionStack.pop();
                    const stackSize = this.abstractionStack.length - 1;
                    this.currentAbstraction = this.abstractionStack[stackSize];
                }
            } while (this.abstractionStack.length > 0);

            // check if the entry is in the abstraction.
            this.currentAbstraction.abstractions.forEach((entry, index) => {
                if (entry.id === id) {
                    if ("abstractions" in entry) {
                        // root abstraction with children
                        this.addToExecutionTree(entry, true);
                        this.abstractionStack.push(entry);
                        this.currentAbstraction = entry;
                    } else {
                        // leaf abstraction with no children
                        if (entry.type === "function_call") {
                            this.addToExecutionTree(entry, true);
                            this.abstractionStack.push(this.map[entry.target]);
                            this.currentAbstraction = this.map[entry.target];
                        } else {
                            this.addToExecutionTree(entry, false);
                        }
                    }
                    return;
                }
            });
        };
    }

    /**
     * This function adds the current position to the execution tree.
     * @param {Object} entry Entry which corresponds to the intent.
     * @param {Boolean} collapsible Indicates if this row is collapsible.
     * @param {Boolean} printFlag Boolean to print to console.
     */
    addToExecutionTree (entry, collapsible, printFlag) {
        this.executionTree.push({
            "level": this.abstractionStack.length,
            "intent": entry.intent,
            "collapsible": collapsible,
            "collapsed": false,
            "index": this.executionTree.length,
        });
        if (this.printTreeToConsole) {
            this.printLevel(this.abstractionStack.length, entry.intent);
        }
    }

    /**
     * Prints the design stack with the indentations to visualize it.
     * @param {*} length
     * @param {*} intent
     */
    printLevel(length, intent) {
        let str = "";
        for (let i = 0; i < length; i++) {
            str += "   ";
        }
        str = str + intent;
        console.log(str);
    }
};

export default AbstractionMap;
