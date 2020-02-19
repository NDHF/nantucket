console.log(
    "GAM \n" +
    "A program for parsing the Shanty syntax into " +
    "the NDH E-Reader format."
)

function runGam() {

    let input = document.getElementById("textarea").value;
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
        coverArt: "",
        keyword: "",
        copyright: "",
        location: "",
        date: ""
    }

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
                    "ILLUSTRATOR", "COVERART", "KEYWORD",
                    "COPYRIGHT", "LOCATION", "DATE"
                ];
                keyIndexArray.forEach(function (kiaItem) {
                    if (inputArray[i].slice(0, (kiaItem.length + 2)) ===
                        ("!!" + kiaItem)) {
                        textMetadata[kiaItem.toLowerCase()] = inputArray[i].slice(kiaItem.length + 3);
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
    let html = document.createElement("HTML");
    let body = document.createElement("BODY");

    function createHead() {
        let head = document.createElement("HEAD");
        let headTitle = document.createElement("title");
        let headTitleText = textMetadata.title + " " +
            textMetadata.credit + " " + textMetadata.author;
        headTitle.text = headTitleText;
        head.appendChild(headTitle);
        let meta = document.createElement("META");
        meta.charset = "UTF-8";
        head.appendChild(meta);
        let stylesheet = document.createElement("LINK");
        stylesheet.rel = "stylesheet";
        stylesheet.type = "text/css";
        stylesheet.href = "http://www.ndhfilms.com/assets/style/e-readerstyle.css";
        head.appendChild(stylesheet);
        let favicon = document.createElement("LINK");
        favicon.rel = "icon";
        favicon.type = "image/gif";
        favicon.href = "http://www.ndhfilms.com/assets/images/walkingfavicon.gif";
        head.appendChild(favicon);

        html.appendChild(head);
    }
    createHead();

    function addHeader() {
        let header = document.createElement("HEADER");
        let hgroup = document.createElement("HGROUP");
        let title = document.createElement("H1");
        title.id = "title";
        let titleText = document.createTextNode(textMetadata.title);
        title.appendChild(titleText);
        let creditAndAuthor = document.createElement("H2");
        let creditAndAuthorText = document.createTextNode(textMetadata.credit +
            " " + textMetadata.author);
        creditAndAuthor.appendChild(creditAndAuthorText);
        let illustrator = document.createElement("H3");
        let illustratorText = document.createTextNode("Illustrated by " +
            textMetadata.illustrator);
        illustrator.appendChild(illustratorText);
        let coverArt = document.createElement("H3");
        let coverArtText = document.createTextNode("Cover Art by " +
            textMetadata.coverArt);
        coverArt.appendChild(coverArtText);
        hgroup.appendChild(title);
        hgroup.appendChild(creditAndAuthor);
        hgroup.appendChild(illustrator);
        hgroup.appendChild(coverArt);
        header.appendChild(hgroup);
        body.appendChild(header);
    }
    addHeader();

    function addKeyword() {
        let keyword = document.createElement("SPAN");
        keyword.id = "keyword";
        body.appendChild(keyword);
    }
    addKeyword();

    function addButtons() {
        let buttonContainerDiv = document.createElement("DIV");
        buttonContainerDiv.classList.add("menuClosed");
        buttonContainerDiv.id = "buttonContainer";
        buttonContainerDiv.innerHTML = "<div id='menuIconDiv' class='buttons' onclick=''>" +
        "<img id='menuIconImg' src='../../assets/images/menuicon_black.svg' />" +
    "</div> " +
    // "<div id='tocIconDiv' class='buttons' onclick=''>" +
    //     "<object id='tocIconObject' type='image/svg+xml' data='../../assets/images/tocicon.svg'>" +
    //         "Your browser does not support SVG" +
    //     "</object>" +
    // "</div>" +
    "<div id='lightbulbDiv' class='buttons' onclick=''>" +
        "<object ID='lightbulbObject' type='image/svg+xml' data='../../assets/images/lightbulb.svg'>" +
            "Your browser does not support SVG" +
        "</object>" +
    "</div>" +
    "<div id='bookmarkDiv' class='buttons'>" +
        "<object id='bookmarkObject' type='image/svg+xml' data='../../assets/images/bookmark.svg'>" +
            "Your browser does not support SVG" +
        "</object>" +
    "</div>" +
    "<div id='cassetteDiv' class='buttons'>" +
        "<object id='cassetteObject' type='image/svg+xml' data='../../assets/images/cassette.svg'> " +
            "Your browser does not support SVG" +
        "</object>" +
    "</div>" +
    "<div id='monetizationDiv' class='buttons'>" +
        "<a href='http://www.patreon.com/NDHFilms'>" +
            "<img id='monetizationIcon' src='../../assets/images/monetization_black.svg' />" +
        "</a>" +
    "</div>" +
    "<div id='starDiv' class='buttons'>" +
        "<object id='starObject' type='image/svg+xml' data='../../assets/images/star.svg'>" +
            "Your browser does not support SVG" +
        "</object>" +
    "</div>";
    body.appendChild(buttonContainerDiv);
    }
    addButtons();

    function addText() {
        let illustrationCounter = 0;

        function appendInputArrayToBody(item, index) {
            if (item === "[break]") {
                let hr = document.createElement("HR");
                hr.classList.add("style-two");
                body.appendChild(hr);
            } else if (item.slice(0, 10) === "@@COVERIMG") {
                let coverImageLink = document.createElement("A");
                coverImageLink.href = item.slice(11);
                let coverImage = document.createElement("IMG");
                coverImage.id = "coverImg";
                coverImage.src = item.slice(11);
                coverImageLink.appendChild(coverImage);
                body.insertBefore(coverImageLink, body.childNodes[0]);
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
                            illoMetadataObject.small = illoMetadataArray[index + 1];
                        } else if (item === ":large") {
                            illoMetadataObject.large = illoMetadataArray[index + 1];
                        } else if (item === ":buy") {
                            illoMetadataObject.buy = illoMetadataArray[index + 1];
                        } else if (item === ":caption") {
                            let illoCaption = illoMetadataArray.slice((index + 1));
                            illoCaption = illoCaption.join(" ");
                            illoCaption = illoCaption.replace(/\\"/g, "");
                            illoMetadataObject.caption = illoCaption;
                        } else if (item === ":orientation") {
                            console.log(true);
                            illoMetadataObject.orientation = illoMetadataArray[index + 1];
                            console.log(illoMetadataObject.orientation);
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
                    let imgThumbnail = document.createElement("IMG");
                    imgThumbnail.id = "illustration" + illustrationNumber;
                    imgThumbnail.classList.add("illustrationTarget");
                    imgThumbnail.src = illoMetadataObject.small;
                    body.appendChild(imgThumbnail);
                }
                createIllustrationThumbnail();

                function createEnlargeIcon() {
                    let enlargeIcon = document.createElement("IMG");
                    enlargeIcon.classList.add("enlargeIcon");
                    enlargeIcon.src = "http://www.ndhfilms.com/assets/images/enlargeicon_black.svg";
                    body.appendChild(enlargeIcon);
                }
                createEnlargeIcon();

                function createIllustrationDiv() {
                    let illustrationDiv = document.createElement("DIV");
                    illustrationDiv.classList.add("illustrationDiv");
                    illustrationDiv.classList.add("standby");

                    let closeButton = document.createElement("IMG");
                    closeButton.classList.add("closeButton");
                    closeButton.src = "http://www.ndhfilms.com/assets/images/closeButton.svg";
                    illustrationDiv.appendChild(closeButton);

                    let container = document.createElement("DIV");
                    container.classList.add("container");

                    let flexbox1 = document.createElement("DIV");
                    flexbox1.classList.add("flexbox1");

                    let fullImage = document.createElement("IMG");
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

                    let flexbox2 = document.createElement("DIV");
                    flexbox2.classList.add("illustrationCaptionDiv");
                    flexbox2.classList.add("flexbox2");
                    let flexbox2Hgroup = document.createElement("HGROUP");
                    flexbox2Hgroup.classList.add("illustrationCaption");
                    let caption = document.createElement("H2");
                    captionText = document.createTextNode(illoMetadataObject.caption);
                    caption.appendChild(captionText);
                    flexbox2Hgroup.appendChild(caption);
                    let illustratorInfo = document.createElement("H3");
                    illustratorInfoText = document.createTextNode("Illustration by " +
                        textMetadata.illustrator);
                    illustratorInfo.appendChild(illustratorInfoText);
                    flexbox2Hgroup.appendChild(illustratorInfo);
                    flexbox2.appendChild(flexbox2Hgroup);
                    container.appendChild(flexbox2);
                    illustrationDiv.appendChild(container);
                    body.appendChild(illustrationDiv);
                }
                createIllustrationDiv();

            } else {
                let paragraph = document.createElement("P");
                paragraph.innerHTML = item.replace(/\\"/g, "\"");
                body.appendChild(paragraph);
            }
        }
        inputArray.forEach(appendInputArrayToBody);
    }
    addText();

    function addCompletionLocationAndDate() {
        let ul = document.createElement("UL");
        ul.classList.add("mainTextUL");
        ul.id = "endingDate";
        let location = document.createElement("LI");
        let locationText = document.createTextNode(textMetadata.location);
        location.appendChild(locationText);
        let date = document.createElement("LI");
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
        let completionTime = document.createElement("TIME");
        completionTime.datetime = dateText;

        date.innerHTML = month + " " + day + ", " + year;
        ul.appendChild(location);
        ul.appendChild(date);
        body.appendChild(ul);
    }
    addCompletionLocationAndDate();

    function addCopyright() {
        let copyright = document.createElement("P");
        copyright.id = "copyrightNotice";
        copyright.classList.add("center");
        let copyrightArray = textMetadata.copyright.split(" ");
        let copyrightDate = copyrightArray[0];
        let copyrightHolder = copyrightArray.slice(1).join(" ");
        copyright.innerHTML = "&COPY; " + "<time datetime='" +
            copyrightDate + "'>" + copyrightDate + "</time>" +
            " " + copyrightHolder;
        body.appendChild(copyright);
    }
    addCopyright();

    function addCredits() {
        let creditsSection = document.createElement("SECTION");
        creditsSection.classList.add("endingSection");
        creditsSection.id = "creditsSection";
        let creditsSectionHeader = document.createElement("H3");
        creditsSectionHeader.classList.add("sectionHeader");
        creditsSectionHeaderText = document.createTextNode("CREDITS");
        creditsSectionHeader.appendChild(creditsSectionHeaderText);
        creditsSection.appendChild(creditsSectionHeader);
        let creditsUL = document.createElement("UL");
        creditsUL.classList.add("mainTextUL");
        creditsUL.id = "creditsList";
        let authorCredit = document.createElement("LI");
        let authorCreditText = document.createTextNode("Written by " +
            textMetadata.author);
        authorCredit.appendChild(authorCreditText);
        creditsUL.appendChild(authorCredit);
        let coverArtCredit = document.createElement("LI");
        let coverArtCreditText = document.createTextNode("Cover Art by " +
            textMetadata.coverArt);
        coverArtCredit.appendChild(coverArtCreditText);
        creditsUL.appendChild(coverArtCredit);
        let illustratorCredit = document.createElement("LI");
        let illustratorCreditText = document.createTextNode("Illustrated by " +
            textMetadata.illustrator);
        illustratorCredit.appendChild(illustratorCreditText);
        creditsUL.appendChild(illustratorCredit);
        creditsSection.appendChild(creditsUL);
        body.appendChild(creditsSection);
    }
    addCredits();

    function addEReaderNotice() {
        let eReaderNotice = document.createElement("P");
        eReaderNotice.id = "eReaderNotice";
        let eReaderNoticeText = document.createTextNode("This e-Reader was " +
            "developed by Nicholas Bernhard. No part of the source code or " +
            "user interface can be used without explicit permission from the " +
            "developer. For licensing information, send an email to " +
            "Nicholas[at]NDHFilms[dot][com].");
        eReaderNotice.appendChild(eReaderNoticeText);
        body.appendChild(eReaderNotice);
    }
    addEReaderNotice();

    function addJavascriptLink() {
        let script = document.createElement("SCRIPT");
        script.src = "http://www.ndhfilms.com/assets/javascript/e-readerjs.js";
        body.appendChild(script);
    }
    addJavascriptLink();
    html.appendChild(body);

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

        let link = document.createElement("A");
        let fullFilename = filename + "_" + currentDate + ".html";
        link.download = fullFilename;
        link.href = url;
        link.textContent = fullFilename;
        link.click();
        document.getElementById("inputOutputContainer").appendChild(link);
        document.getElementById("inputOutputContainer").innerHTML = "";
    }

    createDownloadableFile(localStorage.getItem("lastFileOpened"), html.innerHTML);

}