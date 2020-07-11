const path = require('path')

exports.handler = (evt, ctx, cb) => {
    const {request} = evt.Records[0].cf
    console.log(request.uri)
    if (!path.extname(request.uri)) {
        request.uri = '/index.html'
    }

    cb(null, request)
}
