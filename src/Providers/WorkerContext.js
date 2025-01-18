import {createContext} from "react";

// This context stores a reference to the current worker.
// It is consumed by child components which need to send messages to the worker.
const WorkerContext = createContext();

export default WorkerContext;
