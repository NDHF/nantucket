/*
TODO 2020-03-06NJB ADD @@RAW and @@RAWEND tags, where pure HTML can be placed 
in-between.

TODO 2020-03-06NJB Add something similar to the above RAW idea, but strictly
for <pre> tag in HTML. EXAMPLE: The mouse's poem in Chapter 3 of Alice in
Wonderland

TODO 2020-03-06NJB Something similar to RAW, but for tables (could use a CSV
format)

TODO 2020-0306NJB Finish up the table of contents, with the notices and
credits at the end, and close button on the mobile div.
*/

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
        stylesheet: []
    };

    let illustrationArray = [];
    let chapterArray = [];
    let audioSourceArray = [];
    let monetizationObject = "";

    function removeThingsAndGatherMetadata() {
        let i = 0;
        for (i; i < inputArray.length; i += 1) {
            if ((inputArray[i].slice(0, 2) === "//") ||
                (inputArray[i] === "")) {
                inputArray.splice(i, 1);
                if (i >= 2) {
                    i -= 2;
                } else {
                    i = 0;
                }
            } else if ((inputArray[i].slice(0, 2) === "!!")) {
                let keyIndexArray = [
                    "TITLE", "SUBTITLE", "CREDIT", "AUTHOR",
                    "ILLUSTRATOR", "COVERART", "COVERARTDESC",
                    "KYWD", "COPYRIGHT", "LOCATION", "DATE",
                    "LANG", "ICON", "DESC", "KEYWORDS", "AUDIO",
                    "MONETIZELINK", "MONETIZEICON", "SMALL",
                    "STYLESHEET"
                ];
                keyIndexArray.forEach(function (kiaItem) {
                    if (inputArray[i].slice(0, (kiaItem.length + 2)) ===
                        ("!!" + kiaItem)) {
                        if (kiaItem === "SMALL") {
                            textMetadata.small = "small";
                        } else if (kiaItem === "STYLESHEET") {
                            textMetadata.stylesheet.push(inputArray[i].slice(0, 12));
                        } else {
                            textMetadata[kiaItem.toLowerCase()] = inputArray[i].slice(kiaItem.length + 3);
                        }
                    }
                });
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
        monetizationObject = "<div id='monetizationDiv' class='buttons'><a href='[monetizationLink]'><img id='monetizationIcon' src='../../assets/images/[monetizationIcon].svg' /></a></div>";
        monetizationObject = monetizationObject.replace("[monetizationLink]", textMetadata.monetizelink);
        monetizationObject = monetizationObject.replace("[monetizationIcon", textMetadata.monetizeicon);
    }

    function replaceThings(item, index) {
        // Replace asterisks with hr tag

        if (item.length === 4) {
            inputArray[index] = item.replace("****", "[break]");
        } else {
            inputArray[index] = item.replace(/\*\*(.*?)\*\*/gm, "<b>$1</b>");
            inputArray[index] = item.replace(/\*(.*?)\*/gm, "<i>$1</i>");
        }

        // TODO 2020-02-15NJB Replace @@L with lyrics formatting
    }
    inputArray.forEach(replaceThings);

    let doctypeHTML = "<!DOCTYPE html>";
    let html = newEl("HTML");
    let startHTMLTag = "<html lang='[lang]'>";
    if (textMetadata.lang !== "") {
        startHTMLTag = startHTMLTag.replace("[lang]", textMetadata.lang.toLowerCase());
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
        let headTitle = newEl("title");
        let headTitleText = textMetadata.title + " " +
            textMetadata.credit + " " + textMetadata.author;
        headTitle.text = headTitleText;
        head.appendChild(headTitle);
        // Add viewport meta tag
        // let viewportTag = newEl("META");
        // viewportTag.name = "viewport";
        // viewportTag.content = "width=device-width, initial-scale=1.0";
        // head.appendChild(viewportTag);
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
        // Add stylesheet
        function buildStylesheetTag(link) {
            let stylesheet = newEl("LINK");
            stylesheet.rel = "stylesheet";
            stylesheet.type = "text/css";
            stylesheet.href = link;
            head.appendChild(stylesheet);
        }
        buildStylesheetTag("http://www.ndhfilms.com/assets/style/e-readerstyle.css");
        // CHECK FOR OTHER STYLESHEETS
        if (textMetadata.stylesheet.length > 0) {
            function loopThroughStylesheetArray(item) {
                buildStylesheetTag(item);
            }
            textMetadata.stylesheet.forEach(loopThroughStylesheetArray);
        }
        let favicon = newEl("LINK");
        favicon.rel = "icon";
        favicon.type = "image/gif";
        // If no alternate source for icon is specified,
        // default to my icon.
        let iconSource = "http://www.ndhfilms.com/assets/images/walkingfavicon.gif";
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

    function addHeader() {
        let header = newEl("HEADER");
        // header.id = "header";
        let hgroup = newEl("HGROUP");
        let title = newEl("H1");
        title.id = "title";
        let titleText = ctn(textMetadata.title);
        title.appendChild(titleText);
        hgroup.appendChild(title);
        let creditAndAuthor = newEl("H2");
        let creditAndAuthorText = ctn(textMetadata.credit +
            " " + textMetadata.author);
        creditAndAuthor.appendChild(creditAndAuthorText);
        hgroup.appendChild(creditAndAuthor);
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

    function addKeyword() {
        let keyword = newEl("SPAN");
        keyword.id = "keyword";
        let keywordText = ctn(textMetadata.kywd);
        keyword.appendChild(keywordText);
        body.appendChild(keyword);
    }
    addKeyword();

    function addButtons() {
        let buttonContainerDiv = newEl("DIV");
        buttonContainerDiv.classList.add("menuClosed");
        buttonContainerDiv.id = "buttonContainer";
        let buttonArray = [
            "<div id='menuIconDiv' class='buttons' onclick=''>" +
            "<img id='menuIconImg' " +
            "src='../../assets/images/menuicon_black.svg' />" +
            "</div>",
            "<div id='tocIconDiv' class='buttons' onclick=''>" +
            "<object id='tocIconObject'" +
            "type='image/svg+xml' data='../../assets/images/tocicon.svg'>" +
            "Your browser does not support SVG</object></div>",
            "<div id='lightbulbDiv' class=' buttons' onclick=''>" +
            "<object ID='lightbulbObject'" +
            "type='image/svg+xml' data='../../assets/images/lightbulb.svg'>" +
            "Your browser does not support SVG</object></div>",
            "<div id='bookmarkDiv'" +
            "class='buttons'>" +
            "<object id='bookmarkObject' type='image/svg+xml'" +
            "data='../../assets/images/bookmark.svg'>" +
            "Your browser does not support SVG</object></div>",
            "<div id='cassetteDiv' class='buttons'>" +
            "<object id='cassetteObject' type='image/svg+xml'" +
            "data='../../assets/images/cassette.svg'>" +
            "Your browser does not support SVG</object></div>",
            "<div id='starDiv' class='buttons'>" +
            "<object id='starObject'" +
            " type='image/svg+xml' data='../../assets/images/star.svg'>" +
            "Your browser does not support SVG</object></div>"
        ];
        if (monetizationObject !== "") {
            buttonArray.push(monetizationObject)
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

        let audioDivObject = {}

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
        let audioCloseButton = newEl("IMG");
        audioCloseButton.id = "audioCloseButton";
        audioCloseButton.classList.add("closeButton");
        audioCloseButton.src = "http://www.ndhfilms.com/assets/images/" +
        "closeButton.svg";
        audioDiv.appendChild(audioCloseButton);
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
        hAudioCopyrightText = "Audio Recording &COPY; " +
            audioDivObject.copyright;
        hAudioCopyright.innerHTML = hAudioCopyrightText;
        audioInfoHgroup.appendChild(hAudioCopyright);
        let hAudioCredits = newEl("H3");
        let hAudioCreditsLink = newEl("A");
        hAudioCreditsLink.id = "audioCreditsLink";
        hAudioCreditsLink.href = "#creditsSection";
        hAudioCreditsLink.onclick = true;
        hAudioCreditsText = ctn("CREDITS");
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
        let audioElement = newEl("AUDIO");
        audioElement.id = "audioElement";
        audioElement.controls = true;
        audioCassetteDiv.appendChild(audioElement);
        container.appendChild(audioCassetteDiv);
        audioDiv.appendChild(container);
        body.appendChild(audioDiv);
    }
    addAudioDiv();

    function addText() {
        let illustrationCounter = 0;

        function appendInputArrayToBody(item, index) {
            if (item === "[break]") {
                let hr = newEl("HR");
                hr.classList.add("style-two");
                body.appendChild(hr);
            } else if (item.slice(0, 10) === "@@COVERIMG") {
                let coverImageLink = newEl("A");
                textMetadata.coverlink = item.slice(11);
                coverImageLink.href = textMetadata.coverlink;
                let coverImage = newEl("IMG");
                coverImage.id = "coverImg";
                if (textMetadata.coverartdesc !== "") {
                    coverImage.title = textMetadata.coverartdesc;
                    coverImage.alt = textMetadata.coverartdesc;
                } else {
                    coverImage.title = "Cover of " + textMetadata.title +
                        " by " + textMetadata.coverArt;
                    coverImage.alt = "Cover of " + textMetadata.title +
                        " by " + textMetadata.coverArt;
                }
                coverImage.src = textMetadata.coverlink;
                coverImageLink.appendChild(coverImage);
                body.insertBefore(coverImageLink, body.childNodes[0]);
                illustrationArray.push({
                    link: "#coverImg",
                    text: "Cover"
                });
            } else if (item.slice(0, 8) === "@@BLOCKQ") {
                let blockquoteContents = item.slice(8);
                let blockquote = newEl("BLOCKQUOTE");
                let blockquoteText = ctn(blockquoteContents);
                blockquote.appendChild(blockquoteText);
                body.appendChild(blockquote);
            } else if (item.slice(0, 11) === "@@QUOTEATTR") {
                let blockquoteAttrContent = " - " + item.slice(11);
                let blockquoteAttr = newEl("P");
                blockquoteAttr.classList.add("blockquoteAttr");
                let blockquoteAttrText = ctn(blockquoteAttrContent);
                blockquoteAttr.appendChild(blockquoteAttrText);
                body.appendChild(blockquoteAttr);
            } else if (item.slice(0, 9) === "@@SUPPORT") {
                let supportArray = item.slice(9).split(" ");
                if ((supportArray.includes(":title") === false) ||
                (supportArray.includes(":text") === false)) {
                    alert("@@SUPPORT section is missing required information");
                    return;
                }
                let supportObject = {
                    title: "",
                    text: ""
                }
                function loopThroughSupportArray(saItem, saIndex) {
                    let supportTitleString = "";
                    let supportTextString = "";
                    let saI = 0;
                    if (saItem === ":title") {
                        for (saI = saIndex + 1; saI < supportArray.indexOf(":text"); saI += 1) {
                            supportTitleString = supportTitleString.concat(" " + supportArray[saI]);
                        }
                        saI = 0;
                        supportObject.title = supportTitleString;
                    } else if (saItem === ":text") {
                        console.log(true);
                        for (saI = saIndex +
                            1; saI < supportArray.length; saI += 1) {
                            console.log(supportArray[saI]);
                            supportTextString = supportTextString.concat(" " +
                            supportArray[saI]);
                        }
                        saI = 0;
                        console.log(supportTextString);
                        supportObject.text = supportTextString;
                    }
                }
                supportArray.forEach(loopThroughSupportArray);
                let supportSection = newEl("SECTION");
                supportSection.classList.add("endingSection");
                supportSection.id = "supportSection";
                let supportSectionH3 = newEl("H3");
                let supportSectionH3Text = ctn(supportObject.title);
                supportSectionH3.appendChild(supportSectionH3Text);
                supportSection.appendChild(supportSectionH3);
                let supportSectionTextDiv = newEl("DIV");
                supportSectionTextDiv.innerHTML = supportObject.text;
                supportSection.appendChild(supportSectionTextDiv);
                body.appendChild(supportSection);
            } else if (item.slice(0, 6) === "@@ILLO") {
                illustrationCounter += 1;
                let illoMetadataObject = {};

                function getImageMetadata() {
                    illoMetadataArray = item.split(" ");
                    if ((illoMetadataArray.includes(":small") === false) ||
                        (illoMetadataArray.includes(":large")) === false) {
                        alert("required illustration data missing.");
                    }

                    function addIlloMetadataToObject(item, index) {
                        if (item === ":small") {
                            illoMetadataObject.small = illoMetadataArray[index +
                                1];
                        } else if (item === ":large") {
                            illoMetadataObject.large = illoMetadataArray[index +
                                1];
                        } else if (item === ":buy") {
                            illoMetadataObject.buy = illoMetadataArray[index +
                                1];
                        } else if (item === ":caption") {
                            let illoCaption = illoMetadataArray.slice((index +
                                1));
                            illoCaption = illoCaption.join(" ");
                            illoCaption = illoCaption.replace(/\\"/g, "");
                            illoMetadataObject.caption = illoCaption;
                        } else if (item === ":orientation") {
                            illoMetadataObject.orientation = illoMetadataArray[index + 1];
                        } else if (item === ":desc") {
                            illoMetadataObject.desc = illoMetadataArray[index +
                                1];
                        } else if (item === ":illustrator") {
                            illoMetadataObject.illustrator = illoMetadataArray[index + 1];
                        }
                    }
                    illoMetadataArray.forEach(addIlloMetadataToObject);
                }
                getImageMetadata();

                function createIllustrationThumbnail() {
                    let illustrationNumber = "";
                    if (illustrationCounter < 10) {
                        illustrationNumber = "0" + illustrationCounter;
                    } else {
                        illustrationNumber = illustrationCounter;
                    }
                    let imgThumbnail = newEl("IMG");
                    imgThumbnail.id = "illustration" + illustrationNumber;

                    illustrationArray.push({
                        link: "#" + imgThumbnail.id,
                        text: illoMetadataObject.caption
                    });
                    if ((illoMetadataObject.desc !== undefined) &&
                        (illoMetadataObject.desc !== "")) {
                        imgThumbnail.title = illoMetadataObject.desc;
                        imgThumbnail.alt = illoMetadataObject.desc;
                    } else {
                        imgThumbnailMeta = "Illustration for " +
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
                    imgThumbnail.src = illoMetadataObject.small;
                    body.appendChild(imgThumbnail);
                }
                createIllustrationThumbnail();

                function createEnlargeIcon() {
                    let enlargeIcon = newEl("IMG");
                    enlargeIcon.classList.add("enlargeIcon");
                    enlargeIcon.alt = "Click or tap to enlarge illustration";
                    enlargeIcon.src = "http://www.ndhfilms.com/assets/images/" +
                        "enlargeicon_black.svg";
                    body.appendChild(enlargeIcon);
                }
                createEnlargeIcon();

                function createIllustrationDiv() {
                    let illustrationDiv = newEl("DIV");
                    illustrationDiv.classList.add("illustrationDiv");
                    illustrationDiv.classList.add("standby");

                    let closeButton = newEl("IMG");
                    closeButton.alt = "Click or tap to close";
                    closeButton.classList.add("closeButton");
                    closeButton.src = "http://www.ndhfilms.com/assets/images/" +
                        "closeButton.svg";
                    illustrationDiv.appendChild(closeButton);

                    let container = newEl("DIV");
                    container.classList.add("container");

                    let flexbox1 = newEl("DIV");
                    flexbox1.classList.add("flexbox1");

                    let fullImage = newEl("IMG");
                    fullImage.classList.add("illustration");
                    fullImage.classList.add(illoMetadataObject.orientation +
                        "Illustration");
                    fullImage.alt = "Illustration for " + textMetadata.title +
                        " by " + textMetadata.illustrator;
                    fullImage.title = "Illustration by " +
                        textMetadata.illustrator;
                    fullImage.src = illoMetadataObject.large;
                    flexbox1.appendChild(fullImage);
                    container.appendChild(flexbox1);

                    let flexbox2 = newEl("DIV");
                    flexbox2.classList.add("illustrationCaptionDiv");
                    flexbox2.classList.add("flexbox2");
                    let flexbox2Hgroup = newEl("HGROUP");
                    flexbox2Hgroup.classList.add("illustrationCaption");
                    let caption = newEl("H2");
                    captionText = ctn(illoMetadataObject.caption);
                    caption.appendChild(captionText);
                    flexbox2Hgroup.appendChild(caption);
                    let illustratorInfo = newEl("H3");
                    illustratorInfoText = ctn("Illustration by " +
                        textMetadata.illustrator);
                    illustratorInfo.appendChild(illustratorInfoText);
                    flexbox2Hgroup.appendChild(illustratorInfo);
                    flexbox2.appendChild(flexbox2Hgroup);
                    container.appendChild(flexbox2);
                    illustrationDiv.appendChild(container);
                    body.appendChild(illustrationDiv);
                }
                createIllustrationDiv();
            } else if (item.slice(0, 7) === "@@AUDIO") {
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
                function createChapterHeading(headingType) {
                    let chapterHeading = "";
                    let chapterHeadingText = "";
                    // sh is the chapter subheading
                    let sh = "";
                    if (headingType === "heading") {
                        chapterHeading = newEl("H1");
                        chapterHeadingText = item.slice(1);
                        let chapterHeadingID = chapterHeadingText.replace(" ", "_");
                        chapterHeading.id = chapterHeadingID;
                        let chapterObject = {
                            link: "#" + chapterHeadingID
                        }
                        if (inputArray[index + 1].slice(0, 2) === "##") {
                            sh = inputArray[index + 1].slice(2);
                        }
                        chapterObject.text = chapterHeadingText + ": " + sh;
                        chapterArray.push(chapterObject);
                    } else if (headingType === "subheading") {
                        chapterHeading = newEl("H2");
                        chapterHeadingText = item.slice(2);
                    }
                    chapterHeading.classList = "chapterHeading";
                    let chapterHeadingNode = ctn(chapterHeadingText);
                    chapterHeading.appendChild(chapterHeadingNode);
                    body.appendChild(chapterHeading);
                }
                if ((item.charAt(0) === "#") && (item.charAt(1) !== "#")) {
                    createChapterHeading("heading");
                } else if ((item.charAt(0) === "#") &&
                    (item.charAt(1) === "#")) {
                    createChapterHeading("subheading");
                }
            } else {
                let paragraph = newEl("P");
                paragraph.innerHTML = item.replace(/\\"/g, "\"");
                body.appendChild(paragraph);
            }
        }
        inputArray.forEach(appendInputArrayToBody);
    }
    addText();

    function createTableOfContents() {
        // PREPARE TABLES OF CONTENTS
        // TOC SELECT FOR DESKTOP
        let desktopTOCSelect = newEl("SELECT");
        desktopTOCSelect.id = "tocSelect";
        desktopTOCSelect.classList.add("selectClosed");
        let placeholder = newEl("OPTION");
        placeholder.id = "firstOption";
        placeholder.value = "placeholder";
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
                    sectionText = "SECTIONS"
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
                tocSectionIllustrPlaceholderH3.appendChild(tocSectionIllustrPlaceholderH3Text);
                tocSectionIllustrPlaceholder.appendChild(tocSectionIllustrPlaceholderH3);
                tocSecList.appendChild(tocSectionIllustrPlaceholder);

                // LOOP THROUGH ILLUSTRATION ARRAY

                function loopThroughIllustrationArray(item, index) {
                    // TOC SELECT FOR DESKTOP
                    let tocSelectIllustrOption = newEl("OPTION");
                    tocSelectIllustrOption.value = item.link;
                    let tocSelectIllustrOptionText = ctn(
                        item.text
                    );
                    tocSelectIllustrOption.appendChild(tocSelectIllustrOptionText);
                    desktopTOCSelect.appendChild(tocSelectIllustrOption);
                    // TOC DIV FOR MOBILE
                    let mobileTOCDivIllustrLI = newEl("LI");
                    if ((mode === "illustrations") && (item.text !== "Cover")) {
                        mobileTOCDivIllustrLI.classList.add("listItalic");
                    }
                    let mobileTOCDivIllustrLink = newEl("A");
                    mobileTOCDivIllustrLink.classList.add("tocLink");
                    mobileTOCDivIllustrLink.href = item.link;
                    mobileTOCDivIllustrLinkText = ctn(
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
                    tocSectionIllustrLink = newEl("A");
                    tocSectionIllustrLink.href = item.link;
                    tocSectionIllustrLinkText = ctn(
                        item.text
                    );
                    tocSectionIllustrLink.appendChild(tocSectionIllustrLinkText);
                    tocSectionIllustrLI.appendChild(tocSectionIllustrLink);
                    tocSecList.appendChild(tocSectionIllustrLI);
                }
                array.forEach(loopThroughIllustrationArray);
            }
        }

        prepareATOCList(illustrationArray, "illustrations");
        prepareATOCList(chapterArray, "chapters");

        // CREATE AND APPEND CLOSE BUTTON

        let tocCloseButton = newEl("IMG");
        tocCloseButton.id = "audioCloseButton";
        tocCloseButton.classList.add("closeButton");
        tocCloseButton.src = "http://www.ndhfilms.com/assets/images/" +
        "closeButton.svg";
        mobileTOCDiv.appendChild(tocCloseButton);

        desktopTOCSection.appendChild(tocSecList);
        body.getElementsByTagName("HEADER")[0].parentNode.insertBefore(desktopTOCSelect, body.getElementsByTagName("HEADER")[0].nextSibling);
        body.getElementsByTagName("HEADER")[0].parentNode.insertBefore(mobileTOCDiv, body.getElementsByTagName("HEADER")[0].nextSibling);
        if (textMetadata.small !== "small") {
            body.getElementsByTagName("HEADER")[0].parentNode.insertBefore(desktopTOCSection, body.getElementsByTagName("HEADER")[0].nextSibling);
        }
    }
    createTableOfContents();

    function createAudioSourceMenu() {
        if (audioSourceArray.length === 0) {
            body.querySelector("#cassetteDiv").remove();
            body.querySelector("#audioDiv").remove();
        } else {
            let audioSourceSelect = newEl("SELECT");
            audioSourceSelect.id = "audioSourceSelect";

            function loopThroughAudioSourceArray(item, index) {
                let audioSourceOption = newEl("OPTION");
                audioSourceOption.value = item.source;
                let audioSourceOptionText = ctn(item.title);
                audioSourceOption.appendChild(audioSourceOptionText);
                audioSourceSelect.appendChild(audioSourceOption);
            }
            audioSourceArray.forEach(loopThroughAudioSourceArray);
            if (audioSourceArray.length === 1) {
                audioSourceSelect.disabled = true;
            }
            body.querySelector("#audioCassetteDiv").insertBefore(audioSourceSelect, body.querySelector("#audioCassetteDiv").childNodes[0]);
        }
    }
    createAudioSourceMenu();

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
        body.appendChild(ul);
    }
    addCompletionLocationAndDate();

    function addCopyright() {
        let copyright = newEl("P");
        copyright.id = "copyrightNotice";
        copyright.classList.add("center");
        let copyrightArray = textMetadata.copyright.split(" ");
        let copyrightDate = copyrightArray[0];
        let copyrightSymbolCode = "&COPY; ";
        let timeElement = "<time datetime='" + copyrightDate + "'>" +
            copyrightDate + "</time>";
        let copyrightHolder = copyrightArray.slice(1).join(" ");
        if (copyrightDate === "PUBLIC") {
            copyrightDate = textMetadata.copyright;
            copyrightSymbolCode = "<s>&COPY;</s> ";
            timeElement = "";
            copyrightHolder = "";
        }

        copyright.innerHTML = copyrightSymbolCode + timeElement +
            copyrightDate + " " + copyrightHolder;
        body.appendChild(copyright);
    }
    addCopyright();

    function addCredits() {
        let creditsSection = newEl("SECTION");
        creditsSection.classList.add("endingSection");
        creditsSection.id = "creditsSection";
        let creditsSectionHeader = newEl("H3");
        creditsSectionHeader.classList.add("sectionHeader");
        creditsSectionHeaderText = ctn("CREDITS");
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
    addCredits();

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

    function addCoverToAudioDiv() {
        body.querySelectorAll("#audioDivIllustration").src = textMetadata.coverlink;
    }
    addCoverToAudioDiv();

    function addJavascriptLink() {
        let script = newEl("SCRIPT");
        script.src = "http://www.ndhfilms.com/assets/javascript/e-readerjs.js";
        body.appendChild(script);
    }
    addJavascriptLink();
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
};