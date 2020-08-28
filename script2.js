const scriptInput = document.querySelector(".script");
const showing = document.querySelector(".showing");
const showingP = showing.querySelector("p");
const modes = document.querySelectorAll(".mode");
const submitBtn = document.querySelector(".script-submit");
const delBtn = document.querySelector(".delete");
const exportBtn = document.querySelector(".export");
const ENTER = 13;
const BACKSPACE = 8;
const UP_ARROW_KEY = 38;
const DOWN_ARROW_KEY = 40;
const SELECTED = "selected";
const SCR_LS = "savedScripts";
const action = document.querySelector(`.${SELECTED}`).dataset.type;

let dialogObjects = [];
let stringsLength = 1;
let currentLine = 1;
// END OF GLOBAL SCOPE'S VARIABLES

/*
function Dialog(action) {
    // this.row = dialogObjects.length + 1;
    this.row = 0;
    this.action = action;
    this.script = "";
}

Dialog.prototype.getRow = function() {
    return this.row;
}

Dialog.prototype.getAction = function() {
    return this.action;
}

Dialog.prototype.getScript = function() {
    return this.script;
}

Dialog.prototype.setRow = function(row) {
    this.row = row;
}

Dialog.prototype.setAction = function(action) {
    this.action = action;
}

Dialog.prototype.setScript = function(text) {
    this.script = text;
}
*/
// END OF OBJECTS

function getType(row) {
    // 줄을 바탕으로 버튼에 어떤 action인지 표시한다.
    const currentAction = dialogObjects[row - 1]['action'];
    console.log(currentAction);
    modes[0].classList.remove(SELECTED);
    modes[1].classList.remove(SELECTED);
    if (currentAction === "dialog") {
        modes[0].classList.add(SELECTED);
    } else {
        modes[1].classList.add(SELECTED);
    }
}

function refreshDialogs(strings) {
    dialogObjects.forEach((object, index) => {
        object['script'] = strings[index];
        object['row'] = index + 1;
    })
}

function getTextArr() {
    const value = scriptInput.value;
    const strings = value.split("\n");
    return strings;
}

function getRow(textarea) {
    const txts = textarea.value;
    const txtsArr = txts.split("\n");
    const cursorPoint = textarea.selectionStart;
    let lineStart = 0;
    for (let i = 0; i < txtsArr.length; i++) {
        let lineEnd = lineStart + txtsArr[i].length + 1;
        if (lineStart <= cursorPoint && cursorPoint < lineEnd) {
            const lineIndex = i + 1;
            return lineIndex;
        } else {
            lineStart = lineEnd;
        }
    }
}

function getDraggedRows(textarea, rowStart) {
    const txts = textarea.value;
    const txtsArr = txts.split("\n");
    const cursorEnd = textarea.selectionEnd;
    let lineStart = 0;
    for (let i = 0; i < txtsArr.length; i++) {
        let lineEnd = lineStart + txtsArr[i].length + 1;
        if (lineStart <= cursorEnd && cursorEnd < lineEnd) {
            const rowEnd = i + 1;
            const draggedLines = rowEnd - rowStart + 1;
            return draggedLines;
        } else {
            lineStart = lineEnd;
        }
    }
}

function exportData() {
   const strings = getTextArr();
   refreshDialogs(strings);
//    let myData = {}
//    for(let i = 0; i < dialogObjects.length; i++) {
//        myData[dialogObjects[i].row] = {};
//        myData[dialogObjects[i].row]['action'] = dialogObjects[i].action;
//        myData[dialogObjects[i].row]['script'] = dialogObjects[i].script;
//    }
//    return myData;
    const data = dialogObjects;
    const fileName = 'your_scripts';
    const exportType = 'json';
    exportFromJSON({data, fileName, exportType});
}

function deleteAll() {
    // delete localStorage and textContent on the txtarea
    // textarea is in the form so must use value, not textContent
    scriptInput.value = "";
    localStorage.removeItem(SCR_LS);
    const action = document.querySelector(`.${SELECTED}`).dataset.type;
    const dialogObject = {
        row: 1,
        action: action,
        script: ""
    };
    dialogObjects = [];
    dialogObjects.push(dialogObject);
    console.log(dialogObjects);
}

function saveScripts() {
    const strings = getTextArr();
    // const lastString = strings[strings.length -1]
    // dialogObjects[dialogObjects.length - 1].setScript(lastString);
    refreshDialogs(strings);
    localStorage.setItem(SCR_LS, JSON.stringify(dialogObjects));
    console.log("done");
}

function loadScripts(parsed) {
    let texts = [];
    for (let i = 0; i < parsed.length; i++) {
        const text = parsed[i].script;
        texts.push(text);
        // const dialogObject = new Dialog(parsed[i].action);
        // dialogObjects.splice(i, 0, dialogObject);
    }
    dialogObjects = parsed;
    console.log(dialogObjects);
    refreshDialogs(texts);
    // paint on the textarea
    scriptInput.value = texts.join('\n');
}

function handleEnter() {
    const strings = getTextArr();
    const action = document.querySelector(`.${SELECTED}`).dataset.type;
    console.log(strings);
    const row = getRow(scriptInput);
    // CONST DIALOGOBJECT SHOULD BE IN FOR LOOP
    for (let i = currentLine; i < row; i++) {
        // const dialogObject = new Dialog(action);
        const dialogObject = {
            row: 0,
            action: action,
            script: ""
        }
        dialogObjects.splice(i, 0, dialogObject);
        console.log(dialogObjects);
    }
    // dialogObjects.splice(row - 1, 0, dialogObject); //리스트의 맨 마지막에 추가하는 것
    refreshDialogs(strings);
    // stringsLength = strings.length;
    currentLine = row;
    stringsLength = strings.length;
}

// todo: bug fix > fixed
function handleBackSpace() {
    const strings = getTextArr();
    const row = getRow(scriptInput);
    const currentLength = strings.length;
    if (stringsLength !== currentLength) {
            dialogObjects.splice(row, stringsLength - currentLength);
            refreshDialogs(strings);
            console.log(dialogObjects);
    } else {
        dialogObjects[row - 1]['script'] = strings[row - 1];
        console.log(dialogObjects);
    }
    currentLine = row;
    stringsLength = currentLength;
}

// todo: modify setUpMode when I select row showing action
function setUpMode() {
    const row = getRow(scriptInput);
    modes[0].classList.remove(SELECTED);
    modes[1].classList.remove(SELECTED);
    this.classList.add(SELECTED);
    const action = document.querySelector(`.${SELECTED}`).dataset.type;
    // drag 구현하기
    if (scriptInput.selectionStart !== scriptInput.selectionEnd) {
        const draggedLines = getDraggedRows(scriptInput, row);
        for (let i = row - 1; i < row - 1 + draggedLines; i++) {
            dialogObjects[i]['action'] = action;
        }
    } else {
        //드래그 안했을때
        dialogObjects[row - 1]['action'] = action;
    }
    console.log(dialogObjects);
}

function init() {            
    // if objlist in localstorage;, get text from localStorages' object >>JSON.parse something
    // loadScripts();
    // else
    const parsedDialogObjects = JSON.parse(localStorage.getItem(SCR_LS));
    if (parsedDialogObjects !== null) {
        loadScripts(parsedDialogObjects);
    } else {
        console.log('no parsed dialog objects');
        // const dialogObject = new Dialog(action);
        const dialogObject = {
            row: 1,
            action: action,
            script: ""
        }
        dialogObjects.push(dialogObject);
    }
    
    modes.forEach( mode => {
        mode.addEventListener("click", setUpMode);
    });

    scriptInput.addEventListener("keyup", function(e) {
        if (e.keyCode === ENTER) {
            handleEnter();
        } else if (e.keyCode === BACKSPACE) {
            handleBackSpace();
        } else if (e.keyCode === UP_ARROW_KEY) {
            if (currentLine > 1) {
                currentLine -= 1;
                console.log(currentLine);
            }
        } else if (e.keyCode === DOWN_ARROW_KEY) {
            if (currentLine < dialogObjects.length) {
                currentLine += 1;
                console.log(currentLine);
            }
        }
    });

    scriptInput.addEventListener("click", function() {
        const row = getRow(scriptInput);
        currentLine = row;
        dragged = getDraggedRows(scriptInput, currentLine);
        console.log(row);
        getType(row);
    });

    scriptInput.addEventListener("dragend", function() {
        const strings = getTextArr();
        refreshDialogs(strings);
        dialogObjects = dialogObjects.filter(object => {
            return object.script !== undefined;
        });
        console.log(dialogObjects);
    });

    submitBtn.addEventListener("click", function() {
        saveScripts(); 
    });

    delBtn.addEventListener("click", () => {
        deleteAll();
    });

    exportBtn.addEventListener("click", () => {
        exportData();
    })
}

init();

// todo: make possible with a drag
// todo: handle checkbox. whenever number of lines get bigger, check box will be added number of lines