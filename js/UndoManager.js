//Action Types
Action = {
    Set:"set",
    Remove:"remove",
    Move:"move"
}

//Action Object
function ActionObject(level, brickType, action, oldIndex = null, newIndex = null) {
    this.level = level;
    this.brickType = brickType;
    this.action = action;
    this.oldIndex = oldIndex;
    this.newIndex = newIndex;
}

//Undo Manager
function UndoManager() {
    const actionList = [];
    const undoneActionList = [];

    this.tookAction = function(actionObject) {
        actionList.push(actionObject);
    }

    this.undoAction = function() {
        const undoneAction = actionList.pop();
        if(undoneAction != undefined) {
            undoneActionList.push(undoneAction);
        }
        
        return undoneAction;
    }

    this.redoAction = function() {
        const actionToRedo = undoneActionList.pop();
        if(actionToRedo != undefined) {
            actionList.push(actionToRedo);
        }
        
        return actionToRedo;
    }
}