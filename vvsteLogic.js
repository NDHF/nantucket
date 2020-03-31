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

    function printFileNameArray(lastFileFailedToOpen) {
        getById("fileNameContainer").innerHTML = "";
        let lastFileOpenedHeader = document.createElement("H3");
        let lfoHeaderText = document.createTextNode("Last File Opened:");
        lastFileOpenedHeader.appendChild(lfoHeaderText);
        getById("fileNameContainer").appendChild(lastFileOpenedHeader);
        let lastFileOpenedUL = document.createElement("UL");
        let lastFileOpenedLI = document.createElement("LI");
        let lfoText = gfs("lastFileOpened");
        if (lfoText === null) {
           lfoText = "Nothing has been opened yet";
        }
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
            promptMessage = "Name of new file:";
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
            console.log("here");
            if ((mode === "save") || (mode === "saveAs") ||
                (mode === "new")) {
                if (textName === null) {
                    alert("No filename specified");
                } else {
                    fileNameArrayParsed.push(textName);
                    let backToStringSave = JSON.stringify(fileNameArrayParsed);
                    sts("fileNameArray", backToStringSave);
                    if (mode === "new") {
                        getById("textarea").value = "";
                    }
                    sts(textName, getById("textarea").value);
                    sts("lastFileOpened", textName);
                }
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

    function loadLastFile() {
        let lastFileOpened = gfs("lastFileOpened");
        if ((lastFileOpened !== null) && (lastFileOpened !== "null")) {
            masterStorageAccess("open", lastFileOpened);
        }
    }
    loadLastFile();

    function tryOpening(content) {
        let specs = "location=no,scrollbars=no,menubar=no,toolbar=no";
        let w = window.open("", "", specs);
        w.document.open();
        w.document.write("<html><body onload='print()'>");
        w.document.write(content);
        w.document.write("</body></html>");
        w.document.close();
    }

    function printTextArea() {
        tryOpening(getById("textarea").value);
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

    function storageCapacityCheck() {
        let fileNameArrForLoop = gfs("fileNameArray");
        let fnaParsed = JSON.parse(fileNameArrForLoop);
        let totalNumberOfCharacters = 0;

        function getTotalFileSizeInStorage(fnaItem) {
            let fnaItemStr = JSON.stringify(gfs(fnaItem));
            let fnaItemLength = fnaItemStr.length;
            totalNumberOfCharacters = totalNumberOfCharacters + (fnaItemLength);
        }
        if (Array.isArray(fnaParsed)) {
            fnaParsed.forEach(getTotalFileSizeInStorage);
        }
        let totalSizeOfLocalStorage = 5242880;
        let spaceUsedSoFar = totalNumberOfCharacters / totalSizeOfLocalStorage;
        let spaceUsedTimes100 = spaceUsedSoFar * 100;
        let spaceUsedAsPercent = spaceUsedTimes100.toFixed(3);
        let storageMessage = spaceUsedAsPercent + "% of storage used.";
        getById("storageSpaceReadout").innerHTML = storageMessage;
    }

    function wordCount() {
        let contentInTextArea = JSON.stringify(getById("textarea").value);
        let contentToArray = contentInTextArea.split("\n");
        let wordCounter = 0;

        function addUpWords(contentToArrayItem) {
            if ((contentToArrayItem.slice(0, 2) !== "**") &&
                (contentToArrayItem.slice(0, 2) !== "!!") &&
                (contentToArrayItem.slice(0, 2) !== "@@") &&
                (contentToArrayItem.slice(0, 2) !== "//") &&
                (contentToArrayItem !== "")) {
                let wordsInItem = contentToArrayItem.split(" ").length;
                wordCounter += wordsInItem;
            }
        }
        contentToArray.forEach(addUpWords);
        alert("Words in text area: approximately " + wordCounter);
    }

    setInterval(storageCapacityCheck, 10000);

    let keylogArray = [];

    function createDownloadableFile(filename, fileContent) {
        let typeText = "text/plain;charset=UTF-8";
        let fileText = new Blob([fileContent], {
            type: typeText
        });
        let url = URL.createObjectURL(fileText);

        // YYYYMMDD
        let currentDate = "";

        function createDateString() {
            let date = new Date();
            let year = date.getFullYear() + "-";
            let month = (date.getMonth() + 1);
            if (month < 10) {
                month = "0" + month + "-";
            }
            let dayOfMonth = date.getDate();
            if (dayOfMonth < 10) {
                dayOfMonth = "0" + dayOfMonth;
            }
            currentDate = currentDate.concat(year, month, dayOfMonth);
        }
        createDateString();

        let link = document.createElement("A");
        let fullFilename = filename + "_" + currentDate + ".txt";
        link.download = fullFilename;
        link.href = url;
        link.textContent = fullFilename;
        link.click();
        getById("inputOutputContainer").appendChild(link);
        getById("inputOutputContainer").innerHTML = "";
    }

    function toggleCommands() {
        if (getById("commandContainer").classList.contains("commandStandby")) {
            getById("commandContainer").classList.remove("commandStandby");
            getById("commandContainer").classList.add("commandActive");
        } else if (
            getById("commandContainer").classList.contains("commandActive")
            ) {
            getById("commandContainer").classList.remove("commandActive");
            getById("commandContainer").classList.add("commandStandby");
        } else {
            alert("Something has gone wrong with toggleCommands");
        }
    }

    function generateEmail() {
        let content = JSON.stringify(getById("textarea").value);
        if (content.includes("@#@") === false) {
            alert("Formatting error. Please review email syntax");
            return;
        }
        if (content.charAt(0) === "\"") {
            content = content.slice(1);
        }
        if (content.charAt(content.length - 1) === "\"") {
            content = content.slice(0, content.length - 1);
        }
        let contentSplit = content.split("\\n");
        let i;
        let emailInfo = {
            to: "",
            cc: "",
            bcc: "",
            subject: "",
            startPoint: 0
        };
        for (i = 0; i < contentSplit.length; i += 1) {
            if (contentSplit[i].slice(0, 3) === "TO:") {
                emailInfo.to = contentSplit[i].slice(3);
            } else if (contentSplit[i].slice(0, 3) === "CC:") {
                emailInfo.cc = contentSplit[i].slice(3);
            } else if (contentSplit[i].slice(0, 4) === "BCC:") {
                emailInfo.bcc = contentSplit[i].slice(4);
            } else if (contentSplit[i].slice(0, 8) === "SUBJECT:") {
                emailInfo.subject = contentSplit[i].slice(8);
            } else if (contentSplit[i].slice(0, 3) === "@#@") {
                emailInfo.startPoint = i + 1;
            }
        }
        let emailContents = "mailto:";
        emailContents = emailContents.concat(emailInfo.to, "?");
        function checkIfYouShouldAddAmpersand() {
            if (emailContents.charAt(emailContents.length - 1) !== "?") {
                emailContents = emailContents.concat("&");
            }
        }
        if (emailInfo.cc !== "") {
            checkIfYouShouldAddAmpersand();
            emailContents = emailContents.concat("cc=", emailInfo.cc);
        }
        if (emailInfo.bcc !== "") {
            checkIfYouShouldAddAmpersand();
            emailContents = emailContents.concat("bcc=", emailInfo.bcc);
        }
        if (emailInfo.subject !== "") {
            checkIfYouShouldAddAmpersand();
            emailContents = emailContents.concat("subject=", emailInfo.subject);
        }
        let emailBody = contentSplit.slice(emailInfo.startPoint);
        if (emailBody[0] === "") {
            emailBody.shift();
        }
        let contentJoined = emailBody.join("%0D%0A");
        let quotesManaged = contentJoined.replace("\"", "\'");
        emailContents = emailContents.concat("&body=", quotesManaged);
        let emailLink = document.createElement("A");
        emailLink.target = "_blank";
        emailLink.href = emailContents;
        emailLink.click();
    }

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
        } else if ((alt) && (currentKey === "x")) {
            createDownloadableFile(
                gfs("lastFileOpened"), getById("textarea").value
                );
        } else if ((alt) && (currentKey === "g")) {
            runGam();
        } else if ((alt) && (currentKey === "w")) {
            wordCount();
        } else if ((alt) && (currentKey === "c")) {
            toggleCommands();
        } else if ((alt) && (currentKey === "m")) {
            generateEmail();
        }
        if (keylogArray.length === 1) {
            keylogArray.shift();
        }
        keylogArray.push(event.key);
    }
    document.addEventListener("keydown", masterKeyboardListener);
});