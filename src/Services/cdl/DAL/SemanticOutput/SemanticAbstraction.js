import Behavior from "./Behavior.js";
/**
 * This class contains a semantic abstraction.
 */
class SemanticAbstraction {
    /**
     * Initializes the semantic abstraction.
     * @param {String} entry
     * @param {Object} DALSpec
     */
    constructor (entry, DALSpec) {
        this.steps = [];
        this.currentStep;
        this.state = {};

        this.DALSpec = DALSpec;
        this.designAbsUid = entry.designAbsUid;
        this.behaviorsInDesign = DALSpec.behavior;

        for (let i = 0; i < DALSpec.design.length; i++) {
            const abs = DALSpec.design[i];
            if (abs.id === entry.designAbsName) {
                this.designAbs = abs;
                break;
            }
        }
    }

    /**
     * Composes the state of the semantic abstraction.
     * @return {String}
     */
    composeState () {
        let actionSentence = this.designAbs.action;
        const placeholders = this.designAbs.placeholders;

        if (!placeholders || placeholders.length === 0) {
            return;
        }

        for (let i = 0; i < placeholders.length; i++) {
            const placeholder = placeholders[i];
            if (placeholder.type === "step_execution_count") {
                const value = this.getStepExecutionCount(placeholder.step);
                const regex = new RegExp("<" + placeholder.state + ">", "g");
                actionSentence = actionSentence.replace(regex, value);
                continue;
            }

            if (placeholder.type === "select_sentence_boolean") {
                const value = this.getValue(placeholder);
                const p = placeholder;
                const sentence = (value)?p.if_value_exists:p.if_value_does_not_exist;
                const regex = new RegExp("<" + placeholder.state + ">", "g");
                actionSentence = actionSentence.replace(regex, sentence);
                continue;
            }

            if (placeholder.type === "state") {
                const value = this.getValue(placeholder);
                if (value === undefined) {
                    // TODO: Handle undefined values more gracefully, right now
                    // the placeholder just remains in the sentence.
                    continue;
                }
                const regex = new RegExp("<" + placeholder.state + ">", "g");
                actionSentence = actionSentence.replace(regex, value);
                continue;
            }

            console.warn("Unknown placeholder type: " + placeholder.type);
        }
        return actionSentence;
    }

    /**
     * Get the value for the given placeholder.
     * @param {Object} placeholder
     * @return {*}
     */
    getValue (placeholder) {
        if ("selection" in placeholder) {
            /**
             * If the state is from a selection, we need to find the step
             * that made the selection and get the value from there.
             */
            for (let i = 0; i < this.steps.length; i++) {
                const step = this.steps[i];
                const stepId = step.step.id;
                if (stepId === placeholder.step && placeholder.state in step.selection.state) {
                    return step.selection.state[placeholder.state].value;
                }
            }
        } else {
            return this.state[placeholder.state].value;
        }
    }

    /**
     * Get the step execution count for the given step id.
     * @param {String} stepId
     * @return {Number}
     */
    getStepExecutionCount (stepId) {
        let count = 0;
        for (let i = 0; i < this.steps.length; i++) {
            const step = this.steps[i];
            if (step.step.id === stepId) {
                count++;
            }
        }
        return count;
    };

    /**
     * Displays the semantic abstraction.
     */
    display () {
        const spacer = "     ";
        const spacerStr = spacer.repeat(this.steps[0].level);
        const sentence = this.composeState();
        console.log("\x1b[36m" + spacerStr + ">  " + sentence + "\x1b[0m");
        for (let i = 0; i < this.steps.length; i++) {
            const step = this.steps[i];
            console.log(spacerStr + step.step.id);

            if (step.selection) {
                step.selection.display();
            }
            if (step.forkedTree) {
                console.log("");
                console.log("----forked tree----");
                step.forkedTree.display();
                console.log("----end forked tree----");
                console.log("");
            }
        }
    }

    /**
     * Adds a step to the semantic abstraction.
     * @param {Object} step
     */
    addStep (step) {
        if (step.type === "selector") {
            const stateName = "option_" + step.step.id;
            const state = {
                [stateName]: {
                    name: stateName,
                    value: step.selectedValue,
                },
            };
            Object.assign(this.state, state);
        }
        step.state = this.processBehavior(step);
        this.steps.push(step);
        this.currentStep = step;
    }

    /**
     * Adds a selection to the current step. This builds the
     * abstraction tree.
     * @param {Object} abs
     */
    addSelection (abs) {
        this.currentStep.selection = abs;
    }

    /**
     * Group the execution of each step into their behaviors to extract
     * the relevant state variables so the design abstraction can use it.
     *
     * This means that the design abstraction will be defined entirely
     * through the behaviors and its state variables. This is a very
     * clean separation and the design specification will survive
     * any changes to the implementation as it is fully defined in a
     * separate abstraction.
     *
     * @param {Object} entry
     * @return {Object}
     */
    processBehavior (entry) {
        if (entry.type === "selector") {
            return;
        }


        const behaviors = [];
        let currBehavior;
        for (let i = 0; i < entry.execution.length; i++) {
            const entryBehavior = entry.execution[i].behavior.id;
            if (currBehavior && currBehavior?.behaviorInfo.id === entryBehavior) {
                currBehavior.addExecution(entry.execution[i]);
            } else {
                const behaviorInfo = this.getBehaviorInfo(entryBehavior);
                currBehavior = new Behavior(behaviorInfo);
                currBehavior.addExecution(entry.execution[i]);
                behaviors.push(currBehavior);
            }
        }
        entry.behaviors = behaviors;
        const state = {};
        for (let i = 0; i < behaviors.length; i++) {
            behaviors[i].evaluateState();
            Object.assign(state, behaviors[i].stateVariables);
            Object.assign(this.state, behaviors[i].stateVariables);
        }
        return state;
    }

    /**
     * Get the behavior info.
     * @param {String} behaviorId
     * @return {Object|null}
     */
    getBehaviorInfo (behaviorId) {
        for (let i = 0; i < this.behaviorsInDesign.length; i++) {
            if (this.behaviorsInDesign[i].id === behaviorId) {
                return this.behaviorsInDesign[i];
            }
        };
    }
}

export default SemanticAbstraction;
