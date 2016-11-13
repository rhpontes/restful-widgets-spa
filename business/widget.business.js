var Q = require( "q" );
var widgetModel = require('../models/widget.model.js');
var Validator = require('jsonschema').Validator;
var v = new Validator();
var appError = require('../models/error.model.js').createAppError;
var widgetPersistence = require('../persistence/factory.persistence.js')("widget");

exports.listWidgets = listWidgets;
exports.getWidget = getWidget;
exports.addWidget = addWidget;
exports.updateWidget = updateWidget;

function listWidgets(req, res) {
    var deferred = Q.defer();
    widgetPersistence.listAll()
        .then(function(result){
            deferred.resolve(result);
        },
        function(reason){
            deferred.reject(reason);
        });
    return(deferred.promise);
};

function getWidget(req, res) {
    var deferred = Q.defer();
    widgetPersistence.getWidget(req.params.id)
        .then(function(result){
            deferred.resolve(result);
        },
        function(reason){
            deferred.reject(reason);
        });
    return(deferred.promise);
};

function addWidget(req, res) {
    var deferred = Q.defer();
    
    // Do validate new object
    if(!v.validade(req.body, widgetModel))
    {
        deferred.reject(appError({
            type: "Exception", 
            errorCode: "b1"
        }));
        return(deferred.promise);
    }
    
    widgetPersistence.addWidget(req.body)
        .then(function(result){
            deferred.resolve(result);
        },
        function(reason){
            deferred.reject(reason);
        });
    return(deferred.promise);
};

function updateWidget(req, res) {
    var deferred = Q.defer();
    
    // Do validate new object
    if(!v.validade(req.body,widgetModel))
    {
        deferred.reject(appError({
            type: "Exception", 
            errorCode: "b1"
        }));
        return(deferred.promise);
    }
    
    widgetPersistence.updateWidget(req.body)
        .then(function(result){
            deferred.resolve(result);
        },
        function(reason){
            deferred.reject(reason);
        });
        
    return(deferred.promise);
};