if(process.env.NODE_ENV === "production"){
    module.exports = {
        mongoURL: 'mongodb://ecoSyn:1357911@ds059546.mlab.com:59546/rubjay'
    }  
}else{
    module.exports = {
        mongoURL: 'mongodb://localhost/ecovideos'
    }
};