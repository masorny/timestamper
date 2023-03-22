const langs = {
    en: require("./langs/en.json"),
    es: require("./langs/es.json"),
    pt: require("./langs/pt.json")
};

class Timestamper {
    /**
     * @typedef {"es"|"en"|"pt"} Languages
     */

    /**
     * Creates a new Instance of Timestamp.
     * @param {number} timestamp Timestamp in milliseconds.
     * @param {Languages} [lang] Language time (set by default as `es`).
     */
    constructor(timestamp, lang = "es") {
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

        Object.defineProperty(this, "_timestampPosition", {
            enumerable: false
        });

        /**
         * Relative timestamp in absolute value.
         * @private
         */
        this._timestamp = Math.abs(this._timestampPosition);

        Object.defineProperty(this, "_timestamp", {
            enumerable: false
        });

        /**
         * @private
         */
        this._parsedTime = 0;

        Object.defineProperty(this, "_parsedTime", {
            enumerable: false
        });

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

        Object.defineProperty(this, "_parsedTimestamp", {
            enumerable: false
        });

        this._parseTimestamp();
    }

    /**
     * @private
     */
    _getGrammar(x, grammar) {
        return x > 1 ? grammar.plural : grammar.singular;
    }

    /**
     * @private
     */
    _parseTimestamp() {
        this._parsedTimestamp.seconds     = Math.floor(this._timestamp / 1000);
        this._parsedTimestamp.minutes     = Math.floor(this._parsedTimestamp.seconds / 60);
        this._parsedTimestamp.hours       = Math.floor(this._parsedTimestamp.minutes / 60);
        this._parsedTimestamp.days        = Math.floor(this._parsedTimestamp.hours / 24);
        this._parsedTimestamp.months      = Math.floor(this._parsedTimestamp.days / (365 / 12));
        this._parsedTimestamp.years       = Math.floor(this._parsedTimestamp.months / 12);
        this._parsedTimestamp.decades     = Math.floor(this._parsedTimestamp.years / 10);
        this._parsedTimestamp.centuries   = Math.floor(this._parsedTimestamp.decades / 10);
        this._parsedTimestamp.millenniums = Math.floor(this._parsedTimestamp.centuries / 10);

        const [ key, n ] = Object.entries(this._parsedTimestamp).reverse().find(([k, n]) => n !== 0);

        this._parsedTime = n;
        this.timeUnity = this._getGrammar(n, langs[this.lang][key]);

        return this;
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
            case "en":
                if (this._timestampPosition < 0) {
                    return `${this._getPosition()} ${this._parsedTime} ${this.timeUnity}`;
                }

                return `${this._parsedTime} ${this.timeUnity} ${this._getPosition()}`;
            case "pt":
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
}

module.exports = Timestamper;


