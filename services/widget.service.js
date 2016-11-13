var widgetBusiness = require('../business/widget.business.js');

module.exports = function(server, processResponse) {
    
    server.get("/widgets", function (req, res, next) {
        processResponse(res, widgetBusiness.listWidgets(req, res));
        return next();
    });
    
    server.get('/widgets/:id', function (req, res, next) {
        processResponse(res, widgetBusiness.getWidget(req, res));
        return next();
    });
    
    server.post('/widgets', function (req, res, next) {
        processResponse(res, widgetBusiness.addWidget(req, res));
        return next();
    });
    
    server.put('/widgets/:id', function (req, res, next) {
        processResponse(res, widgetBusiness.updateWidget(req, res));
        return next();
    });
    
};