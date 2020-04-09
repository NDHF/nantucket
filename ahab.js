document.onreadystatechange = function () {
    function runProgram() {

        // QUALITY-OF-LIFE FUNCTIONS

        function getById(id) {
            return document.getElementById(id);
        }

        function getByClass(className) {
            return document.getElementsByClassName(className);
        }

        function getByTag(tagName) {
            return document.getElementsByTagName(tagName);
        }

        function getMenuIconById(id) {
            return getById(id).contentDocument.documentElement;
        }

        function listenFor(id, eventToListenFor, functionToRun, menuIcon) {
            if (menuIcon === undefined) {
                getById(id).addEventListener(eventToListenFor, functionToRun);
            } else if (menuIcon === "menuIcon") {
                getMenuIconById(id).addEventListener(
                    eventToListenFor, functionToRun
                );
            }
        }

        function playSound(nameOfAudioFile) {
            let audioSrc = ("https://www.ndhfilms.com/assets/audio/" +
                nameOfAudioFile + ".mp3");
            let sound = new Audio(audioSrc);
            sound.play();
        }

        function classToggle(idOrItem, class1, class2, byClass) {
            let element;
            if (byClass !== "byClass") {
                element = getById(idOrItem);
            } else if (byClass === "byClass") {
                element = idOrItem;
            }
            if (element.classList.contains(class1)) {
                element.classList.remove(class1);
                element.classList.add(class2);
            } else if (element.classList.contains(class2)) {
                element.classList.remove(class2);
                element.classList.add(class1);
            }
        }

        function generateTimeReadout() {
            audioInterface = document.getElementById(
                "audioElement"
            ).contentDocument.documentElement;
            if (audioInterfaceListenerAdded === false) {
                document.getElementById(
                    "audioElement"
                ).contentDocument.documentElement.addEventListener(
                    "click", checkWhatWasClicked
                );
                audioInterfaceListenerAdded = true;
            }
            if (audioInterface.getElementById(
                    "runningTimeText"
                ).childNodes.length > 0) {
                audioInterface.getElementById(
                    "runningTimeText"
                ).removeChild(audioInterface.getElementById(
                    "runningTimeText"
                ).childNodes[0]);
            }
            let currentPosition = "";
            let totalRunningTime = "";

            function parseAudioTime(numberToParse, mode) {
                let audioMinutes = parseInt(numberToParse / 60);
                if (audioMinutes < 10) {
                    audioMinutes = "0" + audioMinutes;
                }
                let audioSeconds = parseInt(numberToParse % 60);
                if (audioSeconds < 10) {
                    audioSeconds = "0" + audioSeconds;
                }
                let timeString = audioMinutes + ":" + audioSeconds;
                if (mode === "currentPosition") {
                    currentPosition = timeString;
                } else if (mode === "totalRunningTime") {
                    totalRunningTime = timeString;
                }
            }
            parseAudioTime(
                currentAudiobookSource.currentTime, "currentPosition"
            );
            parseAudioTime(
                currentAudiobookSource.duration, "totalRunningTime"
            );
            let finalTimeString = document.createTextNode(
                currentPosition + " / " + totalRunningTime
            );
            if (currentPosition.includes("NaN") ||
                (totalRunningTime.includes("NaN"))) {
                finalTimeString = document.createTextNode("LOADING...");
            }
            audioInterface.getElementById(
                "runningTimeText"
            ).appendChild(finalTimeString);
            // UPDATE SCRUBBER
            let audioCompletionPercentage = (
                currentAudiobookSource.currentTime /
                currentAudiobookSource.duration);
            let completionPercentageFixed = audioCompletionPercentage.toFixed(
                2
            );
            if (Number.isNaN(completionPercentageFixed)) {
                completionPercentageFixed = 0;
            }
            let newScrubberX = (300 * completionPercentageFixed) + 50;
            audioInterface.getElementById(
                "scrubberLine"
            ).x1.baseVal.value = newScrubberX;
            audioInterface.getElementById(
                "scrubberLine"
            ).x2.baseVal.value = newScrubberX;
            if (currentAudiobookSource.currentTime ===
                currentAudiobookSource.duration) {
                currentAudiobookSource.pause();
                audioInterface = document.getElementById(
                    "audioElement"
                ).contentDocument.documentElement;
                audioInterface.getElementById(
                    "playSymbol"
                ).style.fill = "rgb(0, 0, 0)";
                audioInterface.getElementById(
                    "pauseSymbol"
                ).style.stroke = "rgba(0, 0, 0, 0)";
                currentAudiobookSource.currentTime = 0;
                pauseAnimationAndSaveSpot();
            }
        }

        function toggleAudioDiv() {
            classToggle("audioDiv", "standby", "active");
            if (getById("audioDiv").classList.contains("active")) {
                if (currentAudiobookSource !== "") {
                    setTimeout(generateTimeReadout, 1000);
                }
            }
        }

        function toggleTableOfContents() {
            classToggle("tableOfContents", "tocStandby", "active");
            // MAKE SURE THE HEADER IS VISIBLE, IN CASE USER
            // SCROLLED THROUGH TABLE OF CONTENTS
            let toc = getById("tableOfContents");
            let tocOnStandby = toc.classList.contains("tocStandby");
            if (tocOnStandby) {
                toc.scrollTop = 0;
            }
        }

        function openIllustrationDiv(item, callMethod) {
            // "ill" means "illustration"
            item.addEventListener("click", function () {
                let illTargets = getByClass(callMethod);
                let illTargetArr = Array.from(illTargets);
                let illTargetIndex = illTargetArr.indexOf(item);
                let targetIllDiv = getByClass(
                    "illustrationDiv"
                )[illTargetIndex];
                classToggle(targetIllDiv, "standby", "active", "byClass");
            });
        }

        function closeIllustrationDiv(item) {
            item.addEventListener("click", function () {
                let illDivs = getByClass("illustrationDiv");
                let illDivsArray = Array.from(illDivs);
                let illDivIndex = illDivsArray.indexOf(item);
                let targetIllDiv = getByClass("illustrationDiv")[illDivIndex];
                classToggle(targetIllDiv, "active", "standby", "byClass");
            });
        }

        function turnWheels() {
            getMenuIconById(
                "cassetteAnimatedObject"
            ).children[2].children[0].beginElement();
            getMenuIconById(
                "cassetteAnimatedObject"
            ).children[3].children[0].beginElement();
        }

        function stopWheels() {
            getMenuIconById(
                "cassetteAnimatedObject"
            ).children[2].children[0].endElement();
            getMenuIconById(
                "cassetteAnimatedObject"
            ).children[3].children[0].endElement();
        }

        function starAnimation() {
            document.getElementById(
                "starObject"
            ).contentDocument.documentElement.children[
                1
            ].children[0].beginElement();
        }

        // Some SVG animations will not work on certain browsers.
        // Trying to play these animations will cause the program
        // to stop working.
        // This function will check for the relevant browsers before attempting
        // to play the animations.

        function checkForChromeInstaller(functionToRun) {
            let brow1 = (/MSIE 10/i.test(navigator.userAgent));
            let brow2 = (/MSIE 9/i.test(navigator.userAgent) ||
                (/rv:11.0/i.test(navigator.userAgent)));
            let brow3 = (/Edge\/\d./i.test(navigator.userAgent));
            if (!brow1) {
                if (!brow2) {
                    if (!brow3) {
                        if (functionToRun === "turnWheels") {
                            turnWheels();
                        } else if (functionToRun === "stopWheels") {
                            stopWheels();
                        } else if (functionToRun === "starAnimation") {
                            starAnimation();
                        }
                    }
                }
            }
        }

        // GLOBALS

        let pageKeyword = "";
        let nameOfFavoritesArray = "";
        let metaArray = Array.from(document.getElementsByTagName("META"));

        function loopThroughMetaArray() {
            function interiorLoop(item) {
                if (item.name === "keyword") {
                    pageKeyword = item.content;
                }
                if (item.name === "nameOfFavoritesArray") {
                    nameOfFavoritesArray = item.content;
                }
            }
            metaArray.forEach(interiorLoop);
        }
        loopThroughMetaArray();
        let currentAudiobookSource = "";
        let audioInterface = "";
        let audioInterfaceListenerAdded = false;

        // INITIALIZE DARK MODE

        localStorage.setItem(pageKeyword + "darkMode", "darkModeOff");

        // TOGGLE MENU

        function toggleMenu() {
            loopThroughMetaArray();
            classToggle("buttonContainer", "menuClosed", "menuOpen");
            let baseLocation = "https://www.ndhfilms.com/assets/images/";
            let menuIcon = "menuicon";
            let collapseIcon = "collapseicon";
            let menuIconSrc = getById("menuIconImg").src;
            if (menuIconSrc.includes(menuIcon)) {
                if (localStorage.getItem(pageKeyword +
                        "darkMode") === "darkModeOn") {
                    getById("menuIconImg").src = baseLocation + collapseIcon +
                        "_white.svg";
                } else {
                    getById("menuIconImg").src = baseLocation + collapseIcon +
                        "_black.svg";
                }
                if (window.innerWidth < window.innerHeight) {
                    getById("menuIconImg").style.transform = "rotate(180deg)";
                }
            } else if (menuIconSrc.includes(collapseIcon)) {
                if (localStorage.getItem(pageKeyword +
                        "darkMode") === "darkModeOn") {
                    getById("menuIconImg").src = baseLocation + menuIcon +
                        "_white.svg";
                } else {
                    getById("menuIconImg").src = baseLocation + menuIcon +
                        "_black.svg";
                }
            }
        }

        // TOGGLE TABLE OF CONTENTS SELECT ELEMENT

        function toggleTOCSelect() {
            // Check for desktop mode
            if ((window.innerWidth > 1201) && (window.innerWidth >
                    window.innerHeight)) {
                classToggle("tocSelect", "selectOpen", "selectClosed");
            } else {
                classToggle("tableOfContents", "tocStandby", "active");
            }
        }

        // DARK MODE TOGGLE

        function toggleDarkMode() {

            let darkModeGradient = "linear-gradient(to right, " +
                "rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.75), " +
                "rgba(255, 255, 255, 0))";
            let defaultGradient = "linear-gradient(to right," +
                " rgba(0, 0, 0, 0), " +
                "rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0))";

            function changeElementAppearances(
                backgroundColor, typefaceColor, linkColor, tocBackgroundColor, hrGradient
            ) {

                document.body.style.backgroundColor = backgroundColor;

                // ELEMENTS CHANGED BY ID

                if (getById("audioDiv") !== null) {
                    getById("audioDiv").style.backgroundColor = backgroundColor;
                }
                if (getById("tableOfContents") !== null) {
                    getById(
                        "tableOfContents"
                    ).style.backgroundColor = backgroundColor;
                }
                if (getById("audioSourceMenu") !== null) {
                    getById(
                        "audioSourceMenu"
                    ).style.backgroundColor = backgroundColor;
                    getById(
                        "audioSourceMenu"
                    ).style.color = typefaceColor;
                }
                getById(
                    "buttonContainer"
                ).style.backgroundColor = backgroundColor;
                if (getById("tableOfContents") !== null) {
                    getById("tableOfContents").style.color = typefaceColor;
                }
                // CHANGE TABLE OF CONTENTS SECTION
                if (getById("tableOfContentsSection") !== null) {
                    getById(
                        "tableOfContentsSection"
                    ).style.color = typefaceColor;
                }

                // ELEMENTS CHANGED BY TAG NAME

                function changeElementWithTagName(tagName) {
                    let tag = getByTag(tagName);
                    let tagArray = Array.from(tag);

                    function changeItemColor(item) {
                        let notTOCLink = (item.classList.contains(
                            "tocLink"
                        ) === false);
                        let notAudioCreditsLink = (item.id !==
                            "audioCreditsLink");
                        let notCurrentAudio = (item.id !== "currentAudio");
                        if ((tagName === "A") && notTOCLink) {
                            if (notAudioCreditsLink) {
                                item.style.color = linkColor;
                            }
                        } else {
                            if (notCurrentAudio) {
                                item.style.color = typefaceColor;

                            }
                        }
                    }
                    tagArray.forEach(changeItemColor);
                }

                let tagNameArray = ["HEADER", "P", "A", "BLOCKQUOTE"];
                tagNameArray.forEach(changeElementWithTagName);

                // ELEMENTS CHANGED BY CLASS NAME

                function changeAppearanceByClass(className) {
                    let elementClass = getByClass(className);
                    let elementClassArray = Array.from(elementClass);

                    function changeAppearance(item) {
                        if (className === "tocStandby") {
                            item.style.backgroundColor = tocBackgroundColor;
                        } else if (className === "style-two") {
                            item.style.backgroundImage = hrGradient;
                        } else if (className === "enlargeIcon") {
                            item.src = "https://www.ndhfilms.com/assets/" +
                                "images/enlargeicon_" + typefaceColor + ".svg";
                        } else {
                            item.style.color = typefaceColor;
                        }
                        if (className === "illustrationDiv") {
                            item.style.backgroundColor = backgroundColor;
                        }
                    }
                    elementClassArray.forEach(changeAppearance);
                }
                let classNameArray = ["illustrationDiv", "sectionHeader",
                    "illustrationCaption", "mainTextUL", "tocStandby",
                    "chapterHeading", "enlargeIcon", "style-two"
                ];
                classNameArray.forEach(changeAppearanceByClass);
                // CHANGE TABLE OF CONTENTS LIST
                if (getById("tocList") !== null) {
                    let tocLI = Array.from(document.getElementById(
                        "tocList"
                    ).children);
                    tocLI.forEach(function (item) {
                        item.style.color = typefaceColor;
                    });
                }

                // MENU ICONS

                // TABLE OF CONTENTS ICON
                if (getById("tocIconObject") !== null) {
                    getMenuIconById(
                        "tocIconObject"
                    ).children[0].style.stroke = typefaceColor;
                }
                // LIGHTBULB
                getMenuIconById(
                    "lightbulbObject"
                ).children[1].style.stroke = typefaceColor;
                // BOOKMARK
                getMenuIconById(
                    "bookmarkObject"
                ).children[2].style.stroke = typefaceColor;
                // CASSETTE
                if (getById("cassetteObject") !== null) {
                    getMenuIconById(
                        "cassetteObject"
                    ).style.stroke = typefaceColor;
                }
                // MONETIZATION ICON
                if (getById("monetizationIcon") !== null) {
                    getById("monetizationIcon").src = ("https://" +
                        "www.ndhfilms.com/assets/images/monetization_" +
                        typefaceColor + ".svg");
                }
                // MENU ICON
                function changeMenuIconColor() {
                    let menuIconBase = "https://www.ndhfilms.com/assets/images/";
                    let currentMenuIcon = getById("menuIconImg").src;
                    if (currentMenuIcon.includes("menuicon")) {
                        getById("menuIconImg").src = menuIconBase +
                            "menuicon_" + typefaceColor + ".svg";
                    } else if (currentMenuIcon.includes("collapseicon")) {
                        getById("menuIconImg").src = menuIconBase +
                            "collapseicon_" + typefaceColor + ".svg";
                    }
                }
                changeMenuIconColor();
            }
            loopThroughMetaArray("darkModeToggle");
            if (localStorage.getItem(pageKeyword +
                    "darkMode") === "darkModeOff") {
                changeElementAppearances(
                    "black", "white", "white", "black", darkModeGradient);
                localStorage.setItem(pageKeyword +
                    "darkMode", "darkModeOn");
            } else if (localStorage.getItem(pageKeyword +
                    "darkMode") === "darkModeOn") {
                localStorage.setItem(pageKeyword +
                    "darkMode", "darkModeOff");
                changeElementAppearances(
                    "seashell", "black", "blue", "seashell", defaultGradient);
            }
            playSound("lightswitch");
        }

        // ADD BOOKMARK

        function saveScrollPosition(setToZero, noSound) {
            if (setToZero === "setToZero") {
                localStorage.setItem((
                    pageKeyword + "scrollPosition"), 0);
            } else {
                localStorage.setItem((
                    pageKeyword + "scrollPosition"
                ), window.scrollY);
            }
            if (noSound !== "noSound") {
                playSound("pageFlip");
            }
        }

        // RETRIEVE BOOKMARK

        function retrieveAndSetScrollPosition() {
            let scrollPosition = localStorage.getItem(pageKeyword +
                "scrollPosition");
            if (scrollPosition === null) {
                saveScrollPosition("setToZero", "noSound");
                localStorage.getItem(pageKeyword + "scrollPosition");
            } else {
                window.scrollTo(0, scrollPosition);
            }
        }

        function pauseAnimationAndSaveSpot(closingDiv) {

            checkForChromeInstaller("stopWheels");

            function recordLastAudioPoint() {
                let lastPoint = currentAudiobookSource.currentTime;
                if (getById("audioSourceMenu") !== null) {
                    let currentSource = 0;
                    Array.from(getById(
                        "audioSourceList"
                    ).childNodes).forEach(function (item, index) {
                        if (item.innerHTML ===
                            getById("currentAudio").innerHTML
                        ) {
                            currentSource = index;
                        }
                    });
                    let lastPointOffset = 0;
                    let offsetAmount = 5;
                    if (lastPoint > offsetAmount) {
                        lastPointOffset = (lastPoint - offsetAmount);
                    }
                    let currentSourceAndTime = currentSource +
                        "|\\|" + lastPointOffset;
                    let objectName = (pageKeyword + "LastAudioPoint");
                    localStorage.setItem(objectName, currentSourceAndTime);
                }
            }
            recordLastAudioPoint();
            if (closingDiv !== "closingDiv") {
                playSound("stopTape");
            }
        }

        function playCassetteAnimation() {
            playSound("startTape");
            checkForChromeInstaller("turnWheels");
        }

        function checkWhatWasClicked(event) {
            audioInterface = document.getElementById(
                "audioElement"
            ).contentDocument.documentElement;
            let areaClicked = event.target.id;
            if (areaClicked === "playAndPauseOverlay") {
                if ((audioInterface.getElementById("playSymbol").style.fill ===
                        "rgb(0, 0, 0)") &&
                    (audioInterface.getElementById(
                            "pauseSymbol"
                        ).style.stroke ===
                        "rgba(0, 0, 0, 0)")) {
                    // Change appearance
                    audioInterface.getElementById(
                        "playSymbol"
                    ).style.fill = "rgba(0, 0, 0, 0)";
                    audioInterface.getElementById(
                        "pauseSymbol"
                    ).style.stroke = "black";
                    // Play audio
                    currentAudiobookSource.play();
                    playCassetteAnimation();
                    timeInterval = setInterval(generateTimeReadout, 500);
                } else {
                    // Change appearance
                    audioInterface.getElementById(
                        "playSymbol"
                    ).style.fill = "rgb(0, 0, 0)";
                    audioInterface.getElementById(
                        "pauseSymbol"
                    ).style.stroke = "rgba(0, 0, 0, 0)";
                    // Pause audio
                    currentAudiobookSource.pause();
                    pauseAnimationAndSaveSpot();
                    clearInterval(timeInterval);
                }
            } else if (areaClicked === "loudspeakerOverlay") {
                if (audioInterface.getElementById("mute-x").style.stroke ===
                    "rgba(255, 0, 0, 0)") {
                    audioInterface.getElementById(
                        "mute-x"
                    ).style.stroke = "rgba(255, 0, 0, 1)";
                    currentAudiobookSource.muted = true;
                } else {
                    audioInterface.getElementById(
                        "mute-x"
                    ).style.stroke = "rgba(255, 0, 0, 0)";
                    currentAudiobookSource.muted = false;
                }
            } else if (areaClicked === "scrubberOverlay") {
                let getRect = audioInterface.getElementById(
                    "scrubberOverlay"
                ).getBoundingClientRect();
                let x = event.clientX - getRect.left;
                if ((x >= 50) && (x <= 350)) {
                    audioInterface.getElementById(
                        "scrubberLine"
                    ).x1.baseVal.value = x;
                    audioInterface.getElementById(
                        "scrubberLine"
                    ).x2.baseVal.value = x;
                    let scrubberPercentage = (x - 50) / 300;
                    currentAudiobookSource.currentTime = (
                        currentAudiobookSource.duration * scrubberPercentage
                    );
                    generateTimeReadout();
                }
            }
        }

        // RETRIEVE AUDIO POSITION

        function retrieveAudioPosition() {
            let audioPos = localStorage.getItem(pageKeyword + "LastAudioPoint");
            if (audioPos !== null) {
                let audioPosArray = audioPos.split("|\\|");
                let sourceNumber = audioPosArray[0];
                if (sourceNumber === "") {
                    sourceNumber = 0;
                }
                let timecode = parseFloat(audioPosArray[1]);
                if (getById("audioSourceMenu") !== null) {
                    getById(
                        "currentAudio"
                    ).innerHTML = getById(
                        "audioSourceList"
                    ).childNodes[sourceNumber].innerHTML;
                    currentAudiobookSource = new Audio(getById("audioSource" +
                        "List").childNodes[sourceNumber].title);
                    currentAudiobookSource.currentTime = timecode;
                }
            } else {
                if (getById("audioSourceList") !== null) {
                    if (getById("audioSourceList").childNodes.length === 1) {
                        getById(
                            "currentAudio"
                        ).innerHTML = getById(
                            "audioSourceList"
                        ).childNodes[0].innerHTML;
                        currentAudiobookSource = new Audio(getById(
                            "audioSourceList").childNodes[0].title);
                        currentAudiobookSource.currentTime = 0;
                    }
                }
            }
        }

        // AUDIO LOGIC

        function audioPauseSaveAndToggle() {
            // getById("audioElement").pause();
            pauseAnimationAndSaveSpot("closingDiv");
            currentAudiobookSource.pause();
            audioInterface = document.getElementById(
                "audioElement"
            ).contentDocument.documentElement;
            audioInterface.getElementById(
                "playSymbol"
            ).style.fill = "rgb(0, 0, 0)";
            audioInterface.getElementById(
                "pauseSymbol"
            ).style.stroke = "rgba(0, 0, 0, 0)";
            toggleAudioDiv();
        }

        // SELECT ELEMENT TABLE OF CONTENTS

        function tocSelectLogic() {
            if (this.value !== "placeholder") {
                window.location = this.value;
                getById("firstOption").selected = "true";
            }
        }

        // FAVORITES

        function toggleFavorite(specifyRetrieveMode) {

            let favoritesArray = "";
            let favoriteIsSet = "";
            let favoriteNotSet = "";

            let favoritesArrayNOTinStorage = (localStorage.getItem(
                nameOfFavoritesArray
            ) === null);

            if (favoritesArrayNOTinStorage) {
                let favoritesArraySetup = JSON.stringify([]);
                localStorage.setItem(
                    nameOfFavoritesArray, favoritesArraySetup
                );
            } else {
                favoritesArray = JSON.parse(
                    localStorage.getItem(nameOfFavoritesArray)
                );
                favoriteIsSet = favoritesArray.includes(pageKeyword);
                favoriteNotSet = (!favoriteIsSet);
            }

            let goldRGBA = "rgba(255,215,0,1)";
            let goldRGBATransparent = "rgba(255,215,0,0)";

            function fillInStar() {
                checkForChromeInstaller("starAnimation");
                document.getElementById(
                    "starObject"
                ).contentDocument.documentElement.children[
                    1
                ].style.fill = goldRGBA;
            }
            if (specifyRetrieveMode === "retrieveMode") {
                if (favoriteIsSet) {
                    document.getElementById(
                        "starObject"
                    ).contentDocument.documentElement.children[
                        1
                    ].style.fill = goldRGBA;
                } else if (favoriteNotSet) {
                    document.getElementById(
                        "starObject"
                    ).contentDocument.documentElement.children[
                        1
                    ].style.fill = goldRGBATransparent;
                }
            } else {
                if (favoriteNotSet) {
                    favoritesArray.push(pageKeyword);
                    localStorage.setItem(
                        nameOfFavoritesArray, JSON.stringify(favoritesArray)
                    );
                    fillInStar();
                    playSound("favorite");
                } else if (favoriteIsSet) {
                    favoritesArray.splice(
                        favoritesArray.indexOf(pageKeyword)
                    );
                    localStorage.setItem(
                        nameOfFavoritesArray, JSON.stringify(favoritesArray)
                    );
                    getMenuIconById("starObject").children[1].style.dur = "1s";
                    getMenuIconById(
                        "starObject"
                    ).children[1].style.fill = goldRGBATransparent;
                }
            }
        }

        function loadAudioSource(event) {
            let listItemWasClicked = (event.target.tagName === "LI");
            if (listItemWasClicked) {
                currentAudiobookSource = new Audio(event.target.title);
                setTimeout(generateTimeReadout, 500);
                currentAudiobookSource.muted = true;
                currentAudiobookSource.play();
                setTimeout(function () {
                    currentAudiobookSource.pause();
                    currentAudiobookSource.muted = false;
                }, 100);
                getById("currentAudio").innerHTML = event.target.innerHTML;
            }
        }

        // EVENT LISTENERS

        // MENU

        listenFor("menuIconDiv", "click", toggleMenu);

        // DARK MODE
        if (getById("lightbulbObject").contentDocument !== null) {
            listenFor("lightbulbObject", "click", toggleDarkMode, "menuIcon");
        }

        // BOOKMARKING
        if (getById("bookmarkObject").contentDocument !== null) {
            listenFor(
                "bookmarkObject", "click", saveScrollPosition, "menuIcon"
            );
        }

        // AUDIO DIV
        if (getById("cassetteObject") !== null) {
            if (getById("cassetteObject").contentDocument !== null) {
                listenFor(
                    "cassetteObject", "click", toggleAudioDiv, "menuIcon"
                );
            }
        }

        if (getById("audioCreditsLink") !== null) {
            listenFor("audioCreditsLink", "click", audioPauseSaveAndToggle);
        }
        document.addEventListener("click", function (event) {
            if (event.target.id === "audioCloseButton") {
                audioPauseSaveAndToggle();
            }
        });

        function toggleAudioSourceMenu() {
            if (getById(
                    "audioSourceMenu"
                ).classList.contains("active")) {
                if (currentAudiobookSource !== "") {
                    currentAudiobookSource.pause();
                }
                audioInterface = document.getElementById(
                    "audioElement"
                ).contentDocument.documentElement;
                audioInterface.getElementById(
                    "playSymbol"
                ).style.fill = "rgb(0, 0, 0)";
                audioInterface.getElementById(
                    "pauseSymbol"
                ).style.stroke = "rgba(0, 0, 0, 0)";
                loadAudioSource(event);
                pauseAnimationAndSaveSpot("closingDiv");
            }
            classToggle(
                "audioSourceMenu", "audioSourceMenuStandby", "active");
        }
        if (getById("audioSourceMenu") !== null) {
            listenFor("audioSourceMenu", "click", toggleAudioSourceMenu);
            if (getById("audioSourceList").childNodes.length > 1) {
                listenFor("currentAudio", "click", toggleAudioSourceMenu);
            }
        }

        // NEW AUDIO INTERFACE

        // TABLE OF CONTENTS
        if (getById("tableOfContents") !== null) {
            listenFor("tableOfContents", "click", toggleTableOfContents);
        }

        // SELECT ELEMENT
        // TABLE OF CONTENTS SELECT TOGGLE
        if (getById("tocIconObject") !== null) {
            if (getById("tocIconObject").contentDocument !== null) {
                listenFor(
                    "tocIconObject", "click", toggleTOCSelect, "menuIcon"
                );
            }
            if (getById("tocSelect") !== null) {
                listenFor("tocSelect", "change", tocSelectLogic);
            }
        }

        // ILLUSTRATION DIV
        function addIllustrationDivListeners(callMethod) {
            Array.from(getByClass(callMethod)).forEach(function (item) {
                openIllustrationDiv(item, callMethod);
            });
        }
        addIllustrationDivListeners("illustrationTarget");
        addIllustrationDivListeners("enlargeIcon");
        Array.from(document.getElementsByClassName(
            "illustrationDiv"
        )).forEach(closeIllustrationDiv);

        // FAVORITES
        if (getById("starObject") !== null) {
            listenFor("starObject", "click", toggleFavorite, "menuIcon");
        }

        function retrieveData() {
            retrieveAndSetScrollPosition();
            if (getById("starObject") !== null) {
                toggleFavorite("retrieveMode");
            }
            retrieveAudioPosition();
        }
        setTimeout(retrieveData, 50);
    }
    if (document.readyState === "complete") {
        runProgram();
    }
};