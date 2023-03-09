/* 
    Desarrollado y mantenido por Keew
    Trátame con cariño!
*/

const langs = {
    es: {
        now: "ahora",
        agoTime: "hace",
        inTime: "en",
        seconds: { singular: "segundo", plural: "segundos" }, 
        minutes: { singular: "minuto", plural: "minutos" }, 
        hours:   { singular: "hora",   plural: "horas"   }, 
        days:    { singular: "día",    plural: "dias"    }, 
        months:  { singular: "mes",  plural: "meses"  }, 
        years:   { singular: "año",   plural: "años"   }, 
        decades: { singular: "decada", plural: "decadas" }
    },
    en: {
        now: "now",
        agoTime: "ago",
        inTime: "in",
        seconds: { singular: "second", plural: "seconds" }, 
        minutes: { singular: "minute", plural: "minutes" }, 
        hours:   { singular: "hour",   plural: "hours"   }, 
        days:    { singular: "day",    plural: "days"    }, 
        months:  { singular: "month",  plural: "months"  }, 
        years:   { singular: "year",   plural: "years"   }, 
        decades: { singular: "decade", plural: "decades" }
    }
};

class Timestamper {
    /**
     * @param {number} timestamp Timestamp in milliseconds.
     * @param {"es"|"en"} [lang] Language time (set by default as `es`).
     */
    constructor(timestamp, lang = "es") {
        if (!timestamp && typeof timestamp !== 'number') {
            throw new Error('Parameter is required');
        }

        if (typeof timestamp !== 'number') {
            throw new TypeError('Parameter must be a Number');
        };

        if (isNaN(new Date(timestamp))) {
            throw new RangeError('Invalid Timestamp')
        };
        
        Object.defineProperties(this, {
            '_timestamp': {
                writable: true,
                enumerable: false,
                configurable: false
            },
            '_timestampPosition': {
                writable: true,
                enumerable: false,
                configurable: false
            }
        });

        this._operations = {
            operation1(timestamp) {
                return {
                    seconds: Math.floor(timestamp / 1000), 
                    minutes: Math.floor(Math.floor(timestamp / 1000) / 60), 
                    hours: Math.floor(Math.floor(timestamp / 1000) / 3600), 
                    days: Math.floor(Math.floor(timestamp / 1000) / 86400), 
                    months: Math.floor((Math.floor(timestamp / 1000) / 86400) / 30.4166667), 
                    years: Math.floor(Math.floor((Math.floor(timestamp / 1000) / 86400) / 30.4166667) / 12), 
                    decades: Math.floor(Math.floor(Math.floor((Math.floor(timestamp / 1000) / 86400) / 30.4166667) / 12) / 10),
                    fnGetValue() {
                        return (
                            this.seconds >= 60 ? this.minutes >= 60 ? this.hours >= 24 ? this.days >= 30 ? this.months >= 12 ? this.years >= 10 ?
                            this.decades : this.years : this.months : this.days : this.hours : this.minutes : this.seconds
                        )
                    }
                }
            },
            operation2(operation1, lang = "es") {
                return Object.assign({
                    fnGetTimeUnity () {
                        return (
                            operation1.seconds >= 60 ? operation1.minutes >= 60 ? operation1.hours >= 24 ? operation1.days >= 30 ? operation1.months >= 12 ? operation1.years >= 10 ?
                            (operation1.decades > 1 ? this.decades.plural : this.decades.singular) :
                            (operation1.years > 1 ? this.years.plural : this.years.singular) :
                            (operation1.months > 1 ? this.months.plural : this.months.singular) :
                            (operation1.days > 1 ? this.days.plural : this.days.singular) :
                            (operation1.hours > 1 ? this.hours.plural : this.hours.singular) :
                            (operation1.minutes > 1 ? this.minutes.plural : this.minutes.singular) :
                            (operation1.seconds > 1 || operation1.seconds <= 0 ? this.seconds.plural : this.seconds.singular)
                        )
                    }
                }, langs[lang]);
            },
            operation3(timestamp) {
                return {
                    seconds: Math.floor(timestamp / 1000) % 60, 
                    minutes: Math.floor(Math.floor(timestamp / 1000) / 60) % 60, 
                    hours: Math.floor(Math.floor(timestamp / 1000) / 3600) % 24, 
                    days: Math.floor(Math.floor(Math.floor(timestamp / 1000) / 86400) % 30.4167), 
                    months: Math.floor((Math.floor(timestamp / 1000) / 86400) / 30.4167) % 12, 
                    years: Math.floor(Math.floor((Math.floor(timestamp / 1000) / 86400) / 30.4167) / 12) % 10, 
                    decades: Math.floor(Math.floor(Math.floor((Math.floor(timestamp / 1000) / 86400) / 30.4167) / 12) / 10),
                }
            },
            operation4(timestamp, lang) {
                return {
                    timestamp: timestamp,
                    fnGetTimePosition() {
                        return this.timestamp < 0 ? langs[lang].inTime : langs[lang].agoTime;
                    }
                }
            }
        };

        this._timestampPosition = new Date().getTime() - new Date(timestamp).getTime();

        this._timestamp = ((new Date().getTime() - new Date(timestamp).getTime()) < 0 ? (new Date(timestamp).getTime() - new Date().getTime()) : (new Date().getTime() - new Date(timestamp).getTime()));

        this.parsedTime = this._operations['operation1'](this._timestamp).fnGetValue();

        this.parsedTimeUnity = (this.parsedTime == 0 ? null : this._operations['operation2'](this._operations['operation1'](this._timestamp)).fnGetTimeUnity());

        this.lang = lang;
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
        if (this.lang === "en") {
            return (this.parsedTime == 0 ? langs[this.lang].now : (`${this._operations['operation1'](this._timestamp).fnGetValue()} ${this._operations['operation2'](this._operations['operation1'](this._timestamp), this.lang).fnGetTimeUnity()} ${this._operations['operation4'](this._timestampPosition, this.lang).fnGetTimePosition()}`));
        }

        return (this.parsedTime == 0 ? langs[this.lang].now : (this._operations['operation4'](this._timestampPosition, this.lang).fnGetTimePosition() + ' ' + this._operations['operation1'](this._timestamp).fnGetValue() + ' ' + this._operations['operation2'](this._operations['operation1'](this._timestamp)).fnGetTimeUnity()));
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
        return this._operations['operation1'](this._timestamp).fnGetValue() + ' ' + this._operations['operation2'](this._operations['operation1'](this._timestamp)).fnGetTimeUnity()
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

    toRelative() {
        return new (class Relative {
            #Strings
            #Object
            #relativeOperations = {
                fnGetUnity(Strings, object) {
                    return {
                        seconds: object.seconds < 2 ? (object.seconds == 0 ? Strings.seconds.plural : Strings.seconds.singular) : Strings.seconds.plural,
                        minutes: object.minutes < 2 ? (object.minutes == 0 ? Strings.minutes.plural : Strings.minutes.singular) : Strings.minutes.plural,
                        hours:   object.hours   < 2 ? (object.hours   == 0 ? Strings.hours.plural   : Strings.hours.singular)   : Strings.hours.plural,
                        days:    object.days    < 2 ? (object.days    == 0 ? Strings.days.plural    : Strings.days.singular)    : Strings.days.plural,
                        months:  object.months  < 2 ? (object.months  == 0 ? Strings.months.plural  : Strings.months.singular)  : Strings.months.plural,
                        years:   object.years   < 2 ? (object.years   == 0 ? Strings.years.plural   : Strings.years.singular)   : Strings.years.plural,
                        decades: object.decades < 2 ? (object.decades == 0 ? Strings.decades.plural : Strings.decades.singular) : Strings.decades.plural
                    }
                }
            }

            constructor(object, Strings) {
                this.#Strings = Strings
                this.#Object = object

                Object.keys(object).forEach((key) => {
                    this[key] = object[key]
                })
            }

            stringParse() {
                Object.keys(this).filter(key => this[key] == 0).forEach(key => delete this[key])
                Object.keys(this).forEach(key => {
                    this[key] += ' ' + this.#relativeOperations['fnGetUnity'](this.#Strings, this.#Object)[key]
                })
                return this
            }

            getCounter() {
                return Object.keys(this)
                    .filter(key => this[key] > 0)
                    .reverse()
                    .map((key, index) => (this[key] < 10 && index > 0) ? '0' + this[key] + key.slice(0, 1) : this[key] + key.slice(0, 1))
                    .join(':')
            }
        })(this._operations['operation3'](this._timestamp), this._operations['operation2']())
    }

    /**
     * Retorna los segundos convertidos
     */
    getSeconds() {
        return this._operations['operation1'](this._timestamp).seconds
    }

    /**
     * Retorna los minutos convertidos
     */
    getMinutes() {
        return this._operations['operation1'](this._timestamp).minutes
    }

    /**
     * Retorna las horas convertidas
     */
    getHours() {
        return this._operations['operation1'](this._timestamp).hours
    }

    /**
     * Retorna los días convertidos
     */
    getDays() {
        return this._operations['operation1'](this._timestamp).days
    }

    /**
     * Retorna los meses convertidos
     */
    getMonths() {
        return this._operations['operation1'](this._timestamp).months
    }

    /**
     * Retorna los años convertidos
     */
    getYears() {
        return this._operations['operation1'](this._timestamp).years
    }

    /**
     * Retorna las decadas convertidas
     */
    getDecades() {
        return this._operations['operation1'](this._timestamp).decades
    }
}

module.exports = Timestamper;


