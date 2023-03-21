# Timestamper
Converts **timestamp** into relative time.

```js
const Timestamper = require("./Timestamper");

const example_user = {
    name: "John",
    age: 18,
    createdAt: 1679246937679
};

const time = new Timestamper(example_user.createdAt);

console.log(time.toString());     // 2 days ago
console.log(time.toStringTime()); // 2 days
```

## :small_blue_diamond: Available languages
This code supports `3` languages as shown below.
| Code abbreviation | Language  |
|-------------------|-----------|
|       `es`        | Spanish   |
|       `en`        | English   |
|       `pt`        | Portuguese|

### :wrench: Example codes
> <details><summary><b>Click here to expand</b></summary>
>
> ```js
> const time = new Timestamper(Date.now(), "en");
> 
> console.log(time.toString()); // now
> ```
> ```js
> const time = new Timestamper(Date.now(), "es");
> 
> console.log(time.toString()); // ahora
> ```
> ```js
> const time = new Timestamper(Date.now(), "pt");
> 
> console.log(time.toString()); // agora
> ```
> </details>

## :small_blue_diamond: Extra functions
As seen before, the code also can return a specific time unity as shown below.
|      Code      |     Returns     |
|----------------|-----------------|
| `getSeconds`   | Elapsed seconds |
| `getMinutes`   | Elapsed minutes |
| `getHours`     | Elapsed hours   |
| `getDays`      | Elapsed days    |
| `getMonths`    | Elapsed months  |
| `getYears`     | Elapsed years   |
### :wrench: Example code
> <details><summary><b>Click here to expand</b></summary>
> 
> ```js
> const example_date = new Date(); // A day ago as example
> 
> const time = new Timestamper(example_date);
> 
> console.log(time.getSeconds());  // 86400
> console.log(time.getMinutes());  // 1440
> console.log(time.getHours());    // 24
> console.log(time.getDays());     // 1
> ```
> </details>
