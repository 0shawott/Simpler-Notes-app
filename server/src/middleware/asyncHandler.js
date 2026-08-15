// Wraps an async route handler so any thrown error / rejected promise
// gets forwarded to next(err) automatically, instead of every controller
// needing its own try/catch block.
//
// Usage: router.get('/notes', asyncHandler(notesController.list));
function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;