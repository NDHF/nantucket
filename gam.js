function runGam() {

    // QUALITY-OF-LIFE FUNCTIONS START

    function getById(id) {
        return document.getElementById(id);
    }

    function newEl(elementName) {
        return document.createElement(elementName);
    }

    function ctn(text) {
        return document.createTextNode(text);
    }

    function addACloseButton(nodeToAppendTo, idForCloseButton) {
        let closeButton = newEl("IMG");
        if (idForCloseButton !== undefined) {
            closeButton.id = idForCloseButton;
        }
        closeButton.alt = "Click or tap to close";
        closeButton.classList.add("closeButton");
        closeButton.src = "http://www.ndhfilms.com/assets/images/" +
            "closeButton.svg";
        nodeToAppendTo.appendChild(closeButton);
    }

    // QUALITY-OF-LIFE FUNCTIONS END

    let input = getById("textarea").value;
    let inputToString = JSON.stringify(input);

    if (inputToString.charAt(0) === "\"") {
        inputToString = inputToString.slice(1);
    }
    if (inputToString.charAt(inputToString.length - 1)) {
        inputToString = inputToString.slice(0, inputToString.length - 1);
    }

    let inputArray = inputToString.split("\\n");

    // Remove all comments

    let textMetadata = {
        title: "",
        subtitle: "",
        credit: "",
        author: "",
        illustrator: "",
        coverart: "",
        coverartdesc: "",
        coverlink: "",
        kywd: "",
        copyright: "",
        location: "",
        date: "",
        lang: "",
        icon: "",
        desc: "",
        keywords: "",
        audio: "",
        monetizelink: "",
        monetizeicon: "",
        small: "",
        stylesheet: [],
        menu: "",
        favorites: ""
    };

    let illustrationArray = [];
    let chapterArray = [];
    let audioSourceArray = [];
    let monetizationObject = "";
    let htmlGrabberRunning = false;
    let rawHTMLStorage = [];
    let footnoteCounter = 0;
    let footnoteSection = newEl("SECTION");
    footnoteSection.id = "footnoteSection";
    let firstProperParagraph = true;

    function removeThingsAndGatherMetadata() {

        let i;

        function loopKeyIndexArray(kiaItem) {
            if (inputArray[i].slice(0, (kiaItem.length + 2)) ===
                ("!!" + kiaItem)) {
                if (kiaItem.toLowerCase() === "small") {
                    textMetadata.small = "small";
                } else if (kiaItem.toLowerCase() === "stylesheet") {
                    textMetadata.stylesheet.push(
                        inputArray[i].slice(0, 12).replace(" ", "_")
                    );
                } else {
                    textMetadata[kiaItem.toLowerCase()] = inputArray[i].slice(
                        kiaItem.length + 3
                    );
                }
            }
        }
        for (i = 0; i < inputArray.length; i += 1) {
            if ((inputArray[i].slice(0, 2) === "//") ||
                (inputArray[i] === "")) {
                inputArray.splice(i, 1);
                if (i >= 2) {
                    i -= 2;
                } else {
                    i = 0;
                }
            } else if (inputArray[i].slice(0, 2) === "!!") {
                let keyIndexArray = [
                    "TITLE", "SUBTITLE", "CREDIT", "AUTHOR",
                    "ILLUSTRATOR", "COVERART", "COVERARTDESC",
                    "KYWD", "COPYRIGHT", "LOCATION", "DATE",
                    "LANG", "ICON", "DESC", "KEYWORDS", "AUDIO",
                    "MONETIZELINK", "MONETIZEICON", "SMALL",
                    "STYLESHEET", "MENU", "FAVORITES"
                ];
                keyIndexArray.forEach(loopKeyIndexArray);
                inputArray.splice(i, 1);
                if (i >= 0) {
                    i -= 1;
                } else if (i === 0) {
                    i = 0;
                }
            }
        }
    }
    removeThingsAndGatherMetadata();

    // CHECK FOR MONETIZATION

    if (((textMetadata.monetizelink !== "") &&
            (textMetadata.monetizeicon === "")) ||
        ((textMetadata.monetizelink === "") &&
            (textMetadata.monetizeicon !== ""))) {
        alert("Missing information for monetization.");
    } else if ((textMetadata.monetizelink !== "") &&
        (textMetadata.monetizeicon !== "")) {
        monetizationObject = "<div id='monetizationDiv' class='buttons'>" +
            "<a href='[monetizationLink]'><img id='monetizationIcon'" +
            "src='[monetizationIcon]' /></a></div>";
        monetizationObject = monetizationObject.replace(
            "[monetizationLink]", textMetadata.monetizelink
        );
        monetizationObject = monetizationObject.replace(
            "[monetizationIcon]", textMetadata.monetizeicon
        );
    }

    function replaceAsterisks(item, index) {
        // Replace asterisks with hr tag

        if (item.length === 4) {
            inputArray[index] = item.replace("****", "[break]");
        } else {
            if (item.includes("**")) {
                inputArray[index] = item.replace(/\*\*(.*?)\*\*/gm, "<b>$1</b>");
            }
            if (item.includes("*")) {
                inputArray[index] = inputArray[index].replace(/\*(.*?)\*/gm, "<i>$1</i>");
            }
            function checkForLinks(whatToLookFor) {
                if (inputArray[index].includes(whatToLookFor)) {
                    let itemI;
                    let pLinkStart = inputArray[index].indexOf(
                        whatToLookFor
                    ) + 2;
                    let pLinkEnd = "";
                    if (whatToLookFor === "{{") {
                        pLinkEnd = inputArray[index].indexOf("}}");
                    } else if (whatToLookFor === "[[") {
                        pLinkEnd = inputArray[index].indexOf("]]");
                    }
                    let pLinkString = "";
                    for (itemI = pLinkStart; itemI < pLinkEnd; itemI += 1) {
                        pLinkString = pLinkString.concat(
                            inputArray[index][itemI]
                        );
                    }
                    let pLinkSplit = pLinkString.split("||");
                    let pLinkProper = "";
                    if (whatToLookFor === "{{") {
                        let pLinkHref = pLinkSplit[0];
                        let pLinkText = pLinkSplit[1];
                        let pLinkID = "";
                        if (pLinkSplit[2] !== undefined) {
                            pLinkID = pLinkSplit[2].replace(" ", "_");
                        }
                        let pLinkDownload = "";
                        if (pLinkSplit[4] !== undefined) {
                            pLinkDownload = "download";
                        }
                        pLinkProper = "<a target='_blank' [download] id='" +
                            pLinkID + "' href='" + pLinkHref + "'>" +
                            pLinkText + "</a>";
                        if (pLinkID === "") {
                            pLinkProper = pLinkProper.replace("id=''", "");
                        }
                        pLinkProper = pLinkProper.replace(
                            "[download]", pLinkDownload
                        );
                        if ((pLinkDownload !== "") ||
                            (pLinkHref.charAt(0) === "#")) {
                            pLinkProper = pLinkProper.replace(
                                "target='_blank'", ""
                            );
                        }
                    } else if (whatToLookFor === "[[") {
                        let spanText = pLinkSplit[0];
                        let spanID = pLinkSplit[1].replace(" ", "_");
                        pLinkProper = "<span id='" + spanID + "'>" + spanText +
                            "</span>";
                    }
                    if (whatToLookFor === "{{") {
                        inputArray[index] = inputArray[
                            index
                        ].replace(/\{\{([^}]+)\}\}/, pLinkProper);
                    } else if (whatToLookFor === "[[") {
                        inputArray[index] = inputArray[
                            index
                        ].replace(/\[\[([^}]+)\]\]/, pLinkProper);
                    }
                    checkForLinks(whatToLookFor);
                }
            }
            checkForLinks("{{");
            checkForLinks("[[");
        }
    }
    inputArray.forEach(replaceAsterisks);

    let doctypeHTML = "<!DOCTYPE html>";
    let html = newEl("HTML");
    let startHTMLTag = "<html lang='[lang]'>";
    if (textMetadata.lang !== "") {
        startHTMLTag = startHTMLTag.replace(
            "[lang]", textMetadata.lang.toLowerCase()
        );
    } else {
        startHTMLTag = startHTMLTag.replace("[lang]", "en");
    }
    let endHTMLTag = "</html>";
    let body = newEl("BODY");

    function createHead() {
        let head = newEl("HEAD");
        let metaCharsetTag = newEl("META");
        metaCharsetTag.httpEquiv = "content-type";
        metaCharsetTag.content = "text/html; charset=utf-8";
        head.appendChild(metaCharsetTag);
        let headTitle = newEl("TITLE");
        let headTitleText = textMetadata.title + " " +
            textMetadata.credit + " " + textMetadata.author;
        if (textMetadata.credit === "") {
            headTitleText = textMetadata.title + " by " + textMetadata.author;
        }
        if (inputArray.length === 0) {
            headTitleText = "Empty E-Book";
        }
        headTitle.text = headTitleText;
        head.appendChild(headTitle);
        // Add author meta tag
        if (textMetadata.author !== "") {
            let authorMetaTag = newEl("META");
            authorMetaTag.name = "author";
            authorMetaTag.content = textMetadata.author;
            head.appendChild(authorMetaTag);
        }
        // Add description meta tag
        if (textMetadata.desc !== "") {
            let descriptionMetaTag = newEl("META");
            descriptionMetaTag.name = "description";
            descriptionMetaTag.content = textMetadata.desc;
            head.appendChild(descriptionMetaTag);
        }
        // Add keywords meta tag
        if (textMetadata.keywords !== "") {
            let keywordsMetaTag = newEl("META");
            keywordsMetaTag.name = "keywords";
            keywordsMetaTag.content = textMetadata.keywords;
            head.appendChild(keywordsMetaTag);
        }
        // Add theme-color meta tag
        let themeColorMetaTag = newEl("META");
        themeColorMetaTag.name = "theme-color";
        themeColorMetaTag.content = "#fff5ee"; // seashell color
        head.appendChild(themeColorMetaTag);
        // ADD FAVORITES INFORMATION
        if ((textMetadata.kywd === "") && (textMetadata.favorites !== "")) {
            alert("WARNING: Designated a favorites-array," +
                "but no keyword for e-book");
        } else if ((textMetadata.kywd !== "") &&
            (textMetadata.favorites === "")) {
            alert("WARNING: Designated a keyword for e-book," +
                "but no favorites-array");
        } else if ((textMetadata.favorites !== "") &&
            (textMetadata.kywd !== "")) {
            // ADD FAVORITES ARRAY PROPERTY NAME
            let favoritesArrayMeta = newEl("META");
            favoritesArrayMeta.name = "nameOfFavoritesArray";
            let favoritesArrayMetaText = textMetadata.favorites;
            favoritesArrayMeta.content = favoritesArrayMetaText;
            head.appendChild(favoritesArrayMeta);
            // ADD EBOOK KEYWORD (KYWD)
            let keyword = newEl("META");
            keyword.name = "keyword";
            keyword.content = textMetadata.kywd;
            head.appendChild(keyword);
        }
        // Add stylesheet
        function buildStylesheetTag(link) {
            let stylesheet = newEl("LINK");
            stylesheet.rel = "stylesheet";
            stylesheet.type = "text/css";
            stylesheet.href = link;
            head.appendChild(stylesheet);
        }
        buildStylesheetTag("http://www.ndhfilms.com/assets/" +
            "style/e-readerstyle.css");
        // CHECK FOR OTHER STYLESHEETS
        function loopThroughStylesheetArray(item) {
            buildStylesheetTag(item);
        }
        if (textMetadata.stylesheet.length > 0) {
            textMetadata.stylesheet.forEach(loopThroughStylesheetArray);
        }
        let favicon = newEl("LINK");
        favicon.rel = "icon";
        favicon.type = "image/gif";
        // If no alternate source for icon is specified,
        // default to my icon.
        let iconSource = "http://www.ndhfilms.com/assets/" +
            "images/walkingfavicon.gif";
        if (textMetadata.icon !== "") {
            iconSource = textMetadata.icon;
        }
        favicon.href = iconSource;
        head.appendChild(favicon);
        // CREATE TOUCH ICONS
        let smallTouchIcon = newEl("LINK");
        smallTouchIcon.rel = "apple-touch-icon";
        smallTouchIcon.sizes = "57x57";
        smallTouchIcon.href = iconSource;
        head.appendChild(smallTouchIcon);
        let largeTouchIcon = newEl("LINK");
        largeTouchIcon.rel = "apple-touch-icon";
        largeTouchIcon.sizes = "180x180";
        largeTouchIcon.href = iconSource;
        head.appendChild(largeTouchIcon);
        html.appendChild(head);
    }
    createHead();

    // CREATE KEYWORD
    // THIS IS STILL NEEDED FOR DARK MODE TO WORK

    let darkModeStorage = newEl("P");
    darkModeStorage.id = "darkModeStorage";
    body.appendChild(darkModeStorage);

    function addHeader() {
        let header = newEl("HEADER");
        // header.id = "header";
        let hgroup = newEl("HGROUP");
        if (textMetadata.title !== "") {
            let title = newEl("H1");
            title.id = "title";
            let titleText = ctn(textMetadata.title);
            title.appendChild(titleText);
            hgroup.appendChild(title);
        }
        if (textMetadata.subtitle !== "") {
            let subTitle = newEl("H2");
            subTitle.id = "subtitle";
            let subTitleText = ctn(textMetadata.subtitle);
            subTitle.appendChild(subTitleText);
            hgroup.appendChild(subTitle);
        }
        if (textMetadata.author !== "") {
            let creditAndAuthor = newEl("H2");
            if (textMetadata.credit === "") {
                textMetadata.credit = "By";
            }
            let creditAndAuthorText = ctn(textMetadata.credit +
                " " + textMetadata.author);
            creditAndAuthor.appendChild(creditAndAuthorText);
            hgroup.appendChild(creditAndAuthor);
        }
        if (textMetadata.illustrator !== "") {
            let illustrator = newEl("H3");
            let illustratorText = ctn("Illustrated by " +
                textMetadata.illustrator);
            illustrator.appendChild(illustratorText);
            hgroup.appendChild(illustrator);
        }
        if (textMetadata.coverart !== "") {
            let coverArt = newEl("H3");
            let coverArtText = ctn("Cover Art by " +
                textMetadata.coverart);
            coverArt.appendChild(coverArtText);
            hgroup.appendChild(coverArt);
        }
        header.appendChild(hgroup);
        body.appendChild(header);
    }
    addHeader();

    function addButtons() {
        let buttonContainerDiv = newEl("DIV");
        buttonContainerDiv.classList.add("menuClosed");
        buttonContainerDiv.id = "buttonContainer";
        let buttonArray = [
            "<div id='menuIconDiv' class='buttons' onclick=''>" +
            "<img id='menuIconImg' alt='Click or tap to toggle menu'" +
            "src='http://www.ndhfilms.com/assets/" +
            "images/menuicon_black.svg' />" +
            "</div>",
            "<div id='tocIconDiv' class='buttons' onclick=''>" +
            "<object id='tocIconObject'" +
            "type='image/svg+xml'" +
            "data='http://www.ndhfilms.com/assets/images/tocicon.svg'>" +
            "Your browser does not support SVG</object></div>",
            "<div id='lightbulbDiv' class=' buttons' onclick=''>" +
            "<object ID='lightbulbObject'" +
            "type='image/svg+xml'" +
            "data='http://www.ndhfilms.com/assets/images/lightbulb.svg'>" +
            "Your browser does not support SVG</object></div>",
            "<div id='bookmarkDiv'" +
            "class='buttons'>" +
            "<object id='bookmarkObject' type='image/svg+xml'" +
            "data='http://www.ndhfilms.com/assets/images/bookmark.svg'>" +
            "Your browser does not support SVG</object></div>",
            "<div id='cassetteDiv' class='buttons'>" +
            "<object id='cassetteObject' type='image/svg+xml'" +
            "data='http://www.ndhfilms.com/assets/images/cassette.svg'>" +
            "Your browser does not support SVG</object></div>"
        ];
        if (monetizationObject !== "") {
            buttonArray.push(monetizationObject);
        }
        if (textMetadata.favorites !== "") {
            buttonArray.push(
                "<div id='starDiv' class='buttons'>" +
                "<object id='starObject'" +
                " type='image/svg+xml' data='../../assets/images/star.svg'>" +
                "Your browser does not support SVG</object></div>"
            );
        }
        let menuHTML = "";

        function loopButtonArray(item) {
            menuHTML = menuHTML.concat(item);
        }
        buttonArray.forEach(loopButtonArray);
        buttonContainerDiv.innerHTML = menuHTML;
        body.appendChild(buttonContainerDiv);
    }
    addButtons();

    function addAudioDiv() {
        let audioDiv = newEl("DIV");
        audioDiv.id = "audioDiv";
        audioDiv.classList.add("standby");

        let audioDivObject = {};

        let arrayOfAudioDivData = textMetadata.audio.split(" ");

        function loopThroughAudioDivArray(item, index) {
            if (item === ":background") {
                audioDivObject.background = arrayOfAudioDivData[index + 1];
            } else if (item === ":copyright") {
                let audioCopyrightInfo = arrayOfAudioDivData.slice(index +
                    1).join(" ");
                audioDivObject.copyright = audioCopyrightInfo;
            }
        }
        arrayOfAudioDivData.forEach(loopThroughAudioDivArray);
        let audioBackground = newEl("DIV");
        audioBackground.id = "audioBackground";
        if (audioDivObject.background !== undefined) {
            audioBackground.style.backgroundImage = "url('" +
                audioDivObject.background + "')";
        }
        audioDiv.appendChild(audioBackground);
        let container = newEl("DIV");
        container.id = "audioContainer";
        container.classList.add("container");
        let audioIllustrationDiv = newEl("DIV");
        audioIllustrationDiv.id = "audioIllustrationDiv";
        audioIllustrationDiv.classList.add("flexbox1");
        let audioIllustration = newEl("IMG");
        audioIllustration.id = "audioDivIllustration";
        audioIllustrationDiv.appendChild(audioIllustration);
        let audioInfoHgroup = newEl("HGROUP");
        audioInfoHgroup.classList.add("audioInfoHgroup");
        let hTitle = newEl("H1");
        let hTitleText = ctn(textMetadata.title);
        hTitle.appendChild(hTitleText);
        audioInfoHgroup.appendChild(hTitle);
        let hAuthor = newEl("H2");
        let hAuthorText = ctn(textMetadata.credit +
            " " + textMetadata.author);
        hAuthor.appendChild(hAuthorText);
        audioInfoHgroup.appendChild(hAuthor);
        let hAudioCopyright = newEl("H2");
        if (audioDivObject.copyright !== "") {
            let hAudioCopyrightText = "";
            if (audioDivObject.copyright.slice(0, 6).toLowerCase() ===
                "public") {
                hAudioCopyrightText = "Audio Recording <s>&COPY</s> " +
                    audioDivObject.copyright;
            } else {
                hAudioCopyrightText = "Audio Recording &COPY; " +
                    audioDivObject.copyright;
            }
            hAudioCopyright.innerHTML = hAudioCopyrightText;
            audioInfoHgroup.appendChild(hAudioCopyright);
        }
        let hAudioCredits = newEl("H3");
        let hAudioCreditsLink = newEl("A");
        hAudioCreditsLink.id = "audioCreditsLink";
        hAudioCreditsLink.href = "#creditsSection";
        hAudioCreditsLink.onclick = true;
        let hAudioCreditsText = ctn("CREDITS");
        hAudioCreditsLink.appendChild(hAudioCreditsText);
        hAudioCredits.appendChild(hAudioCreditsLink);
        audioInfoHgroup.appendChild(hAudioCredits);
        audioIllustrationDiv.appendChild(audioInfoHgroup);
        container.appendChild(audioIllustrationDiv);
        let audioCassetteDiv = newEl("DIV");
        audioCassetteDiv.id = "audioCassetteDiv";
        audioCassetteDiv.classList.add("flexbox2");
        let cassetteAnimatedDiv = newEl("DIV");
        cassetteAnimatedDiv.id = "cassetteAnimatedDiv";
        let cassetteAnimatedObject = newEl("OBJECT");
        cassetteAnimatedObject.id = "cassetteAnimatedObject";
        cassetteAnimatedObject.type = "image/svg+xml";
        cassetteAnimatedObject.data = "http://www.ndhfilms.com/assets/" +
            "images/cassetteAnimated.svg";
        cassetteAnimatedDiv.appendChild(cassetteAnimatedObject);
        audioCassetteDiv.appendChild(cassetteAnimatedDiv);
        let audioHoobaloo = newEl("DIV");
        audioHoobaloo.id = "audioInterfaceWrapper";
        audioHoobaloo.innerHTML = "<object id='audioElement'" +
        "type='image/svg+xml'" +
        "data='http://www.ndhfilms.com/assets/images/audiointerface.svg'>" +
        "Your browser does not support SVG</object></div>";
        audioCassetteDiv.appendChild(audioHoobaloo);
        container.appendChild(audioCassetteDiv);
        audioDiv.appendChild(container);
        addACloseButton(audioDiv, "audioCloseButton");
        body.appendChild(audioDiv);
    }
    if (textMetadata.audio !== "") {
        addAudioDiv();
    }

    function addText() {
        let illustrationCounter = 0;

        function appendInputArrayToBody(item, index) {
            if (item === "[break]") {
                console.log(true);
                let hr = newEl("HR");
                hr.classList.add("style-two");
                body.appendChild(hr);
            } else if (item.slice(0, 10).toLowerCase() === "@@coverimg") {
                let coverImageLink = newEl("A");
                textMetadata.coverlink = item.slice(11);
                coverImageLink.href = textMetadata.coverlink;
                let coverImage = newEl("IMG");
                coverImage.id = "coverImg";
                if (textMetadata.coverartdesc !== "") {
                    coverImage.title = textMetadata.coverartdesc;
                    coverImage.alt = textMetadata.coverartdesc;
                } else {
                    coverImage.title = "Cover of " + textMetadata.title;
                    coverImage.alt = "Cover of " + textMetadata.title;
                    if (textMetadata.coverart !== "") {
                        coverImage.title = coverImage.title.concat(" by " +
                            textMetadata.coverart);
                        coverImage.alt = coverImage.alt.concat(" by " +
                            textMetadata.coverart);
                    }
                }
                coverImage.src = textMetadata.coverlink;
                coverImageLink.appendChild(coverImage);
                body.insertBefore(coverImageLink, body.childNodes[0]);
                illustrationArray.push({
                    link: "#coverImg",
                    text: "Cover"
                });
            } else if (item.slice(0, 8).toLowerCase() === "@@blockq") {
                let blockquoteContents = item.slice(8);
                blockquoteContents = blockquoteContents.replace(/\\"/g, "\"");
                let blockquote = newEl("BLOCKQUOTE");
                let blockquoteText = ctn(blockquoteContents);
                blockquote.appendChild(blockquoteText);
                body.appendChild(blockquote);
            } else if (item.slice(0, 11).toLowerCase() === "@@quoteattr") {
                let blockquoteAttrContent = " - " + item.slice(11);
                blockquoteAttrContent = blockquoteAttrContent.replace(
                    /\\"/g, "\""
                );
                let blockquoteAttr = newEl("P");
                blockquoteAttr.classList.add("blockquoteAttr");
                if (blockquoteAttrContent.includes("<i>")) {
                    blockquoteAttr.innerHTML = blockquoteAttrContent;
                } else {
                    let blockquoteAttrText = ctn(blockquoteAttrContent);
                    blockquoteAttr.appendChild(blockquoteAttrText);
                }
                body.appendChild(blockquoteAttr);
            } else if (item.slice(0, 9).toLowerCase() === "@@support") {
                let supportArray = item.slice(9).split(" ");
                if ((supportArray.includes(":title") === false) ||
                    (supportArray.includes(":text") === false)) {
                    alert("@@SUPPORT section is missing required information");
                    return;
                }
                let supportObject = {
                    title: "",
                    text: ""
                };

                function loopThroughSupportArray(saItem, saIndex) {
                    let supportTitleString = "";
                    let supportTextString = "";
                    let saI = 0;
                    if (saItem === ":title") {
                        for (saI = saIndex + 1; saI < supportArray.indexOf(
                                ":text"); saI += 1) {
                            supportTitleString = supportTitleString.concat(" " +
                                supportArray[saI]);
                        }
                        saI = 0;
                        supportObject.title = supportTitleString;
                    } else if (saItem === ":text") {
                        for (saI = saIndex +
                            1; saI < supportArray.length; saI += 1) {
                            supportTextString = supportTextString.concat(" " +
                                supportArray[saI]);
                        }
                        saI = 0;
                        supportObject.text = supportTextString;
                    }
                }
                supportArray.forEach(loopThroughSupportArray);
                let supportSection = newEl("SECTION");
                supportSection.classList.add("endingSection");
                supportSection.id = "supportSection";
                let supportSectionH3 = newEl("H3");
                supportSectionH3.classList.add("sectionHeader");
                let supportSectionH3Text = ctn(supportObject.title);
                supportSectionH3.appendChild(supportSectionH3Text);
                supportSection.appendChild(supportSectionH3);
                let supportSectionTextDiv = newEl("DIV");
                supportSectionTextDiv.innerHTML = supportObject.text;
                supportSection.appendChild(supportSectionTextDiv);
                body.appendChild(supportSection);
            } else if (item.slice(0, 11).toLowerCase() === "@@htmlstart") {
                htmlGrabberRunning = true;
                let htmlStartI;
                for (htmlStartI = (index + 1); htmlStartI <
                    inputArray.length; htmlStartI += 1) {
                    if (inputArray[htmlStartI].toLowerCase() !== "@@htmlend") {
                        let rawHTMLContent = inputArray[htmlStartI].replace(
                            /\\"/g, "\""
                        );
                        rawHTMLStorage.push(rawHTMLContent);
                    } else {
                        break;
                    }
                }
            } else if (item.slice(0, 9).toLowerCase() === "@@htmlend") {
                htmlGrabberRunning = false;
                let rawHTMLDiv = newEl("DIV");
                rawHTMLDiv.classList.add("rawHTMLDiv");
                let rawHTML = rawHTMLStorage.join("");
                rawHTMLDiv.innerHTML = rawHTML;
                body.appendChild(rawHTMLDiv);
                rawHTMLStorage = [];
            } else if (item.slice(0, 5).toLowerCase() === "@@img") {
                let imageInfo = item.slice(5).split(" ");
                let imageInfoObject = {};

                function loopThroughImageInfo(imageInfoItem, imageInfoIndex) {
                    if (imageInfoItem === ":source") {
                        imageInfoObject.source = imageInfo[imageInfoIndex + 1];
                    } else if (imageInfoItem === ":desc") {
                        let imageDesc = imageInfo.slice(imageInfoIndex);
                        imageInfoObject.desc = imageDesc.join(" ");
                    }
                }
                imageInfo.forEach(loopThroughImageInfo);
                let plainImage = newEl("IMG");
                plainImage.classList.add("plainImage");
                plainImage.src = imageInfoObject.source;
                if (imageInfoObject.desc !== undefined) {
                    plainImage.alt = imageInfoObject.desc;
                } else {
                    plainImage.alt = "An image for " + textMetadata.title;
                }
                body.appendChild(plainImage);
            } else if (item.slice(0, 6).toLowerCase() === "@@illo") {
                illustrationCounter += 1;
                let illoMetadataObject = {};

                // GET IMAGE METADATA
                let illoMetadataArray = item.split(" ");
                if (illoMetadataArray.includes(":source") === false) {
                    alert("required illustration data missing.");
                }

                function addIlloMetadataToObject(item, index) {
                    if (item === ":source") {
                        illoMetadataObject.source = illoMetadataArray[
                            index + 1
                        ];
                    } else if (item === ":buy") {
                        illoMetadataObject.buy = illoMetadataArray[index +
                            1];
                    } else if (item === ":caption") {
                        let illoCaption = illoMetadataArray.slice(index +
                            1);
                        illoCaption = illoCaption.join(" ");
                        illoCaption = illoCaption.replace(/\\"/g, "");
                        illoMetadataObject.caption = illoCaption;
                    } else if (item === ":orientation") {
                        illoMetadataObject.orientation = illoMetadataArray[
                            index + 1
                        ];
                    } else if (item === ":desc") {
                        illoMetadataObject.desc = illoMetadataArray[index +
                            1];
                    } else if (item === ":illustrator") {
                        let indexForIllustrator;
                        // nameOfIll = nameOfIllustrator
                        let nameOfIll = "";
                        for (indexForIllustrator = (
                                index + 1
                            ); indexForIllustrator <
                            illoMetadataArray.length; indexForIllustrator +=
                            1) {
                            if (illoMetadataArray[
                                    indexForIllustrator
                                ].charAt(0) !== ":") {
                                nameOfIll = nameOfIll.concat(" " +
                                    illoMetadataArray[
                                        indexForIllustrator
                                    ]);
                            } else if (illoMetadataArray[
                                    indexForIllustrator
                                ].charAt(0) === ":") {
                                break;
                            }
                        }
                        illoMetadataObject.illustrator = nameOfIll;
                    }
                }
                illoMetadataArray.forEach(addIlloMetadataToObject);

                // CREATE ILLUSTRATION THUMBNAIL

                let illustrationNumber = "";
                if (illustrationCounter < 10) {
                    illustrationNumber = "0" + illustrationCounter;
                } else {
                    illustrationNumber = illustrationCounter;
                }
                let imgThumbnail = newEl("IMG");
                imgThumbnail.id = "illustration" + illustrationNumber;
                let illustrationObjectToPush = {
                    link: "#" + imgThumbnail.id
                };
                if (illoMetadataObject.caption === undefined) {
                    illustrationObjectToPush.text = "Image No. " +
                        (illustrationArray.length + 1);
                } else {
                    let illMetObjCap = illoMetadataObject.caption;
                    illustrationObjectToPush.text = illMetObjCap;
                }
                illustrationArray.push(illustrationObjectToPush);
                if ((illoMetadataObject.desc !== undefined) &&
                    (illoMetadataObject.desc !== "")) {
                    imgThumbnail.title = illoMetadataObject.desc;
                    imgThumbnail.alt = illoMetadataObject.desc;
                } else {
                    let imgThumbnailMeta = "Illustration for " +
                        textMetadata.title;
                    imgThumbnail.title = imgThumbnailMeta;
                    imgThumbnail.alt = imgThumbnailMeta;
                    if ((illoMetadataObject.illustrator !== undefined) &&
                        (illoMetadataObject.illustrator !== "")) {
                        let textToConcat = " , illustration by " +
                            illoMetadataObject.illustrator;
                        imgThumbnail.title = imgThumbnail.title.concat(
                            textToConcat
                        );
                        imgThumbnail.alt = imgThumbnail.alt.concat(
                            textToConcat
                        );
                    }
                }
                imgThumbnail.classList.add("illustrationTarget");
                if (illoMetadataObject.orientation === "portrait") {
                    imgThumbnail.classList.add("thumbnailPortrait");
                } else if (illoMetadataObject.orientation ===
                    "landscape") {
                    imgThumbnail.classList.add("thumbnailLandscape");
                }
                imgThumbnail.src = illoMetadataObject.source;
                body.appendChild(imgThumbnail);

                // CREATE ENLARGE ICON
                let enlargeIcon = newEl("IMG");
                enlargeIcon.classList.add("enlargeIcon");
                enlargeIcon.alt = "Click or tap to enlarge illustration";
                enlargeIcon.src = "http://www.ndhfilms.com/assets/images/" +
                    "enlargeicon_black.svg";
                body.appendChild(enlargeIcon);

                // CREATE ILLUSTRATION DIV
                let illustrationDiv = newEl("DIV");
                illustrationDiv.classList.add("illustrationDiv");
                illustrationDiv.classList.add("standby");

                addACloseButton(illustrationDiv);

                let container = newEl("DIV");
                container.classList.add("container");

                let flexbox1 = newEl("DIV");
                flexbox1.classList.add("flexbox1");

                let fullImage = newEl("IMG");
                fullImage.classList.add("illustration");
                fullImage.classList.add(illoMetadataObject.orientation +
                    "Illustration");
                fullImage.alt = "Illustration for " + textMetadata.title +
                    " by " + illoMetadataObject.illustrator;
                fullImage.title = "Illustration by " +
                    illoMetadataObject.illustrator;
                fullImage.src = illoMetadataObject.source;
                flexbox1.appendChild(fullImage);
                container.appendChild(flexbox1);

                let flexbox2 = newEl("DIV");
                flexbox2.classList.add("illustrationCaptionDiv");
                flexbox2.classList.add("flexbox2");
                let flexbox2Hgroup = newEl("HGROUP");
                flexbox2Hgroup.classList.add("illustrationCaption");
                let caption = newEl("H2");
                let captionText = ctn("Image #" +
                    (illustrationArray.length) + " for this E-Book.");
                if (illoMetadataObject.caption !== undefined) {
                    captionText = ctn(illoMetadataObject.caption);
                }
                caption.appendChild(captionText);
                flexbox2Hgroup.appendChild(caption);
                if (illoMetadataObject.illustrator !== undefined) {
                    let illustratorInfo = newEl("H3");
                    let illustratorInfoText = ctn("Illustration by " +
                        illoMetadataObject.illustrator);
                    illustratorInfo.appendChild(illustratorInfoText);
                    flexbox2Hgroup.appendChild(illustratorInfo);
                }
                flexbox2.appendChild(flexbox2Hgroup);
                container.appendChild(flexbox2);
                illustrationDiv.appendChild(container);
                body.appendChild(illustrationDiv);
            } else if (item.slice(0, 7).toLowerCase() === "@@audio") {
                let audioSourceObject = {};
                let audioSourceInfo = item.slice(7).split(" ");

                function loopThroughAudioSourceInfo(item, index) {
                    if (item === ":source") {
                        audioSourceObject.source = audioSourceInfo[index + 1];
                    } else if (item === ":title") {
                        let sourceTitle = audioSourceInfo.slice(index +
                            1).join(" ");
                        audioSourceObject.title = sourceTitle;
                    }
                }
                audioSourceInfo.forEach(loopThroughAudioSourceInfo);
                audioSourceArray.push(audioSourceObject);
            } else if (item.slice(0, 1) === "#") {
                let chapterHeading = "";
                let chapterHeadingText = "";
                // sh is the chapter subheading
                let sh = "";
                if ((item.charAt(0) === "#") && (item.charAt(1) !== "#")) {
                    chapterHeading = newEl("H1");
                    chapterHeadingText = item.slice(1);
                    let chapterHeadingID = chapterHeadingText.replace(
                        " ", "_");
                    chapterHeading.id = chapterHeadingID;
                    let chapterObject = {
                        link: "#" + chapterHeadingID
                    };
                    if (inputArray[index + 1] !== undefined) {
                        if (inputArray[index + 1].slice(0, 2) === "##") {
                            sh = ": " + inputArray[index + 1].slice(2);
                        }
                    }
                    chapterObject.text = chapterHeadingText + sh;
                    chapterArray.push(chapterObject);
                } else if ((item.charAt(0) === "#") &&
                    (item.charAt(1) === "#")) {
                    chapterHeading = newEl("H2");
                    chapterHeadingText = item.slice(2);
                }
                chapterHeading.classList = "chapterHeading";
                let chapterHeadingNode = ctn(chapterHeadingText);
                chapterHeading.appendChild(chapterHeadingNode);
                body.appendChild(chapterHeading);
            } else if (item.slice(0, 1) === "`") {
                let poetryParagraph = newEl("P");
                poetryParagraph.classList.add("lyricalP");
                let lyricalPSliceIndex = 1;
                if (item.slice(0, 2) === "``") {
                    lyricalPSliceIndex = 2;
                    poetryParagraph.classList.add("endOfVerse");
                }
                poetryParagraph.innerHTML = item.slice(
                    lyricalPSliceIndex
                ).replace(/\\"/g, "\"");
                body.appendChild(poetryParagraph);
            } else if (item.slice(0, 5).toLowerCase() === "@@ded") {
                let dedication = newEl("P");
                dedication.classList.add("dedication");
                let dedicationText = ctn(item.slice(5));
                dedication.appendChild(dedicationText);
                body.appendChild(dedication);
            } else if (item.slice(0, 4).toLowerCase() === "@@fn") {
                let footnote = newEl("P");
                let footnoteContents = item.slice(4);
                let footnoteNumber = footnoteSection.children.length + 1;
                let footnoteText = "<a id='" + "footnote" + footnoteNumber +
                    "' href='#footnoteLink" + footnoteNumber + "'>" + "<sup>" +
                    footnoteNumber + "</sup>" + "</a>" + footnoteContents;
                footnote.innerHTML = footnoteText;
                footnoteSection.appendChild(footnote);
            } else {
                if (htmlGrabberRunning === false) {
                    let paragraph = newEl("P");
                    let pText = "";
                    if (item.slice(0, 5) === ":left") {
                        paragraph.classList.add("alignLeft");
                        pText = item.slice(5);
                        pText = pText.replace(/\\"/g, "\"");
                    } else if (item.slice(0, 7) === ":center") {
                        paragraph.classList.add("alignCenter");
                        pText = item.slice(7);
                        pText = pText.replace(/\\"/g, "\"");
                    } else if (item.slice(0, 6) === ":right") {
                        paragraph.classList.add("alignRight");
                        pText = item.slice(6);
                        pText = pText.replace(/\\"/g, "\"");
                    } else {
                        pText = item.replace(/\\"/g, "\"");
                    }
                    if (firstProperParagraph) {
                        pText = "<span class='dropcap'>" + pText.slice(0, 1) +
                            "</span>" + pText.slice(1);
                        paragraph.innerHTML = pText;
                        firstProperParagraph = false;
                    } else {
                        paragraph.innerHTML = pText;
                    }
                    if (paragraph.innerHTML.toLowerCase().includes("<fn>")) {
                        footnoteCounter += 1;
                        paragraph.innerHTML = paragraph.innerHTML.replace(
                            "<fn>", "<a id='footnoteLink" + footnoteCounter +
                            "' href='#footnote" + footnoteCounter +
                            "'><sup>" + footnoteCounter + "</sup></a>"
                        );
                    }
                    body.appendChild(paragraph);
                }
            }
        }
        inputArray.forEach(appendInputArrayToBody);
    }
    addText();

    function createTableOfContents() {
        // PREPARE TABLES OF CONTENTS
        // TOC SELECT FOR DESKTOP
        let desktopTOCSelectLabel = newEl("LABEL");
        desktopTOCSelectLabel.setAttribute("for", "tocSelect");
        let labelText = ctn("Some text here");
        desktopTOCSelectLabel.appendChild(labelText);
        let desktopTOCSelect = newEl("SELECT");
        desktopTOCSelect.id = "tocSelect";
        desktopTOCSelect.classList.add("selectClosed");
        let placeholder = newEl("OPTION");
        placeholder.id = "firstOption";
        placeholder.value = "placeholder";
        let placeholderText = ctn("TABLE OF CONTENTS");
        placeholder.appendChild(placeholderText);
        desktopTOCSelect.appendChild(placeholder);
        // TOC DIV FOR MOBILE
        let mobileTOCDiv = newEl("DIV");
        mobileTOCDiv.id = "tableOfContents";
        mobileTOCDiv.classList.add("tocStandby");
        mobileTOCDiv.onclick = true;
        let mobileTOCHeader = newEl("H1");
        mobileTOCHeader.classList.add("tocHeader");
        let mobileTOCHeaderText = ctn("TABLE OF CONTENTS");
        mobileTOCHeader.appendChild(mobileTOCHeaderText);
        mobileTOCDiv.appendChild(mobileTOCHeader);
        let mobileTOCNestedDiv = newEl("DIV");
        mobileTOCNestedDiv.id = "tocMobileDiv";
        let mobileTOCList = newEl("UL");
        mobileTOCList.id = "tocList";
        mobileTOCNestedDiv.appendChild(mobileTOCList);
        mobileTOCDiv.appendChild(mobileTOCNestedDiv);
        // TOC SECTION FOR ACCESSIBILITY
        let desktopTOCSection = newEl("SECTION");
        desktopTOCSection.id = "tableOfContentsSection";
        let desktopTOCHeader = newEl("H2");
        let desktopTOCHeaderText = ctn("TABLE OF CONTENTS");
        desktopTOCHeader.appendChild(desktopTOCHeaderText);
        desktopTOCSection.appendChild(desktopTOCHeader);
        let tocSecList = newEl("UL");

        function prepareATOCList(array, mode) {
            // ILLUSTRATION LIST GENERATOR
            if (array.length > 0) {
                // PREPARE ILLUSTRATION LISTS
                // TOC SELECT FOR DESKTOP
                let illustrPlaceholder = newEl("OPTION");
                illustrPlaceholder.value = "placeholder";
                let sectionText = "ILLUSTRATIONS";
                if (mode === "chapters") {
                    sectionText = "SECTIONS";
                }
                let illustrPlaceholderText = ctn(
                    "-- " + sectionText + " --"
                );
                illustrPlaceholder.appendChild(illustrPlaceholderText);
                desktopTOCSelect.appendChild(illustrPlaceholder);
                // TOC DIV FOR MOBILE
                let mobileIllustrHeading = newEl("LI");
                mobileIllustrHeading.classList.add("listHeading");
                let mobileIllustrH3 = newEl("H3");
                let mobileIllustrH3Text = ctn(sectionText);
                mobileIllustrH3.appendChild(mobileIllustrH3Text);
                mobileIllustrHeading.appendChild(mobileIllustrH3);
                mobileTOCList.appendChild(mobileIllustrHeading);
                // TOC SECTION FOR ACCESSIBILITY
                let tocSectionIllustrPlaceholder = newEl("LI");
                tocSectionIllustrPlaceholder.classList.add("listHeading");
                let tocSectionIllustrPlaceholderH3 = newEl("H3");
                let tocSectionIllustrPlaceholderH3Text = ctn(

                    sectionText
                );
                tocSectionIllustrPlaceholderH3.appendChild(
                    tocSectionIllustrPlaceholderH3Text
                );
                tocSectionIllustrPlaceholder.appendChild(
                    tocSectionIllustrPlaceholderH3
                );
                tocSecList.appendChild(tocSectionIllustrPlaceholder);

                // LOOP THROUGH ILLUSTRATION ARRAY

                function loopThroughIllustrationArray(item, index) {
                    // TOC SELECT FOR DESKTOP
                    let tocSelectIllustrOption = newEl("OPTION");
                    tocSelectIllustrOption.value = item.link;
                    let tocSelectIllustrOptionText = ctn(
                        item.text
                    );
                    tocSelectIllustrOption.appendChild(
                        tocSelectIllustrOptionText
                    );
                    desktopTOCSelect.appendChild(
                        tocSelectIllustrOption
                    );
                    // TOC DIV FOR MOBILE
                    let mobileTOCDivIllustrLI = newEl("LI");
                    if ((mode === "illustrations") && (item.text !== "Cover")) {
                        mobileTOCDivIllustrLI.classList.add("listItalic");
                    }
                    let mobileTOCDivIllustrLink = newEl("A");
                    mobileTOCDivIllustrLink.classList.add("tocLink");
                    mobileTOCDivIllustrLink.href = item.link;
                    let mobileTOCDivIllustrLinkText = ctn(
                        item.text
                    );
                    mobileTOCDivIllustrLink.appendChild(
                        mobileTOCDivIllustrLinkText
                    );
                    mobileTOCDivIllustrLI.appendChild(mobileTOCDivIllustrLink);
                    mobileTOCList.appendChild(mobileTOCDivIllustrLI);
                    // TOC SECTION FOR ACCESSIBILITY
                    let tocSectionIllustrLI = newEl("LI");
                    if ((mode === "illustrations") && (item.text !== "Cover")) {
                        tocSectionIllustrLI.classList.add("listItalic");
                    }
                    let tocSectionIllustrLink = newEl("A");
                    tocSectionIllustrLink.href = item.link;
                    let tocSectionIllustrLinkText = ctn(
                        item.text
                    );
                    tocSectionIllustrLink.appendChild(
                        tocSectionIllustrLinkText
                    );
                    tocSectionIllustrLI.appendChild(tocSectionIllustrLink);
                    tocSecList.appendChild(tocSectionIllustrLI);
                }
                array.forEach(loopThroughIllustrationArray);
            }
        }

        prepareATOCList(illustrationArray, "illustrations");
        prepareATOCList(chapterArray, "chapters");

        // CREATE AND APPEND CLOSE BUTTON

        addACloseButton(mobileTOCDiv, "tocCloseButton");

        desktopTOCSection.appendChild(tocSecList);
        if ((chapterArray.length > 0) || (illustrationArray.length > 0)) {
            body.appendChild(desktopTOCSelectLabel);
            body.getElementsByTagName(
                "HEADER"
            )[0].parentNode.insertBefore(
                desktopTOCSelect, body.getElementsByTagName(
                    "HEADER"
                )[0].nextSibling);
            body.getElementsByTagName(
                "HEADER"
            )[0].parentNode.insertBefore(
                mobileTOCDiv, body.getElementsByTagName(
                    "HEADER"
                )[0].nextSibling);
            if (textMetadata.small !==
                "small") {
                body.getElementsByTagName(
                    "HEADER"
                )[0].parentNode.insertBefore(
                    desktopTOCSection, body.getElementsByTagName(
                        "HEADER"
                    )[0].nextSibling);
            }
        }
    }
    createTableOfContents();

    // CREATE AUDIO SOURCE MENU

    let audioSourceMenu = newEl("DIV");
    audioSourceMenu.id = "audioSourceMenu";
    audioSourceMenu.classList.add("audioSourceMenuStandby");
    let audioSourceMenuHgroup = newEl("HGROUP");
    if (textMetadata.title !== "") {
        let audioSourceMenuTitle = newEl("H1");
        let audioSourceMenuTitleText = ctn(textMetadata.title);
        audioSourceMenuTitle.appendChild(audioSourceMenuTitleText);
        audioSourceMenuHgroup.appendChild(audioSourceMenuTitle);
        if (textMetadata.subtitle !== "") {
            let audioSourceMenuSubtitle = newEl("H2");
            let audioSourceMenuSubtitleText = ctn(textMetadata.subtitle);
            audioSourceMenuSubtitle.appendChild(audioSourceMenuSubtitleText);
            audioSourceMenuHgroup.appendChild(audioSourceMenuSubtitle);
        }
        if (textMetadata.author !== "") {
            let audioSourceMenuAuthor = newEl("H3");
            let audioSourceMenuAuthorText = "";
            if (textMetadata.credit !== "") {
                audioSourceMenuAuthorText = ctn(textMetadata.credit + " " +
                textMetadata.author);
            } else {
                audioSourceMenuAuthorText = ctn("by " + textMetadata.author);
            }
            audioSourceMenuAuthor.appendChild(audioSourceMenuAuthorText);
            audioSourceMenuHgroup.appendChild(audioSourceMenuAuthor);
        }
    }
    let audioSourceMenuHeader = newEl("H1");
    audioSourceMenuHeader.id = "audioSourceMenuHeader";
    let audioSourceMenuHeaderText = ctn("CHOOSE AN AUDIO FILE");
    audioSourceMenuHeader.appendChild(audioSourceMenuHeaderText);
    audioSourceMenuHgroup.appendChild(audioSourceMenuHeader);
    audioSourceMenu.appendChild(audioSourceMenuHgroup);
    let audioListDiv = newEl("DIV");
    audioListDiv.id = "audioListDiv";
    let audioSourceList = newEl("UL");
    audioSourceList.id = "audioSourceList";

    function loopThroughAudioSourceArray(item) {
        let audioSourceLI = newEl("LI");
        audioSourceLI.title = item.source;
        let audioSourceLIText = ctn(item.title);
        audioSourceLI.appendChild(audioSourceLIText);
        audioSourceList.appendChild(audioSourceLI);
    }
    if (audioSourceArray.length === 0) {
        body.querySelector("#cassetteDiv").remove();
        if (body.querySelector("#audioDiv") !== null) {
            body.querySelector("#audioDiv").remove();
        }
    } else {
        audioSourceArray.forEach(loopThroughAudioSourceArray);
        let currentAudio = newEl("P");
        currentAudio.id = "currentAudio";
        let initialAudioText = "CHOOSE AN AUDIO FILE &#9757;";
        currentAudio.innerHTML = initialAudioText;
        if (audioSourceArray.length > 1) {
            audioListDiv.appendChild(audioSourceList);
            audioSourceMenu.appendChild(audioListDiv);
            addACloseButton(audioSourceMenu);
        }
        // Append currentAudio to the audio div
        body.querySelector(
            "#audioCassetteDiv"
        ).insertBefore(currentAudio, body.querySelector(
            "#audioCassetteDiv"
        ).childNodes[0]);
        // Append menu to body
        body.insertBefore(audioSourceMenu, body.querySelector("#audioDiv"));
    }

    function addCompletionLocationAndDate() {
        let ul = newEl("UL");
        ul.classList.add("mainTextUL");
        ul.id = "endingDate";
        let location = newEl("LI");
        let locationText = ctn(textMetadata.location);
        location.appendChild(locationText);
        let date = newEl("LI");
        let dateText = textMetadata.date;
        let dateTextArray = dateText.split("-");
        let goodOlMonthArray = [
            "January", "February", "March", "April",
            "May", "June", "July", "August",
            "September", "October", "November", "December"
        ];
        let year = dateTextArray[0];
        let month = goodOlMonthArray[parseInt(dateTextArray[1]) - 1];
        let day = dateTextArray[2];
        if (day.charAt(0) === "0") {
            day = day.slice(1);
        }
        if ((day === "1") || (day === "21") || (day === "31")) {
            day = day.concat("<sup>st</sup>");
        } else if ((day === "2") || (day === "22")) {
            day = day.concat("<sup>nd</sup>");
        } else if ((day === "3") || (day === "23")) {
            day = day.concat("<sup>rd</sup>");
        } else {
            day = day.concat("<sup>th</sup>");
        }
        let completionTime = newEl("TIME");
        completionTime.datetime = dateText;

        date.innerHTML = month + " " + day + ", " + year;
        ul.appendChild(location);
        ul.appendChild(date);
        if (body.querySelectorAll("#supportSection") !== null) {
            body.insertBefore(ul, body.querySelectorAll("#supportSection")[0]);
        } else {
            body.appendChild(ul);
        }
    }
    if (textMetadata.date !== "") {
        addCompletionLocationAndDate();
    }

    function addCopyright() {
        let copyright = newEl("P");
        copyright.id = "copyrightNotice";
        copyright.classList.add("center");
        if (textMetadata.copyright !== "") {
            let copyrightArray = textMetadata.copyright.split(" ");
            let copyrightDate = copyrightArray[0];
            let copyrightSymbolCode = "TEXT &COPY; ";
            let timeElement = "<time datetime='" + copyrightDate + "'>" +
                copyrightDate + "</time>";
            let copyrightHolder = copyrightArray.slice(1).join(" ");
            if (copyrightDate === "PUBLIC") {
                copyright.innerHTML = "TEXT <s>&COPY;</s> PUBLIC DOMAIN";
            } else {
                copyright.innerHTML = copyrightSymbolCode + timeElement +
                    " " + copyrightHolder;
            }
        } else {
            copyright.innerHTML = "No copyright information available " +
                "at this time";
        }
        if (body.querySelectorAll("#supportSection") !== null) {
            body.insertBefore(copyright, body.querySelectorAll(
                "#supportSection"
            )[0]);
        } else {
            body.appendChild(copyright);
        }
    }
    if (inputArray.length > 0) {
        addCopyright();
    }

    function addCredits() {
        let creditsSection = newEl("SECTION");
        creditsSection.classList.add("endingSection");
        creditsSection.id = "creditsSection";
        let creditsSectionHeader = newEl("H3");
        creditsSectionHeader.classList.add("sectionHeader");
        let creditsSectionHeaderText = ctn("CREDITS");
        creditsSectionHeader.appendChild(creditsSectionHeaderText);
        creditsSection.appendChild(creditsSectionHeader);
        let creditsUL = newEl("UL");
        creditsUL.classList.add("mainTextUL");
        creditsUL.id = "creditsList";
        let authorCredit = newEl("LI");
        let authorCreditText = ctn("Written by " +
            textMetadata.author);
        authorCredit.appendChild(authorCreditText);
        creditsUL.appendChild(authorCredit);
        if (textMetadata.coverart !== "") {
            let coverArtCredit = newEl("LI");
            let coverArtCreditText = ctn("Cover Art by " +
                textMetadata.coverart);
            coverArtCredit.appendChild(coverArtCreditText);
            creditsUL.appendChild(coverArtCredit);
        }
        if (textMetadata.illustrator !== "") {
            let illustratorCredit = newEl("LI");
            let illustratorCreditText = ctn("Illustrated by " +
                textMetadata.illustrator);
            illustratorCredit.appendChild(illustratorCreditText);
            creditsUL.appendChild(illustratorCredit);
        }
        creditsSection.appendChild(creditsUL);
        body.appendChild(creditsSection);
    }
    if (inputArray.length > 0) {
        addCredits();
    }

    function addEReaderNotice() {
        let eReaderNotice = newEl("P");
        eReaderNotice.id = "eReaderNotice";
        let eReaderNoticeText = ctn("This e-Reader was " +
            "developed by Nicholas Bernhard. No part of the source code or " +
            "user interface can be used without explicit permission from the " +
            "developer. For licensing information, send an email to " +
            "Nicholas[at]NDHFilms[dot][com].");
        eReaderNotice.appendChild(eReaderNoticeText);
        body.appendChild(eReaderNotice);
    }
    addEReaderNotice();

    // ADD FOOTNOTES SECTION

    if (footnoteSection.children.length > 0) {
        let footnotesSectionHeader = newEl("H3");
        footnotesSectionHeader.classList.add("sectionHeader");
        let footnotesSectionHeaderText = ctn("FOOTNOTES");
        footnotesSectionHeader.appendChild(footnotesSectionHeaderText);
        footnoteSection.insertBefore(
            footnotesSectionHeader, footnoteSection.children[0]
        );
        body.insertBefore(footnoteSection, body.querySelectorAll(
            "#eReaderNotice"
        )[0]);
    }

    // FINISH UP THE TABLES OF CONTENTS

    function addToEndOfTOCs(elementToLinkTo, textToGrab) {
        // TOC SELECT FOR DESKTOP
        let supportSectionOption = newEl("OPTION");
        supportSectionOption.value = elementToLinkTo;
        let supportSectionOptionText = ctn(textToGrab);
        supportSectionOption.appendChild(supportSectionOptionText);
        if (body.querySelectorAll("#tocSelect")[0] !== undefined) {
            body.querySelectorAll(
                "#tocSelect"
            )[0].appendChild(supportSectionOption);
        }
        // TOC MOBILE DIV
        let mobileTOCLI = newEl("LI");
        let mobileTOCLink = newEl("A");
        mobileTOCLink.classList.add("tocLink");
        mobileTOCLink.href = elementToLinkTo;
        let mobileTOCLinkText = ctn(textToGrab);
        mobileTOCLink.appendChild(mobileTOCLinkText);
        mobileTOCLI.appendChild(mobileTOCLink);
        if (body.querySelectorAll("#tocList")[0] !== undefined) {
            body.querySelectorAll("#tocList")[0].appendChild(mobileTOCLI);
        }
        // INLINE TOC FOR ACCESSIBILITY
        if (body.querySelectorAll("#tableOfContentsSection") !== null) {
            let inlineTOCLI = newEl("LI");
            let inlineTOCLink = newEl("A");
            inlineTOCLink.href = elementToLinkTo;
            let inlineTOCLinkText = "";
            if (textToGrab === "Back To Menu") {
                inlineTOCLinkText = ctn("-- BACK TO MENU --");
            } else {
                inlineTOCLinkText = ctn(textToGrab);
            }
            inlineTOCLink.appendChild(inlineTOCLinkText);
            inlineTOCLI.appendChild(inlineTOCLink);
            if (body.querySelectorAll(
                    "#tableOfContentsSection"
                )[0] !== undefined) {
                body.querySelectorAll(
                    "#tableOfContentsSection"
                )[0].children[1].appendChild(inlineTOCLI);
            }
        }
    }

    if ((body.querySelectorAll("#supportSection") !== undefined) &&
        (typeof body.querySelectorAll("#supportSection") !== "object")) {
        addToEndOfTOCs("#supportSection", body.querySelectorAll(
            "#supportSection"
        )[0].children[0].innerText);
    }

    if ((body.querySelectorAll("#creditsSection") !== null) &&
        (inputArray.length > 0)) {
        addToEndOfTOCs("#creditsSection", "CREDITS");
    }

    if ((body.querySelectorAll("#footnoteSection") !== null) &&
        (inputArray.length > 0)) {
            addToEndOfTOCs("#footnoteSection", "FOOTNOTES");
    }

    if (inputArray.length > 0) {
        addToEndOfTOCs("#eReaderNotice", "NDH E-READER COPYRIGHT NOTICE");
    }

    if (footnoteSection.children.length > 0) {
        addToEndOfTOCs("#footnoteSection", "Footnotes");
    }

    if (textMetadata.menu !== "") {
        addToEndOfTOCs(textMetadata.menu, "Back to Menu");
    }

    function addCoverToAudioDiv() {
        body.querySelectorAll(
            "#audioDivIllustration"
        )[0].src = textMetadata.coverlink;
    }
    if (textMetadata.audio !== "") {
        addCoverToAudioDiv();
    }

    function addJavascriptLink() {
        let script = newEl("SCRIPT");
        script.src = "http://www.ndhfilms.com/assets/javascript/e-readerjs.js";
        body.appendChild(script);
    }
    addJavascriptLink();
    if ((inputArray.length === 0) &&
        (body.querySelectorAll("HEADER")[0].children[0].innerHTML === "")) {
        let geeH1 = newEl("H1");
        geeH1.classList.add("chapterHeading");
        let geeH1Text = ctn("GEE...");
        geeH1.appendChild(geeH1Text);
        body.insertBefore(geeH1, body.querySelectorAll("#eReaderNotice")[0]);
        let nothingHereP = newEl("P");
        let nothingHerePText = ctn("It sure is boring around here.");
        nothingHereP.appendChild(nothingHerePText);
        body.insertBefore(nothingHereP, body.querySelectorAll(
            "#eReaderNotice"
        )[0]);
    }
    html.appendChild(body);
    console.log(html);

    function createDownloadableFile(filename, fileContent) {
        let typeText = "text/html;charset=UTF-8";
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

        let link = newEl("A");
        let fullFilename = filename + "_" + currentDate + ".html";
        link.download = fullFilename;
        link.href = url;
        link.textContent = fullFilename;
        link.click();
        getById("inputOutputContainer").appendChild(link);
        getById("inputOutputContainer").innerHTML = "";
    }

    createDownloadableFile(localStorage.getItem("lastFileOpened"), doctypeHTML +
        startHTMLTag + html.innerHTML + endHTMLTag);
}