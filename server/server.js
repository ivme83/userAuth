const express         = require('express');
const path            = require('path');
const favicon         = require('serve-favicon');
const logger          = require('morgan');
const bodyParser      = require('body-parser');
const cors            = require('cors');
const PORT            = process.env.PORT || 3001;

const mongoose        = require('mongoose');
mongoose.Promise      = require('bluebird');
const MONGODB_URI     = process.env.MONGODB_URI || "mongodb://localhost/userAuthDB";
mongoose.connect(MONGODB_URI, { promiseLibrary: require('bluebird') })
  .then(() =>  console.log('connection succesful'))
  .catch((err) => console.error(err));

const book            = require('./routes/book');
const auth            = require('./routes/auth');
const app             = express();

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'false'}));
app.use(express.static(path.join(__dirname, 'client/build')));

app.use('/api/book', book);
app.use('/api/auth', auth);

// If no API routes are hit, send the React app
// app.use((req, res) => {
//   res.sendFile(path.join(__dirname, "../client/build/index.html"));
// });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// module.exports = app;

app.listen(PORT, function() {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});