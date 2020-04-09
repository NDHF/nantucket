function supporterParser() {

    let supporterPrompt = prompt("Paste Supporter Spreadsheet Below:");

    if ((supporterPrompt === null) ||
        (supporterPrompt.trim() === "")) {
        alert("No information was entered");
    } else {
        let supportPromptToString = JSON.stringify(supporterPrompt);
        let supporterPromptArray = supportPromptToString.split("\\r\\n");
        if (supporterPromptArray[0].slice(0, 5) === "\"Name") {
            supporterPromptArray = supporterPromptArray.slice(1);
        }
        let tierArray = [];
        let supportArray = [];

        function loopSupporterPromptArray(spaItem, spaIndex) {
            let supporterPromptSubArray = spaItem.split("\\t");
            let tierName = supporterPromptSubArray[8];
            let supporterObject = {}
            supporterObject.name = supporterPromptSubArray[0];
            if (spaIndex === supporterPromptArray.length - 1) {
                supporterObject.supporterSince = Date.parse(
                    supporterPromptSubArray[16].slice(
                        0, supporterPromptSubArray[16].length - 1
                    )
                );
            } else {
                supporterObject.supporterSince = Date.parse(
                    supporterPromptSubArray[16]
                );
            }
            if (tierArray.includes(tierName) === false) {
                tierArray.push(tierName);
                let tierObject = {
                    tier: tierName,
                    value: parseInt(supporterPromptSubArray[6].slice(1)),
                    tierSupporters: []
                }
                tierObject.tierSupporters.push(supporterObject);
                supportArray.push(tierObject);
            } else {
                supportArray.forEach(function (item) {
                    if (item.tier === tierName) {
                        item.tierSupporters.push(supporterObject);
                    }
                });
            }
        }
        supporterPromptArray.forEach(loopSupporterPromptArray);
        supportArray.sort(function (a, b) {
            return b.value - a.value;
        });
        supportArray.forEach(function (item) {
            item.tierSupporters.sort(function (a, b) {
                return a.supporterSince - b.supporterSince;
            });
        });
        let finalArray = [];
        supportArray.forEach(function (item) {
            let finalArrayObject = {
                tier: item.tier,
                supporters: []
            };
            item.tierSupporters.forEach(function (item) {
                finalArrayObject.supporters.push(item.name);
            });
            finalArray.push(finalArrayObject);
        });
        let finArrStr = JSON.stringify(finalArray);
        let placeToDropText = document.createElement("TEXTAREA");
        placeToDropText.id = "forCopyingSupporterArray";
        placeToDropText.value = finArrStr;
        document.getElementById(
            "fileNameContainer"
        ).appendChild(placeToDropText);
        document.getElementById("forCopyingSupporterArray").select();
        document.execCommand("copy");
        document.getElementById("forCopyingSupporterArray").remove(0);
        alert("Copied to clipboard. Paste it into the supporter section");
    }
};