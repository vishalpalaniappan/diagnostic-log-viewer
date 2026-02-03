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
     * Group the execution of each step into their behaviors to process
     * them and identify semantic violations and to summarize it.
     * @param {Object} entry
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
        for (let i = 0; i < behaviors.length; i++) {
            behaviors[i].loadParticiants();
            behaviors[i].loadPlaceHolders();
            behaviors[i].validateRealizedIntent();
            behaviors[i].generateRealizedIntent();
        }
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
