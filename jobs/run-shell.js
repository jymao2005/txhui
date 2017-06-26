var cp = require("child_process")
function runShell(path, args){
    if(typeof args ==="string"){
        args = args.split(" ");
    }
    const sh = cp.spawn(path, args );
   // console.log(sh)
    return new Promise((resolve, reject)=>{
        sh.stdout.on("data", (data)=>{
            console.log(`${path} stdout:${data}`)
        })
        
        sh.stderr.on("data", (data)=>{
            console.log(`${path} stderr:${data}`);
        })
        
        sh.on("close", (code)=>{
            if(code){
                reject(path +" exit with code ", code)
            }
            else {
                resolve(code)
            }
        })
    })
}

module.exports = runShell;