const { floor, abs } = Math;

const langs = {
    es: {
        now: "ahora",
        agoTime: "hace",
        inTime: "en",
        seconds: {
            singular: "segundo",
            plural: "segundos" 
        }, 
        minutes: {
            singular: "minuto",
            plural: "minutos" 
        }, 
        hours: {
            singular: "hora",
            plural: "horas"   
        }, 
        days: {
            singular: "día",
            plural: "dias"    
        }, 
        months: {
            singular: "mes",
            plural: "meses"  
        }, 
        years: {
            singular: "año",
            plural: "años"   
        }, 
        decades: {
            singular: "decada",
            plural: "decadas" 
        }
    },
    en: {
        now: "now",
        agoTime: "ago",
        inTime: "in",
        seconds: {
            singular: "second",
            plural: "seconds" 
        }, 
        minutes: {
            singular: "minute",
            plural: "minutes" 
        }, 
        hours:   {
            singular: "hour",
            plural: "hours"   
        }, 
        days:    {
            singular: "day",
            plural: "days"    
        }, 
        months:  {
            singular: "month",
            plural: "months"  
        }, 
        years:   {
            singular: "year",
            plural: "years"   
        }, 
        decades: {
            singular: "decade",
            plural: "decades" 
        }
    }
};

class Timestamper {
    /**
     * Creates a new Instance of Timestamp.
     * @param {number} timestamp Timestamp in milliseconds.
     * @param {"es"|"en"} [lang] Language time (set by default as `es`).
     */
    constructor(timestamp, lang = "es") {
        if ((!timestamp && typeof timestamp !== 'number') && isNaN(new Date(timestamp))) {
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
        this._timestamp = abs(this._timestampPosition);

        /**
         * Highest time value.
         * @private
         */
        this._parsedTime = 0;

        /**
         * Time language.
         */
        this.lang = lang;

        // Initializes the conversion.
        this._parseTimestamp();
    }

    _parseTimestamp() {
        const seconds = floor(this._timestamp / 1000),
              minutes = floor(seconds / 60),
              hours   = floor(minutes / 60),
              days    = floor(hours / 24),
              months  = floor(days / (365 / 12)),
              years   = floor(months / 12),
              decades = floor(years / 10);

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
     * Converts the Structure into readable time.
     * @example
     * Timestamper.toString() = "ahora"
     * Timestamper.toString() = "hace 1 minuto"
     * Timestamper.toString() = "hace 2 minutos"
     * Timestamper.toString() = "hace 1 día"
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
     * Converts the Structure into simplest readable time.
     * @example
     * Timestamper.toStringTime() = "ahora"
     * Timestamper.toStringTime() = "1 minuto"
     * Timestamper.toStringTime() = "2 minutos"
     * Timestamper.toStringTime() = "1 día"
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


