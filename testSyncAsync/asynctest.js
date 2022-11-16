const run = require("./exportasynctest");

async function real () {
    console.log("real start");
    await run();
    console.log("real end");
}

real();

