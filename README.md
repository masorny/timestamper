# Timestamper
Converts timestamp into relative time.

### Example code
```js
const Timestamper = require("./Timestamper");

const example_user = {
    name: "John",
    age: 18,
    createdAt: 1679246937679
};

const time = new Timestamper(example_user.createdAt);

console.log(time.toString()); // 2 days ago
```

## Available languages
This code supports `3` languages as shown below.
| Code | Language  |
|------|-----------|
| `es` | Spanish   |
| `en` | English   |
| `pt` | Portuguese|

### Example code
```js
const time = new Timestamper(Date.now(), "en");

console.log(time.toString()); // now
```
```js
const time = new Timestamper(Date.now(), "es");

console.log(time.toString()); // ahora
```
```js
const time = new Timestamper(Date.now(), "pt");

console.log(time.toString()); // agora
```
