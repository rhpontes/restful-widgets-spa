var userBusiness = require('../business/user.business.js');

module.exports = function(server, processResponse) {
    
    server.get("/users", function (req, res, next) {
        processResponse(res, userBusiness.listUsers(req, res));
        return next();
    });
    
    server.get('/users/:id', function (req, res, next) {
        processResponse(res, userBusiness.getUser(req, res));
        return next();
    });
    
};