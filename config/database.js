if(process.env.NODE_ENV === 'production'){
    module.exports = {mongoURI : 'mongodb://Prasad:/*-letmein@ds155315.mlab.com:55315/vidjot-prod-prasad'}
}else{
    module.exports = {mongoURI : 'mongodb://localhost/vidjot-dev'
    }
}