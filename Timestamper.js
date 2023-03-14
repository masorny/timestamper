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

        this._parseTimestamp();
    }

    /**
     * @private
     */
    _parseTimestamp() {
        const seconds     = Math.floor(this._timestamp / 1000),
              minutes     = Math.floor(seconds / 60),
              hours       = Math.floor(minutes / 60),
              days        = Math.floor(hours / 24),
              months      = Math.floor(days / (365 / 12)),
              years       = Math.floor(months / 12),
              decades     = Math.floor(years / 10),
              centuries   = Math.floor(decades / 10),
              millenniums = Math.floor(centuries / 10);

        this._parsedTimestamp = {
            seconds, minutes,   hours,   
            days,    months,    years,
            decades, centuries, millenniums
        };

        if (millenniums > 0) {
            this._parsedTime = millenniums;
            this.timeUnity = millenniums > 1 ? langs[this.lang].millenniums.plural : langs[this.lang].millenniums.singular;
        }
        else if (centuries > 0) {
            this._parsedTime = centuries;
            this.timeUnity = centuries > 1 ? langs[this.lang].centuries.plural : langs[this.lang].centuries.singular;
        }
        else if (decades > 0) {
            this._parsedTime = decades;
            this.timeUnity = decades > 1 ? langs[this.lang].decades.plural : langs[this.lang].decades.singular;
        }
        else if (years > 0) {
            this._parsedTime = years;
            this.timeUnity = years > 1 ? langs[this.lang].years.plural : langs[this.lang].years.singular;
        }
        else if (months > 0) {
            this._parsedTime = months;
            this.timeUnity = months > 1 ? langs[this.lang].months.plural : langs[this.lang].months.singular;
        }
        else if (days > 0) {
            this._parsedTime = days;
            this.timeUnity = days > 1 ? langs[this.lang].days.plural : langs[this.lang].days.singular;
        }
        else if (hours > 0) {
            this._parsedTime = hours;
            this.timeUnity = hours > 1 ? langs[this.lang].hours.plural : langs[this.lang].hours.singular;
        }
        else if (minutes > 0) {
            this._parsedTime = minutes;
            this.timeUnity = minutes > 1 ? langs[this.lang].minutes.plural : langs[this.lang].minutes.singular;
        }
        else {
            this._parsedTime = seconds;
            this.timeUnity = seconds > 1 ? langs[this.lang].seconds.plural : langs[this.lang].seconds.singular;
        }

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
     * Timestamper.toStringTime() = "1 minute ago"
     * Timestamper.toStringTime() = "2 minutes ago"
     * Timestamper.toStringTime() = "1 day ago"
     */
    toStringTime() {
        return `${this._parsedTime} ${this.timeUnity}`;
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
}

module.exports = Timestamper;


