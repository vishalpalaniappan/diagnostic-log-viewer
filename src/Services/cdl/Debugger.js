import clpFfiJsModuleInit from "clp-ffi-js";

import CDL_WORKER_PROTOCOL from "../CDL_WORKER_PROTOCOL";
import {readFile} from "../helper/ReadFile";
import CdlLog from "./CdlLog";

/**
 * This class accepts a CDL file object or URL and exposes the functions
 * needed to interact with the program.
 */
class Debugger {
    /**
     * Loads the CDL file and initializes the debugger state.
     * @param {File|String} cdlFile File object or URL of CDL log file.
     * @param {Number} executionIndex
     */
    constructor (cdlFile, executionIndex) {
        readFile(cdlFile).then(async (data) => {
            const module = await clpFfiJsModuleInit();
            const streamReader = new module.ClpStreamReader(data, {});
            const log = streamReader.decodeRange(0, streamReader.deserializeStream(), false);
            this.parseLogAndInitializeDebugger(log);

            if (executionIndex) {
                if (executionIndex < 0 || executionIndex >= this.cdl.execution.length) {
                    console.debug("The provided execution index is out of bounds.");
                    console.debug("Going to end of the program.");
                    this.replayProgram();
                } else {
                    this.cdl.getPositionData(executionIndex);
                }
            } else {
                this.replayProgram();
            }
        });
    }

    /**
     * This function parses the CDL log file and intializes the debugger state.
     * @param {Array} log Contents of decompressed CDL log file.
     */
    parseLogAndInitializeDebugger (log) {
        this.cdl = new CdlLog(log);
        this.breakpoints = [];
        console.info(this.cdl);
        postMessage({
            code: CDL_WORKER_PROTOCOL.GET_METADATA,
            args: {
                fileTree: this.cdl.header.getSourceFiles(),
            },
        });
    }

    /**
     * This function returns the variable stack at a given position.
     * @param {Number} position
     */
    getVariableStack (position) {
        const [localVariables, globalVariables] = this.cdl.getVariablesAtPosition(position);
        postMessage({
            code: CDL_WORKER_PROTOCOL.GET_VARIABLE_STACK,
            args: {
                localVariables: localVariables,
                globalVariables: globalVariables
            },
        });
    }

    /**
     * This function moves to the start of the file.
     */
    goToStart () {
        this.cdl.getPositionData(this.cdl.firstStatement);
    }

    /**
     * This function moves to the end of the file.
     */
    goToEnd () {
        this.cdl.getPositionData(this.cdl.lastStatement);
    }

    /**
     * This function steps into the next position.
     * @param {Number} position
     */
    stepInto (position) {
        const nextPosition = this.cdl._getNextPosition(position);
        if (nextPosition == null) {
            // End of file has been reached 
            return;
        }
        const callStack = this.cdl.getCallStackAtPosition(nextPosition);
        this.cdl.getPositionData(callStack[callStack.length - 1].position);
    }

    /**
     * This function steps out of the current position.
     * @param {Number} position
     */
    stepOut (position) {
        const callStack = this.cdl.getCallStackAtPosition(position);
        if (callStack.length <= 1) {
            return;
        }
        this.cdl.getPositionData(callStack[callStack.length - 2].position);
    }

    /**
     * This function steps over any function calls.
     * @param {Number} position
     */
    stepOverForward (position) {
        const originalStack = this.cdl.getCallStackAtPosition(position);

        while (position < this.cdl.execution.length) {
            position = this.cdl._getNextPosition(position);
            
            if (position == null) {
                // The end of the file has been reached
                return;
            }

            if (this.cdl.getCallStackAtPosition(position).length <= originalStack.length) {
                this.cdl.getPositionData(position);
                return;
            }
        }
    }

    /**
     * This function steps over any function calls backwards.
     * @param {Number} position
     */
    stepOverBackward (position) {
        const originalStack = this.cdl.getCallStackAtPosition(position);

        while (position >= 0) {
            position = this.cdl._getPreviousPosition(position);
            
            if (position == null) {
                // Start of file has been reached
                return;
            }

            if (this.cdl.getCallStackAtPosition(position).length <= originalStack.length) {
                this.cdl.getPositionData(position);
                return;
            }
        }
    }

    /**
     * Play the program from the start.
     * @param {Number} position 
     */
    replayProgram (position) {
        this.playForward(0);
    }

    /**
     * Play the program forward from the given position.
     * @param {Number} position 
     * @returns 
     */
    playForward (position) {
        do {
            position = this.cdl._getNextPosition(position);

            if (position == null) {
                // End of file has been reached
                this.cdl.getPositionData(this.cdl.lastStatement);
                return;
            }

            for (const breakpoint of this.breakpoints) {
                if (breakpoint.enabled && breakpoint.id === this.cdl.execution[position].lt) {
                    this.cdl.getPositionData(position);
                    return;
                }
            };
        } while (position < this.cdl.execution.length);
    }

    /**
     * Play the program backward from the given position.
     * @param {Number} position 
     * @returns 
     */
    playBackward (position) {
        do {
            position = this.cdl._getPreviousPosition(position);

            if (position == null) {
                // Start of file has been reached
                this.cdl.getPositionData(this.cdl.firstStatement);
                return;
            }

            for (const breakpoint of this.breakpoints) {
                if (breakpoint.enabled && breakpoint.id === this.cdl.execution[position].lt) {
                    this.cdl.getPositionData(position);
                    return;
                }
            };
        } while (position >= 0);
    }

    /**
     * Toggles the breakpoint at the given filename and line number.
     * @param {String} fileName 
     * @param {Number} lineNumber 
     */
    toggleBreakpoint(fileName, lineNumber) {
        const lt = this.cdl.header.getLogTypeFromLineNumber(fileName, lineNumber);

        if (lt === null) {
            return;
        }
        
        if (this.breakpoints.includes(lt)) {
            this.breakpoints.splice(this.breakpoints.indexOf(lt), 1);
        } else {
            lt.enabled = true;
            this.breakpoints.push(lt);
        }

        postMessage({
            code: CDL_WORKER_PROTOCOL.BREAKPOINTS,
            args: {
                breakpoints: this.breakpoints,
            },
        });
    }

    /**
     * Enables/Disables the breakpoint given a fileName and lineNumber.
     * @param {String} fileName 
     * @param {Number} lineNumber 
     */
    toggleBreakpointEnabled(fileName, lineNumber) {
        const lt = this.cdl.header.getLogTypeFromLineNumber(fileName, lineNumber);
        if (lt === null) {
            console.warn('Breakpoint not found');
            return;
        }

        const index = this.breakpoints.indexOf(lt);
        if (index === -1) {
            console.warn('Breakpoint not in active breakpoints list');
            return;
        }

        this.breakpoints[index].enabled = !this.breakpoints[index].enabled;

        postMessage({
            code: CDL_WORKER_PROTOCOL.BREAKPOINTS,
            args: {
                breakpoints: this.breakpoints,
            },
        });
    }
};

export default Debugger;
