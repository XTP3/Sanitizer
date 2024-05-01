# Sanitizer
A Node.js syntax sanitization utility.

## Usage
Instantiate a new Sanitize instance and pass your condition parameters:
```
    const san = new Sanitizer([
        {
            type: "string",
            field: "uniqueID",
            condition: (input) => input.length === 3
        },
        {
            type: "boolean",
            field: "allowed"
        },
        {
            type: "boolean",
            field: "completed"
        }
    ]);
```
Every parameter object requires a ```type``` and a ```field```, additionally you can pass a ```condition``` function to add custom logic.

Pass your data object to the sanitize function and execute:
```
console.log(san.sanitize({uniqueID: "abc", allowed: false})); // Returns true
```

You can check if there is a field provided for each parameter specified by passing ```true``` after your data object.
```
san.sanitize({uniqueID: "abc", allowed: false}, true); // Returns false due to missing field "completed"
```
