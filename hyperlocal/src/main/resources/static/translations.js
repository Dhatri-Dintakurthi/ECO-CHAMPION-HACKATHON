// Multi-Language Translation System
const translations = {
    en: {
        // Header
        appTitle: "Hyderabad Hyperlocal PM2.5 Monitoring System",
        appDescription: "Zone-level PM2.5 estimation tool for regulatory decision support and pollution hotspot prioritization.",
        status: "Status",
        live: "LIVE",
        lastSync: "Last Synchronized",
        downloadReport: "Download Alert Report",

        // Decision Support
        decisionSupport: "Decision Support Guidance",
        systemDescription: "This system utilizes fixed-grid PM2.5 estimation (500m × 500m) based on public AQI station data, traffic density, and weather factors. High-risk zones (>60 µg/m³) are automatically flagged for regulatory intervention and prioritized inspection.",

        // Stats
        avgPM25: "Average PM2.5 (Hyderabad)",
        topHotspot: "Current Top Hotspot",
        activeAlerts: "Active Alerts",

        // Dashboard
        hyperlocalMap: "Hyperlocal Air Quality Map",
        liveData: "LIVE DATA",
        good: "Good",
        moderate: "Moderate",
        poor: "Poor",
        veryPoor: "Very Poor",
        refresh: "Refresh",

        // Categories
        goodRange: "Good (0-30)",
        moderateRange: "Mod. (31-60)",
        poorRange: "Poor (61-90)",
        veryPoorRange: "V. Poor (>90)",

        // Health Impact
        generallySafe: "Generally safe",
        slightRisk: "Slight risk",
        highRisk: "High risk",
        critical: "Critical",

        // Health Impact Messages (for dynamic content)
        healthGood: "Air quality is generally safe (Good)",
        healthModerate: "Prolonged exposure may affect sensitive groups (Moderate)",
        healthPoor: "High risk for children and elderly (Poor)",
        healthVeryPoor: "Danger: Hazardous air quality for all (Very Poor)",

        // Zone Analysis Labels
        quality: "Quality",
        zoneId: "ID",
        updated: "Updated",
        trafficDensity: "Traffic Density",
        windSpeed: "Wind Speed",
        temperature: "Temperature",
        weatherImpact: "Weather Impact",

        // Hotspots
        topHotspots: "Top PM2.5 Hotspots (Persistent Zones)",
        hotspotDesc: "The following zones show consistent high PM2.5 levels over multiple monitoring cycles, requiring immediate administrative attention.",
        gridId: "Grid ID",
        location: "Location",
        pm25Value: "PM2.5 Value",
        regulatoryStatus: "Regulatory Status",

        // Alerts
        alertFeed: "High-Pollution Alert Feed",
        noAlerts: "System monitoring: No active alerts.",

        // Footer
        copyright: "© 2025 TGPCB - Environmental Decision Support System",
        regulatoryNote: "Health impact indicators are shown for awareness and regulatory decision support.",

        // Chart
        cityTrend: "City Average PM2.5 Trend (24 Hours)",
        zoneTrend: "Zone PM2.5 Trend (24 Hours)",
        time: "Time",
        pm25Level: "PM2.5 (µg/m³)",

        // Theme
        darkMode: "Dark Mode",
        lightMode: "Light Mode",

        // Language
        language: "Language",
        english: "English",
        telugu: "తెలుగు",
        hindi: "हिंदी",

        // Comparison Mode
        compare: "Compare",
        exitComparison: "Exit Comparison",
        selectSecondZone: "Select Second Zone",
        comparisonView: "Zone Comparison",
        difference: "Difference",
        vs: "VS",
        higher: "Higher",
        lower: "Lower"
    },

    te: {
        // Header (Telugu)
        appTitle: "హైదరాబాద్ హైపర్‌లోకల్ PM2.5 పర్యవేక్షణ వ్యవస్థ",
        appDescription: "నియంత్రణ నిర్ణయ మద్దతు మరియు కాలుష్య హాట్‌స్పాట్ ప్రాధాన్యత కోసం జోన్-స్థాయి PM2.5 అంచనా సాధనం.",
        status: "స్థితి",
        live: "ప్రత్యక్ష",
        lastSync: "చివరిగా సమకాలీకరించబడింది",
        downloadReport: "హెచ్చరిక నివేదికను డౌన్‌లోడ్ చేయండి",

        // Decision Support
        decisionSupport: "నిర్ణయ మద్దతు మార్గదర్శకత్వం",
        systemDescription: "ఈ వ్యవస్థ పబ్లిక్ AQI స్టేషన్ డేటా, ట్రాఫిక్ సాంద్రత మరియు వాతావరణ కారకాల ఆధారంగా స్థిర-గ్రిడ్ PM2.5 అంచనాను (500m × 500m) ఉపయోగిస్తుంది. అధిక-ప్రమాద జోన్‌లు (>60 µg/m³) నియంత్రణ జోక్యం మరియు ప్రాధాన్యత తనిఖీ కోసం స్వయంచాలకంగా ఫ్లాగ్ చేయబడతాయి.",

        // Stats
        avgPM25: "సగటు PM2.5 (హైదరాబాద్)",
        topHotspot: "ప్రస్తుత టాప్ హాట్‌స్పాట్",
        activeAlerts: "క్రియాశీల హెచ్చరికలు",

        // Dashboard
        hyperlocalMap: "హైపర్‌లోకల్ వాయు నాణ్యత మ్యాప్",
        liveData: "ప్రత్యక్ష డేటా",
        good: "మంచిది",
        moderate: "మధ్యస్థం",
        poor: "పేద",
        veryPoor: "చాలా పేద",
        refresh: "రిఫ్రెష్",

        // Categories
        goodRange: "మంచిది (0-30)",
        moderateRange: "మధ్యస్థం (31-60)",
        poorRange: "పేద (61-90)",
        veryPoorRange: "చాలా పేద (>90)",

        // Health Impact
        generallySafe: "సాధారణంగా సురక్షితం",
        slightRisk: "స్వల్ప ప్రమాదం",
        highRisk: "అధిక ప్రమాదం",
        critical: "క్లిష్టమైన",

        // Health Impact Messages (for dynamic content)
        healthGood: "వాయు నాణ్యత సాధారణంగా సురక్షితం (మంచిది)",
        healthModerate: "సున్నితమైన సమూహాలను ప్రభావితం చేయవచ్చు (మధ్యస్థం)",
        healthPoor: "పిల్లలు మరియు వృద్ధులకు అధిక ప్రమాదం (పేద)",
        healthVeryPoor: "ప్రమాదం: అందరికీ ప్రమాదకరమైన వాయు నాణ్యత (చాలా పేద)",

        // Zone Analysis Labels
        quality: "నాణ్యత",
        zoneId: "ID",
        updated: "నవీకరించబడింది",
        trafficDensity: "ట్రాఫిక్ సాంద్రత",
        windSpeed: "గాలి వేగం",
        temperature: "ఉష్ణోగ్రత",
        weatherImpact: "వాతావరణ ప్రభావం",

        // Hotspots
        topHotspots: "టాప్ PM2.5 హాట్‌స్పాట్‌లు (నిరంతర జోన్‌లు)",
        hotspotDesc: "కింది జోన్‌లు బహుళ పర్యవేక్షణ చక్రాలలో స్థిరమైన అధిక PM2.5 స్థాయిలను చూపుతాయి, తక్షణ పరిపాలనా శ్రద్ధ అవసరం.",
        gridId: "గ్రిడ్ ID",
        location: "స్థానం",
        pm25Value: "PM2.5 విలువ",
        regulatoryStatus: "నియంత్రణ స్థితి",

        // Alerts
        alertFeed: "అధిక-కాలుష్య హెచ్చరిక ఫీడ్",
        noAlerts: "సిస్టమ్ పర్యవేక్షణ: క్రియాశీల హెచ్చరికలు లేవు.",

        // Footer
        copyright: "© 2025 TGPCB - పర్యావరణ నిర్ణయ మద్దతు వ్యవస్థ",
        regulatoryNote: "ఆరోగ్య ప్రభావ సూచికలు అవగాహన మరియు నియంత్రణ నిర్ణయ మద్దతు కోసం చూపబడతాయి.",

        // Chart
        cityTrend: "నగర సగటు PM2.5 ధోరణి (24 గంటలు)",
        zoneTrend: "జోన్ PM2.5 ధోరణి (24 గంటలు)",
        time: "సమయం",
        pm25Level: "PM2.5 (µg/m³)",

        // Theme
        darkMode: "డార్క్ మోడ్",
        lightMode: "లైట్ మోడ్",

        // Language
        language: "భాష",
        english: "English",
        telugu: "తెలుగు",
        hindi: "हिंदी",

        // Comparison Mode
        compare: "పోల్చండి", // Compare
        exitComparison: "పోలిక నుండి నిష్క్రమించు", // Exit Comparison
        selectSecondZone: "రెండవ జోన్‌ను ఎంచుకోండి", // Select Second Zone
        comparisonView: "జోన్ పోలిక", // Zone Comparison
        difference: "తేడా", // Difference
        vs: "వర్సెస్", // VS
        higher: "అధిక", // Higher
        lower: "తక్కువ" // Lower
    },

    hi: {
        // Header (Hindi)
        appTitle: "हैदराबाद हाइपरलोकल PM2.5 निगरानी प्रणाली",
        appDescription: "नियामक निर्णय समर्थन और प्रदूषण हॉटस्पॉट प्राथमिकता के लिए जोन-स्तरीय PM2.5 अनुमान उपकरण।",
        status: "स्थिति",
        live: "लाइव",
        lastSync: "अंतिम समन्वयित",
        downloadReport: "अलर्ट रिपोर्ट डाउनलोड करें",

        // Decision Support
        decisionSupport: "निर्णय समर्थन मार्गदर्शन",
        systemDescription: "यह प्रणाली सार्वजनिक AQI स्टेशन डेटा, यातायात घनत्व और मौसम कारकों के आधार पर निश्चित-ग्रिड PM2.5 अनुमान (500m × 500m) का उपयोग करती है। उच्च-जोखिम क्षेत्र (>60 µg/m³) को नियामक हस्तक्षेप और प्राथमिकता निरीक्षण के लिए स्वचालित रूप से चिह्नित किया जाता है।",

        // Stats
        avgPM25: "औसत PM2.5 (हैदराबाद)",
        topHotspot: "वर्तमान शीर्ष हॉटस्पॉट",
        activeAlerts: "सक्रिय अलर्ट",

        // Dashboard
        hyperlocalMap: "हाइपरलोकल वायु गुणवत्ता मानचित्र",
        liveData: "लाइव डेटा",
        good: "अच्छा",
        moderate: "मध्यम",
        poor: "खराब",
        veryPoor: "बहुत खराब",
        refresh: "रिफ्रेश",

        // Categories
        goodRange: "अच्छा (0-30)",
        moderateRange: "मध्यम (31-60)",
        poorRange: "खराब (61-90)",
        veryPoorRange: "बहुत खराब (>90)",

        // Health Impact
        generallySafe: "आम तौर पर सुरक्षित",
        slightRisk: "मामूली जोखिम",
        highRisk: "उच्च जोखिम",
        critical: "गंभीर",

        // Health Impact Messages (for dynamic content)
        healthGood: "वायु गुणवत्ता आम तौर पर सुरक्षित है (अच्छा)",
        healthModerate: "संवेदनशील समूहों को प्रभावित कर सकता है (मध्यम)",
        healthPoor: "बच्चों और बुजुर्गों के लिए उच्च जोखिम (खराब)",
        healthVeryPoor: "खतरा: सभी के लिए खतरनाक वायु गुणवत्ता (बहुत खराब)",

        // Zone Analysis Labels
        quality: "गुणवत्ता",
        zoneId: "ID",
        updated: "अपडेट किया गया",
        trafficDensity: "यातायात घनत्व",
        windSpeed: "हवा की गति",
        temperature: "तापमान",
        weatherImpact: "मौसम प्रभाव",

        // Hotspots
        topHotspots: "शीर्ष PM2.5 हॉटस्पॉट (लगातार जोन)",
        hotspotDesc: "निम्नलिखित जोन कई निगरानी चक्रों में लगातार उच्च PM2.5 स्तर दिखाते हैं, जिन्हें तत्काल प्रशासनिक ध्यान की आवश्यकता है।",
        gridId: "ग्रिड ID",
        location: "स्थान",
        pm25Value: "PM2.5 मान",
        regulatoryStatus: "नियामक स्थिति",

        // Alerts
        alertFeed: "उच्च-प्रदूषण अलर्ट फीड",
        noAlerts: "सिस्टम निगरानी: कोई सक्रिय अलर्ट नहीं।",

        // Footer
        copyright: "© 2025 TGPCB - पर्यावरण निर्णय समर्थन प्रणाली",
        regulatoryNote: "स्वास्थ्य प्रभाव संकेतक जागरूकता और नियामक निर्णय समर्थन के लिए दिखाए गए हैं।",

        // Chart
        cityTrend: "शहर औसत PM2.5 रुझान (24 घंटे)",
        zoneTrend: "जोन PM2.5 रुझान (24 घंटे)",
        time: "समय",
        pm25Level: "PM2.5 (µg/m³)",

        // Theme
        darkMode: "डार्क मोड",
        lightMode: "लाइट मोड",

        // Language
        language: "भाषा",
        english: "English",
        telugu: "తెలుగు",
        hindi: "हिंदी",

        // Comparison Mode
        compare: "तुलना करें",
        exitComparison: "तुलना से बाहर निकलें",
        selectSecondZone: "दूसरा क्षेत्र चुनें",
        comparisonView: "क्षेत्र तुलना",
        difference: "अंतर",
        vs: "बनाम",
        higher: "अधिक",
        lower: "कम"
    }
};

// Current language (default: English)
let currentLang = localStorage.getItem('preferredLanguage') || 'en';

// Translation function
function t(key) {
    return translations[currentLang][key] || translations['en'][key] || key;
}

// Change language
function changeLanguage(lang) {
    if (translations[lang]) {
        currentLang = lang;
        localStorage.setItem('preferredLanguage', lang);
        updatePageLanguage();
    }
}

// Update all translatable elements
function updatePageLanguage() {
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (el.tagName === 'INPUT' && el.placeholder) {
            el.placeholder = t(key);
        } else {
            el.textContent = t(key);
        }
    });

    // Update language selector
    const langSelectors = document.querySelectorAll('.lang-option');
    langSelectors.forEach(opt => {
        opt.classList.toggle('active', opt.dataset.lang === currentLang);
    });

    // Refresh dashboard to apply translations
    if (typeof updateDashboard === 'function') {
        updateDashboard(false);
    }
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', () => {
    updatePageLanguage();
});
