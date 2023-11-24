const langdef = Object.freeze({
    ENGLISH: "en",
    SPANISH: "es",
    PORTUGUESE: "pt"
});

const langs = {
    [langdef.ENGLISH]:    require("./langs/en.json"),
    [langdef.SPANISH]:    require("./langs/es.json"),
    [langdef.PORTUGUESE]: require("./langs/pt.json")
};

const timeUnits = Object.freeze({
    0: 60,
    1: 60,
    2: 24,
    3: 365 / 12,
    4: 12,
    5: 10,
    6: 10,
    7: 10
});

class Timestamper {
    /*
     * Creates a new Instance of Timestamp.
     * @param {number} timestamp Timestamp in milliseconds.
     * @param {string} [lang] Language time (set by default as `es`).
     */
    constructor(timestamp, lang = langdef.ENGLISH) {
        this._validateEntry(timestamp);

        /**
         * Time language.
         */
        this.lang = lang;

        /**
         * Timestamp defined.
         */
        this.timestamp = timestamp;

        /**
         * Determines the time position.
         * @private
         */
        this._timestampPosition = Date.now() - timestamp;   

        /**
         * Relative timestamp in absolute value.
         * @private
         */
        this._timestamp = Math.abs(this._timestampPosition);

        /**
         * @private
         */
        this._parsedTime = 0;

        /**
         * @private
         */
        this._parsedTimestamp = {
            seconds: 0, 
            minutes: 0,   
            hours: 0,   
            days: 0,    
            months: 0,    
            years: 0,
            decades: 0, 
            centuries: 0, 
            millenniums: 0
        };

        Object.defineProperties(this, {
            "_timestampPosition": { enumerable: false },
            "_timestamp":         { enumerable: false },
            "_parsedTime":        { enumerable: false },
            "_parsedTimestamp":   { enumerable: false }
        });

        this._parseTimestamp();
    }

    /**
     * @private
     */
    _validateEntry(timestampEntry) {
        if (!timestamp && typeof timestamp !== 'number') {
            throw new Error(`Timestamp must be a number. Received ${timestampEntry}`);
        }

        if (isNaN(timestampEntry)) {
            throw new Error("Timestamp cannot be NaN.");
        }

        if (!isFinite(timestamp)) {
            throw new Error("Timestamp must be a finite number. Received Infinity.");
        }
    }

    /**
     * @private
     * @param {number} x
     * @param {{ singular: string, plural: string }} grammar
     */
    _getGrammar(x, grammar) {
        return x !== 1 ? grammar.plural : grammar.singular;
    }

    /**
     * Returns the time position (Past, Present, Future).
     * @private
     */
    _getPosition() {
        if (this._parsedTime === 0) {
            return langs[this.lang].now;
        }

        if (this._timestampPosition < 0) {
            return langs[this.lang].inTime;
        }

        return langs[this.lang].agoTime;
    }

    /**
     * @private
     */
    _parseTimestamp() {
        const data = this._parsedTimestamp;

        data.seconds     = Math.floor(this._timestamp / 1000);
        data.minutes     = Math.floor(data.seconds / timeUnits[0]);
        data.hours       = Math.floor(data.minutes / timeUnits[1]);
        data.days        = Math.floor(data.hours / timeUnits[2]);
        data.months      = Math.floor(data.days / timeUnits[3]);
        data.years       = Math.floor(data.months / timeUnits[4]);
        data.decades     = Math.floor(data.years / timeUnits[5]);
        data.centuries   = Math.floor(data.decades / timeUnits[6]);
        data.millenniums = Math.floor(data.centuries / timeUnits[7]);

        const [ key, x ] = Object.entries(data)
            .reverse()
            .find( ([_, x]) => x !== 0 ) ?? ["seconds", 0];

        this._parsedTime = x;
        this.timeUnity = this._getGrammar( x, langs[this.lang][key] );

        return this;
    }

    /**
     * Returns elapsed Years.
     */
    getYears() {
        return this._parsedTimestamp.years;
    }

    /**
     * Returns elapsed Months.
     */
    getMonths() {
        return this._parsedTimestamp.months;
    }

    /**
     * Returns elapsed Days.
     */
    getDays() {
        return this._parsedTimestamp.days;
    }

    /**
     * Returns elapsed Hours.
     */
    getHours() {
        return this._parsedTimestamp.hours;
    }

    /**
     * Returns elapsed Minutes.
     */
    getMinutes() {
        return this._parsedTimestamp.minutes;
    }
    
    /**
     * Returns elapsed Seconds.
     */
    getSeconds() {
        return this._parsedTimestamp.seconds;
    }

    /**
     * Sets the Time.
     * @param {number} timestamp Timestamp to apply.
     */
    setTime(timestamp) {
        this.timestamp = timestamp;
        this._timestampPosition = Date.now() - timestamp;
        this._timestamp = Math.abs(this._timestampPosition);
        this._parseTimestamp();

        return this;
    }

    /**
     * Returns readable time.
     * @example
     * Timestamper.toString() = "now"
     * Timestamper.toString() = "1 minute ago"
     * Timestamper.toString() = "2 minutes ago"
     * Timestamper.toString() = "1 day ago"
     */
    toString() {
        if (this._parsedTime == 0) {
            return langs[this.lang].now;
        }

        // English and Portuguese has the same format.
        if ([langsType.ENGLISH, langsType.PORTUGUESE].includes(this.lang) && this._timestampPosition >= 0) {
            return `${this._parsedTime} ${this.timeUnity} ${this._getPosition()}`;
        }

        return `${this._getPosition()} ${this._parsedTime} ${this.timeUnity}`;
    }

    /**
     * Returns simplest readable time.
     * @example
     * Timestamper.toStringTime() = "now"
     * Timestamper.toStringTime() = "1 minute"
     * Timestamper.toStringTime() = "2 minutes"
     * Timestamper.toStringTime() = "1 day"
     */
    toStringTime() {
        return `${this._parsedTime} ${this.timeUnity}`;
    }

    /**
     * Returns Counter time.
     * @example
     * Timestamper.toCounter() = "00:00"      // now
     * Timestamper.toCounter() = "01:00"      // 1 minute
     * Timestamper.toCounter() = "02:00"      // 2 minutes
     * Timestamper.toCounter() = "1:00:00:00" // 1 day
     */
    toCounter() {
        return Object.values(this._parsedTimestamp)
            .slice(0, 6)
            .reverse()
            .filter(x => x !== 0)
            .map((x, i, a) => {
                var dx = Math.round(x % timeUnits[l.length - 1 - (i + l.length - a.length)]);
                    dx = isNaN(dx) ? x : dx;

                return dx < 10 ? `0${dx}` : dx;
            })
            .join(":");
    }

    /**
     * Returns elapsed seconds as String.
     * @example
     * Timestamper.toSeconds(); // 10 seconds
     */
    toSeconds() {
        return `${this._parsedTimestamp.seconds} ${this._getGrammar(this._parsedTimestamp.seconds, langs[this.lang].seconds)}`;
    }

    /**
     * Returns elapsed minutes as String.
     * @example
     * Timestamper.toMinutes(); // 10 minutes
     */
    toMinutes() {
        return `${this._parsedTimestamp.minutes} ${this._getGrammar(this._parsedTimestamp.minutes, langs[this.lang].minutes)}`;
    }

    /**
     * Returns elapsed hours as String.
     * @example
     * Timestamper.toHours(); // 10 hours
     */
    toHours() {
        return `${this._parsedTimestamp.hours} ${this._getGrammar(this._parsedTimestamp.hours, langs[this.lang].hours)}`;
    }

    /**
     * Returns elapsed days as String.
     * @example
     * Timestamper.toDays(); // 10 days
     */
    toDays() {
        return `${this._parsedTimestamp.days} ${this._getGrammar(this._parsedTimestamp.days, langs[this.lang].days)}`;
    }

    /**
     * Returns elapsed months as String.
     * @example
     * Timestamper.toMonths(); // 10 months
     */
    toMonths() {
        return `${this._parsedTimestamp.months} ${this._getGrammar(this._parsedTimestamp.months, langs[this.lang].months)}`;
    }

    /**
     * Returns elapsed years as String.
     * @example
     * Timestamper.toYears(); // 10 years
     */
    toYears() {
        return `${this._parsedTimestamp.years} ${this._getGrammar(this._parsedTimestamp.years, langs[this.lang].years)}`;
    }
}

module.exports = Timestamper;


