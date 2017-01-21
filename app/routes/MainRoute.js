module.exports = function(router) {
    router.use(function(req, res, next) {
        console.log('Something is happening.');
        next();
    });

    router.get('/', function(req, res) {
        res.json({ message: 'Welcome to our visudata api!' });
    });
}
