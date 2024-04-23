# For educational purposes 

To setup the DB, run

```
npx prisma migrate dev --name init
```

Commands:
  /checkbumps (Sends the current configuration and the remaining amount of time till the next bump)
  
That is all and configure it in the index.ts file


# FEATURES

## Customizable Delay:

Set a threshold in minutes to prevent detection and ensure successful bumps.
Delay feature helps avoid detection by the bot itself and other members.
Adjust the StealthSpan setting for advanced control over detection avoidance.

```js
const AB = new AutoBump({
        commandName: "bump",
        every: 60000,
        hours: hours,
        StealthSpan: 25 /* Adjust me! */
    })```


# Ez to use

It LITERALLY doesnt take so much to get it up and running. You only need 3 piece of info.
