import {createContext} from "react";

/**
 * Currently this simply stores the actions that
 * were triggered by the keyboard shortcuts.
 * 
 * This will be extended in the future, there are
 * a lot of things we can do like storing the
 * history of all the actions, not just keyboard
 * but even mouse actions and allow the user to
 * undo certain actions.
 */
const ActionsContext = createContext();

export default ActionsContext;
