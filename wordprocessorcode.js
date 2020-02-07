console.log(
    "A very, very simple word processor. \n" +
    "In-Development. \n" +
    "\n" +
    "COMMANDS: \n" +
    "\n" +
    "PRINT:   Alt + p \n" +
    "SAVE:    Alt + s \n" +
    "SAVE AS: Alt + a \n" +
    "NEW:     Alt + n \n" +
    "OPEN:    Alt + o \n" +
    "DELETE:  Alt + d"
);

document.addEventListener("DOMContentLoaded", function () {

    function getById(id) {
        return document.getElementById(id);
    }

    function whenClicked(id, functionToRun) {
        return getById(id).addEventListener("click", functionToRun);
    }

    function sts(key, property) {
        return localStorage.setItem(key, property);
    }

    function gfs(key) {
        return localStorage.getItem(key);
    }

    function rfs(key) {
        return localStorage.removeItem(key);
    }

    function setUpFileNameArray() {
        let fileNameArrayInStorage = gfs("fileNameArray");
        let noFileNameArrayInStorage = (fileNameArrayInStorage === null);
        if (noFileNameArrayInStorage) {
            let fileNameArray = [];
            let fileNameToString = JSON.stringify(fileNameArray);
            sts("fileNameArray", fileNameToString);
        } else {
            printFileNameArray();
        }
    }

    setUpFileNameArray();

    function printFileNameArray(lastFileFailedToOpen) {
        getById("fileNameContainer").innerHTML = "";
        let lastFileOpenedHeader = document.createElement("H3");
        let lfoHeaderText = document.createTextNode("Last File Opened:");
        lastFileOpenedHeader.appendChild(lfoHeaderText);
        getById("fileNameContainer").appendChild(lastFileOpenedHeader);
        let lastFileOpenedUL = document.createElement("UL");
        let lastFileOpenedLI = document.createElement("LI");
        lfoText = gfs("lastFileOpened");
        if (lastFileFailedToOpen === true) {
            lfoText = lfoText.concat(" (Not found)");
        } 
        let lfoLIText = document.createTextNode(lfoText);
        lastFileOpenedLI.appendChild(lfoLIText);
        lastFileOpenedUL.appendChild(lastFileOpenedLI);
        getById("fileNameContainer").appendChild(lastFileOpenedUL);
        let fileNameArrayHeader = document.createElement("H3");
        let fileNameArrayHeaderText = document.createTextNode("Files:");
        fileNameArrayHeader.appendChild(fileNameArrayHeaderText);
        getById("fileNameContainer").appendChild(fileNameArrayHeader);
        let fileNameUL = document.createElement("UL");

        function printArrayItem(item) {
            let fileNameLI = document.createElement("LI");
            let fileNameLIText = document.createTextNode(item);
            fileNameLI.appendChild(fileNameLIText);
            fileNameUL.appendChild(fileNameLI);
        }
        let fileNameArray = JSON.parse(gfs("fileNameArray"));
        fileNameArray.forEach(printArrayItem);
        getById("fileNameContainer").appendChild(fileNameUL);
    }

    function loadLastFile() {
        let lastFileOpened = gfs("lastFileOpened");
        if ((lastFileOpened !== null) && (lastFileOpened !== "null")) {
            masterStorageAccess("open", lastFileOpened);
        }
    }
    loadLastFile();

    function tryOpening(content) {
        let specs = 'location=no,scrollbars=no,menubar=no,toolbar=no';
        let w = window.open('', '', specs);
        w.document.open();
        w.document.write('<html><body onload="print()">')
        w.document.write(content);
        w.document.write('</body></html>');
        w.document.close();
    }

    function printTextArea() {
        tryOpening(getById("textarea").value);
    }

    function masterStorageAccess(mode, lastFile) {
        let lastFileFailedToOpen = false;
        let promptMessage = "placeholder";
        if ((mode === "save") || (mode === "saveAs")) {
            promptMessage = "Save file as:";
        } else if (mode === "open") {
            promptMessage = "Please enter file name:";
        } else if (mode === "delete") {
            promptMessage = "Name of file to delete?";
        } else if (mode === "new") {
            promptMessage = "Name of new file:"
        } else {
            console.error("invalid input");
        }
        let textName = "";
        if (lastFile === undefined) {
            textName = prompt(promptMessage);
        } else {
            textName = lastFile;
        }
        let fileNameArrayPulled = gfs("fileNameArray");
        let fileNameArrayParsed = JSON.parse(fileNameArrayPulled);
        let fileNameExistsInArray = fileNameArrayParsed.includes(textName);
        let proceedWithOverwrite = "";
        let overwriteMessage = "A file with that name " +
        "already exists. Do you want to proceed with overwrite?";
        if (fileNameExistsInArray) {
            if (mode === "save") {
                sts(textName, getById("textarea").value);
            } else if (mode === "saveAs") {
                proceedWithOverwrite = confirm(overwriteMessage);
                if (proceedWithOverwrite === true) {
                    getById("textarea").value = "";
                    sts(textName, getById("textarea").value);
                } else {
                    alert("Cancelled");
                }
            } else if (mode === "open") {
                let fileToOpen = gfs(textName);
                getById("textarea").value = fileToOpen;
                sts("lastFileOpened", textName);
            } else if (mode === "delete") {
                let deleteConfirm = confirm("Are you sure you want to " +
                    "delete '" + textName + "'?");
                if (deleteConfirm === true) {
                    let ind = fileNameArrayParsed.indexOf(textName);
                    fileNameArrayParsed.splice(ind, 1);
                    let backToStringDel = JSON.stringify(fileNameArrayParsed);
                    rfs(textName);
                    sts("fileNameArray", backToStringDel);
                }
            } else if (mode === "new") {
                proceedWithOverwrite = confirm(overwriteMessage);
                if (proceedWithOverwrite === true) {
                    sts(textName, getById("textarea").value);
                    sts("lastFileOpened", textName);
                    printFileNameArray();
                } else {
                    alert("Cancelled");
                }
            }
        } else {
            if ((mode === "save") || (mode === "saveAs") ||
                (mode === "new")) {
                fileNameArrayParsed.push(textName);
                let backToStringSave = JSON.stringify(fileNameArrayParsed);
                sts("fileNameArray", backToStringSave);
                if (mode === "new") {
                    getById("textarea").value = "";
                }
                sts(textName, getById("textarea").value);
                sts("lastFileOpened", textName);
            } else if (mode === "open") {
                if (lastFile === undefined) {
                    alert("No file found with that name.");
                } else {
                    lastFileFailedToOpen = true;
                    alert("The attempt to open most-recent file " +
                        lastFile + " was unsuccessful.");
                }
            } else if (mode === "delete") {
                alert("No file found with that name");
            }
        }
        printFileNameArray(lastFileFailedToOpen);
    }

    function saveText() {
        let lastFileOpened = gfs("lastFileOpened");
        if ((lastFileOpened !== null) && (lastFileOpened !== "null")) {
            masterStorageAccess("save", gfs("lastFileOpened"));
        } else {
            masterStorageAccess("save");
        }
    }

    function saveAs() {
        masterStorageAccess("saveAs");
    }

    function openFile() {
        masterStorageAccess("open");
    }

    function deleteFile() {
        masterStorageAccess("delete");
    }

    function newFile() {
        masterStorageAccess("new");
    }

    whenClicked("printButton", printTextArea);
    whenClicked("saveButton", saveText);
    whenClicked("saveAsButton", saveAs);
    whenClicked("deleteButton", deleteFile);
    whenClicked("openButton", openFile);

    let keylogArray = [];

    function masterKeyboardListener(event) {
        let currentKey = event.key;
        let alt = (keylogArray[0] === "Alt");
        if ((alt) && (currentKey === "a")) {
            saveAs();
        } else if ((alt) && (currentKey === "p")) {
            printTextArea();
        } else if ((alt) && (currentKey === "s")) {
            saveText();
        } else if ((alt) && (currentKey === "o")) {
            openFile();
        } else if ((alt) && (currentKey === "d")) {
            deleteFile();
        } else if ((alt) && (currentKey === "n")) {
            newFile();
        }
        if (keylogArray.length === 1) {
            keylogArray.shift();
        }
        keylogArray.push(event.key);
    }
    document.addEventListener("keydown", masterKeyboardListener);
});