const asyncHandler = (requestHandler)=>
{
    return (req,res,next)=>
    {
        Promise.resolve(
            requestHandler(req,res,next)
        ).catch((err)=>next(err))    }
}

export {asyncHandler};
//give me a flow of this code by taking a asyncfunction as an example 



//asyncHandler → A higher-order function that takes your async route handler and returns a new function.
// requestHandler → The real route/controller function you want to run.

// Promise.resolve(...) → Wraps the function in a promise so .catch(...) will handle both:

// Errors thrown (throw new Error(...))

// Rejected promises (return Promise.reject(...))

// .catch((err) => next(err)) → Passes the error to Express’ built-in error handler (or your custom one).

// Returns a new function (req, res, next) that Express will call instead of your original handler.