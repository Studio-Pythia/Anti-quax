//----------------------------SETTINGS----------------------------------

const settings = {
    "static_url": "https://www.studiopythia.com/anti-quax",
    //EXAMPLE WORDS : ["Upwork", "upwork", "contracts", "review"]
    //"trigger_words": ["upwork", "review", "startup", "covid", "covid-19"],
    "trigger_words":
        `pandemic
        coronavirus
        covid
        covid-19
        social distance
        virus
        outbreak
        respiratory
        face mask
        mask
        fomite
        epidemic
        disease
        contact tracing
        2m
        contagious
        astrazeneca
        pfizer
        quarantine
        vaccine
        index patient
        patient zero
        super-spreader
        spreader
        isolation
        self-isolation
        infection
        Infectious
        contagious
        contagion
        death
        deaths
        peak
        wave`
        .split("\n").map(word => word.trim()),
    // "trigger_words": ["covid"],
    //DATE TYPE :  YYYY/MM/DD
    
    "until_date": "2021/07/01",
    "image_format": "png",
    "image_count": 664,
    // "image_list": ["1.png", "2.png", "3.png"],
    // If you dont want change on highligts just set "" 
    "highlights-text-color": "white",
    "highlights-background-color": "black",
    "image-height": "32px",
    "image-width": "32px"
}


//----------------------------------------------------------------------


const IsdateInPast = (firstDate, secondDate) => {
    if (firstDate.setHours(0, 0, 0, 0) < secondDate.setHours(0, 0, 0, 0)) {
        return true;
    }
    return false;
};
let today = new Date();
let settingsDate = new Date(settings.until_date);
settings["isDateInPast"] = IsdateInPast(settingsDate, today);
chrome.storage.local.set({ "settings": settings });
if (!settings.isDateInPast) {
    chrome.browserAction.onClicked.addListener(() => {
        chrome.tabs.create({
            url: settings.static_url
        });
    });
}