const langs = {
    en: require("./langs/en.json"),
    es: require("./langs/es.json")
};

class Timestamper {
    /**
     * Creates a new Instance of Timestamp.
     * @param {number} timestamp Timestamp in milliseconds.
     * @param {"es"|"en"} [lang] Language time (set by default as `es`).
     */
    constructor(timestamp, lang = "es") {
        if ((!timestamp && typeof timestamp !== 'number') || isNaN(new Date(timestamp))) {
            throw new Error('Invalid Timestamp');
        };

        /**
         * Timestamp defined.
         */
        this.timestamp = timestamp;

        /**
         * Determines the time position.
         * @private
         */
        this._timestampPosition = Date.now() - new Date(timestamp).getTime();

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
         * Time language.
         */
        this.lang = lang;

        this._parseTimestamp();
    }

    /**
     * @private
     */
    _parseTimestamp() {
        const seconds = Math.floor(this._timestamp / 1000),
              minutes = Math.floor(seconds / 60),
              hours   = Math.floor(minutes / 60),
              days    = Math.floor(hours / 24),
              months  = Math.floor(days / (365 / 12)),
              years   = Math.floor(months / 12),
              decades = Math.floor(years / 10);

        this.parsedTimestamp = {
            seconds,
            minutes,
            hours,
            days,
            months,
            decades 
        };

        if (decades > 0) {
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

        if (this.lang === "en") {
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
     * Converts the Structure into Counter time.
     * @example
     * Timestamper.toStringCounter() = "0:00"
     * Timestamper.toStringCounter() = "1:00"
     * Timestamper.toStringCounter() = "15:30"
     * Timestamper.toStringCounter() = "1:00:00"
     * Timestamper.toStringCounter() = "1:00:00:00"
     */
    toStringCounter() {
        var {
            seconds,
            minutes,
            hours,
            days,
            months,
            years,
            decades
        } = this._operations.operation1(this._timestamp);

        var parsedTime = [
            decades,
            years % 10,
            months % 12,
            Math.floor(days % 30.4167),
            hours % 24,

            /* Priority */
            minutes % 60,
            seconds % 60
        ];

        var filteredTime = parsedTime.filter(!(time < 1 && index < 5));

        filteredTime = filteredTime.map((time, index) => {
                return time < 10 && index > 0 ? `0${time}` : String(time);
        });

        return filteredTime.join(":");
    }
}

module.exports = Timestamper;


