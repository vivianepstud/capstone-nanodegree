const app = require("./app");

app.listen(8081, () => {
    console.log('App listening on port 8081!');
});

app.use(function errorHandler(err, req, res, next) {
    res.status(500)
    return res.send({ error: err });
})