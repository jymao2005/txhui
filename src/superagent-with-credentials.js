export default function (ignoreUrls=[]) {
    return function(request){
        var url = request.url;
        var needIgnore = ignoreUrls.some((ignore)=>{
            return url.indexOf(ignore)!=-1;
        })
        return needIgnore? request : request.withCredentials();
    }
};
