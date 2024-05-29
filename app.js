// **************************************************************
// Main file
// **************************************************************
var mongoGateway        = require( "./persistence/mongo-connection.js" );
var restify = require('restify');
var configServer = require('./configs/config-server.js');
var configPersistence = require('./configs/config-persistence.js');
var server = restify.createServer({
    "name": configServer.name,
    "version": configServer.version
});

server.use(
  function crossOrigin(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
  }
);

// Middleware
server.use(restify.queryParser());
server.use(restify.bodyParser());

// Function for process error
function processError( response, error ) {
    
    // Define language to return
    var lang = response.req.headers["accept-language"].split(',')[0];
    var i18n = require('i18n-nodejs')(lang, configServer.langErrorFile);
    var messageError = i18n.__(error.errorCode);

    response.setHeader( "Content-Type", "application/json" );
    switch ( error.type ) {
        case "App.Unauthorized":        
                response.writeHead( 401, i18n.__("401") );
        break;
        case "App.InvalidArgument":
            response.writeHead( 400, i18n.__("400") );
        break;
        case "App.NotFound":
            response.writeHead( 404, i18n.__("404") );
        break;
        default:
            response.writeHead( 500, i18n.__("500") );
        break;
    }

    response.end( 
        JSON.stringify({
            type: ( error.type || "" ),
            code: ( error.errorCode || "" ),
            message: ( messageError || error.message )
        })
    );
}

// Function for process response api
function processResponse(response, apiResponse) {
    apiResponse
        .then(
            function handleApiResolve( result ) {
                console.log("RESULT >>");
                console.log(result);
                var serializedResponse = JSON.stringify( result );
                console.log("RESULT JSON >>");
                console.log(serializedResponse);
                response.writeHead(
                    200,
                    "OK",
                    {
                        "Content-Type": "application/json",
                        "Content-Length": serializedResponse ? Buffer.byteLength(serializedResponse) : null
                    }
                );
                response.end( serializedResponse );
            }
        )
        .catch(function(reason){
            processError(response, reason);
        }).done();
}

// REST SERVICES
require("./services/user.service.js")(server, processResponse);
require("./services/widget.service.js")(server, processResponse);

// Try connection MongoDb
mongoGateway.connect( configPersistence.url )
	.then(
		function handleConnectResolve( mongo ) {

			server.listen(configServer.port, function () {
                console.log('%s listening at %s with MongoDB', server.name, server.url);
            });

		},
		function handleConnectReject( error ) {
            if (configPersistence.persistenceMode != 0) {
                server.listen(configServer.port, function () {
                    console.log('%s listening at %s without DataBase', server.name, server.url);
                });
            } else {
                console.log( "Connection to MongoDB failed." );
			    console.log( error );
            }
		}
	);




