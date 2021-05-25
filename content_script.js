var settings;

const initCss = () => {
        let style = document.createElement("style");
        style.innerHTML = `
        .extension-trigger-word:hover{
            z-index:999999 !important;
        }
        .extension-trigger-word {
            /*color:${settings["highlights-text-color"]} !important;
            background-color:${settings["highlights-background-color"]} !important;*/
            position:relative !important;
        }

        .extension-static-link{
            position:absolute                 !important;
            left: 0                          !important; 
            top: 0 ;
            right: 0;
            width: 100%;
            height: 100%;
            /*height:${settings["image-height"]}!important;
            width:${settings["image-width"]}  !important;*/
            padding:0px                       !important;
            margin: auto                        !important;
            box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px !important;
        }
        .extension-static-link img{
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            margin: auto;
            max-width: 140px;
            z-index: 1000000000;
        }`;

    document.getElementsByTagName('head')[0].appendChild(style);
}


const detectBodyChanges = () => {
    let parentObserved = document.querySelector("body");
    let observer = new MutationObserver((mutations) => {
        let check = false;
        let mutationsLength = mutations.length;
        for (let i = 0; i < mutationsLength; i++) {
            if (mutations[i].addedNodes || mutations[i].removedNodes) {
                check = true;
                break;

            }
        }
        if (check) {
            checkWords();
            console.log("DOMCHANGES");
        }
    });
    observer.observe(parentObserved, {
        attributes: true,
        childList: true,
        characterData: true
    });
}



const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
}



const getElementListContains = (text) => {
    let list = document.evaluate(`//*[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'),'${text.toLowerCase()}')]`, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    let arr = [];
    for (let i = 0; i < list.snapshotLength; i++) {
        let next = list.snapshotItem(i);
        if (next) {
            if (next.classList.contains("extension-trigger-word") == false && next.tagName != "SCRIPT" && next.tagName != "STYLE" && next.tagName != "NOSCRIPT" && next.tagName != "TITLE") {
                arr.push(next);
            }
        }
    }
    return arr;
}

const wrapTextWithExtensionSpan = (element, text) => {
    // element.childNodes.forEach((item) => {
    //     if (item.nodeType == 3 && item.nodeValue.trim() != "") {
    //         let regex = new RegExp(text, "gi");
    //         let regList = item.nodeValue.match(regex);
    //         if (regList) {
    //             regList.forEach((reg) => {
    //                 let spanInnerHTML = `
    //                 <span class="extension-trigger-word" >
    //                         ${reg}
    //                         <a target="_blank" href="${settings.static_url}" class="extension-static-link ${getRandomPictureClass()}">
    //                             <img src = "${chrome.runtime.getURL(`asset/${Math.ceil(Math.random() *settings.image_list.length)}.png`)}"
    //                         </a>
    //                     </span>
    //                 </span>`;
    //                 element.innerHTML = element.innerHTML.replace(item.nodeValue, item.nodeValue.replaceAll(reg, spanInnerHTML));
    //             });
    //         }
    //     }


        
    // });

    let regex = new RegExp(text, "gi");
    let regList = element.textContent.match(regex);
    console.log(element);
    if (regList) {
        regList.forEach((reg) => {
            
            let spanInnerHTML = `
            <span class="extension-trigger-word" >
                    ${reg}
                    <a target="_blank" href="${settings.static_url}" class="extension-static-link">
                        <img src = "${chrome.runtime.getURL(`asset/${Math.ceil(Math.random() *settings.image_count)}.${settings.image_format}`)}">
                    </a>
            </span>`;

            element.innerHTML = element.innerHTML.replace(reg, spanInnerHTML);
        });
    }

    // element.querySelectorAll(".extension-trigger-word").forEach(i => {
    //     i.addEventListener("click", (e) => {
    //         window.open(settings.static_url, "_blank");
    //         e.preventDefault();
    //         return false;
    //     });
    // });
    
    return element;
}

const checkWords = () => {
    settings.trigger_words.forEach(word => {
        let elements = getElementListContains(word);
        elements.forEach(element => {
            wrapTextWithExtensionSpan(element, word);
        });
    });
}

const startExtension = () => {
    initCss();
    checkWords();
    detectBodyChanges();
}


window.onload = () => {
    chrome.storage.local.get("settings", (data) => {
        settings = data.settings;
        if (!settings.isDateInPast) {
            startExtension();
        }
    });
}