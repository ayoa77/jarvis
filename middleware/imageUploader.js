
var multer = require('multer');
exports.poster = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './app/public/uploads')
    },
    filename: function (req, file, cb) {
        var getFileExt = function (fileName) {
            var fileExt = fileName.split(".");
            if (fileExt.length === 1 || (fileExt[0] === "" && fileExt.length === 2)) {
                return "";
            }
            return fileExt.pop();
        }
        cb(null, req.params.id + '.' + getFileExt(file.originalname))
    }
});
exports.screenshots = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './app/public/uploads')
    },
    filename: function (req, file, cb) {
        var getFileExt = function (fileName) {
            var fileExt = fileName.split(".");
            if (fileExt.length === 1 || (fileExt[0] === "" && fileExt.length === 2)) {
                return "";
            }
            return fileExt.pop();
        }
        cb(null, Date.now() + '.' + getFileExt(file.originalname)) //need to include user identification here on file naming
    }
});
exports.thumbnail = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log('thumbfunction')
        cb(null, './app/public/uploads')
    },
    filename: function (req, file, cb) {
        var getFileExt = function (fileName) {
            var fileExt = fileName.split(".");
            if (fileExt.length === 1 || (fileExt[0] === "" && fileExt.length === 2)) {
                return "";
            }
            return fileExt.pop();
        }
        cb(null, req.params.id + '_tb.' + getFileExt(file.originalname))
    }
});
