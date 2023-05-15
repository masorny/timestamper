const langsType = require("./langsType");

const langs = {
    [langsType.ENGLISH]: require("./langs/en.json"),
    [langsType.SPANISH]: require("./langs/es.json"),
    [langsType.PORTUGUESE]: require("./langs/pt.json")
};

class Timestamper {
    /**
     * Creates a new Instance of Timestamp.
     * @param {number} timestamp Timestamp in milliseconds.
     * @param {string} [lang] Language time (set by default as `es`).
     */
    constructor(timestamp, lang = langsType.ENGLISH) {
        if ((!timestamp && typeof timestamp !== 'number') || isNaN(timestamp) || !isFinite(timestamp)) {
            throw new Error('Invalid Timestamp');
        }

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
        return this._parsedTime === 0 ? langs[this.lang].now : this._timestampPosition < 0 ? langs[this.lang].inTime : langs[this.lang].agoTime;
    }

    /**
     * @private
     */
    _parseTimestamp() {
        const data = this._parsedTimestamp;

        data.seconds     = Math.floor(this._timestamp / 1000);
        data.minutes     = Math.floor(data.seconds / 60);
        data.hours       = Math.floor(data.minutes / 60);
        data.days        = Math.floor(data.hours / 24);
        data.months      = Math.floor(data.days / (365 / 12));
        data.years       = Math.floor(data.months / 12);
        data.decades     = Math.floor(data.years / 10);
        data.centuries   = Math.floor(data.decades / 10);
        data.millenniums = Math.floor(data.centuries / 10);

        const [ key, x ] = Object.entries(data).reverse().find(([_, x]) => x !== 0) ?? ["seconds", 0];

        this._parsedTime = x;
        this.timeUnity = this._getGrammar(x, langs[this.lang][key]);

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

        switch(this.lang) {
            case langsType.ENGLISH:
                if (this._timestampPosition < 0) {
                    return `${this._getPosition()} ${this._parsedTime} ${this.timeUnity}`;
                }

                return `${this._parsedTime} ${this.timeUnity} ${this._getPosition()}`;
            case langsType.PORTUGUESE:
                if (this._timestampPosition < 0) {
                    return `${this._getPosition()} ${this._parsedTime} ${this.timeUnity}`;
                }

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


