const {app, port} = require('./app');

// This has to be in its own file, otherwise "npm test" hangs infinitely once tests are done.
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
