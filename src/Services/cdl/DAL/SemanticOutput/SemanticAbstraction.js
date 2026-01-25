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
            const stateName = placeholder.state;
            if (!(stateName in this.state)) {
                // console.log("var " + stateName + " not found in state.");
                continue;
            }
            const value = this.state[stateName].value;
            const regex = new RegExp(placeholder.key, "g");
            actionSentence = actionSentence.replace(regex, value);
        }
        return actionSentence;
    }

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
     * TODO: In each step, there is now a behavior and execution key.
     * The execution is just a list of all the executions in the step
     * and the behavior is a list of all the behaviors with the executions
     * which define it. I am keeping the execution for now because the UI
     * uses it but I will be restructing things to use the behavior list.
     * So when a step is selected, you will have the behaviors in the step
     * and then by selecting a behavior you can see the execution.
     *
     * @param {Object} entry
     * @return {Object}
     */
    processBehavior (entry) {
        /**
         * TODO: Selector types will have a state variable and that is the
         * option that was selected. I haven't yet decided how I am going to
         * formalize this. Right now, when performing the transformation,
         * in SelectorStep.js, I save the selected option in the selectedValue
         * key of the step. So entry.selectedValue will have the option that
         * was selected and this is the value of the state variable of the
         * selector step.
         *
         * TODO: If this selectedValue key is undefined, then it means the
         * selector didn't resolve to an option. This is fine, in some cases
         * where the selector isn't mutually exclusive. It tells us that this
         * step didn't select new behavior. However, right now, I don't add
         * the selector to the design trace unless it selects new behavior.
         * I might want to change this in the future.
         */
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
