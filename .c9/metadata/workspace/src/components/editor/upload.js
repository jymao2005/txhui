{"filter":false,"title":"upload.js","tooltip":"/src/components/editor/upload.js","undoManager":{"mark":5,"position":5,"stack":[[{"start":{"row":0,"column":0},"end":{"row":28,"column":1},"action":"insert","lines":["function uploadOne(file, next){","    if(file.size > 4*1024*1024){ //4M","        _error.msg(\"<E5><9B><BE><E7><89><87><E5><B0><BA><E5>","<AF><B8><E5><BF><85><E9><A1><BB><E5><B0><8F><E4><BA><8E>4M. ","<E5><9B><BE><E7><89><87> \", file.name, \" <E4><B8><8A><E4><BC><A0><E5><A4><B1><E8><B4><A5>.\");","        return;","    }","    //get uptoken","    $.get(\"/ds/qiniu/uptoken\", function(data){","        var token = data.token;","        ","        var parts = new FormData();","        parts.append(\"token\", token);","        parts.append(\"file\", file);","        $.ajax({","            type:\"post\",","            url:\"http://upload.qiniu.com/\",","            data:parts,","            processData:false,","            contentType:false","        }).done(function(data){","            //console.log(arguments);","            next(null, data);","            ","        }).fail(function(error){","            next(error);","        })","    })","}"],"id":1}],[{"start":{"row":2,"column":20},"end":{"row":4,"column":24},"action":"remove","lines":["<E5><9B><BE><E7><89><87><E5><B0><BA><E5>","<AF><B8><E5><BF><85><E9><A1><BB><E5><B0><8F><E4><BA><8E>4M. ","<E5><9B><BE><E7><89><87>"],"id":2}],[{"start":{"row":2,"column":37},"end":{"row":2,"column":86},"action":"remove","lines":["<E4><B8><8A><E4><BC><A0><E5><A4><B1><E8><B4><A5>."],"id":3}],[{"start":{"row":2,"column":0},"end":{"row":3,"column":0},"action":"remove","lines":["        _error.msg(\" \", file.name, \" \");",""],"id":4}],[{"start":{"row":5,"column":4},"end":{"row":5,"column":5},"action":"remove","lines":["$"],"id":5}],[{"start":{"row":0,"column":0},"end":{"row":25,"column":1},"action":"remove","lines":["function uploadOne(file, next){","    if(file.size > 4*1024*1024){ //4M","        return;","    }","    //get uptoken","    .get(\"/ds/qiniu/uptoken\", function(data){","        var token = data.token;","        ","        var parts = new FormData();","        parts.append(\"token\", token);","        parts.append(\"file\", file);","        $.ajax({","            type:\"post\",","            url:\"http://upload.qiniu.com/\",","            data:parts,","            processData:false,","            contentType:false","        }).done(function(data){","            //console.log(arguments);","            next(null, data);","            ","        }).fail(function(error){","            next(error);","        })","    })","}"],"id":6}]]},"ace":{"folds":[],"scrolltop":0,"scrollleft":0,"selection":{"start":{"row":0,"column":0},"end":{"row":0,"column":0},"isBackwards":false},"options":{"guessTabSize":true,"useWrapMode":false,"wrapToView":true},"firstLineState":0},"timestamp":1497437035129,"hash":"da39a3ee5e6b4b0d3255bfef95601890afd80709"}