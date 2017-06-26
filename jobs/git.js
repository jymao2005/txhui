var runShell = require("./run-shell.js")
async function run(){
    try{
        var args = process.argv;
        console.log("args:", args);
        var msg = args[2]
        
        await runShell("git", ["add", "."]);
        await runShell("git", `commit -m ${msg}`)
        await runShell("git", "push origin master")
    }catch(err){
        console.log(err)
    }
    
    
}

run();
