import { node } from "prop-types";

export const layoutTrace = (atomicAbstraction) => {
    const trace = atomicAbstraction.trace;
    console.log("Laying out trace:", trace);

    // const initialNodes = [
    //     {id: "1", position: {x: 0, y: 0}, data: {label: "1"}},
    //     {id: "2", position: {x: 0, y: 100}, data: {label: "2"}},
    // ];

    const nodes = [];
    for (let i = 0; i < trace.length; i++) {
        const node = {
            id: trace[i].uid,
            position: {x: 0, y: (i + 1) * 100},
            data: {label: trace[i].step.id},
        };
        nodes.push(node);
    }
    return {
        nodes: nodes,
    };
};
