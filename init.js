/**
 * @param {e.Request} req HTTP request context.
 * @param {e.Response} res HTTP response context.
 */
exports.init = (req, res) => {
    const bucketName = 'your-bucket-name';
    const authKey = 'very-secret-random-key';

    if (authKey === req.query.key) {
        try {
            const {Storage} = require('@google-cloud/storage');
            const storage = new Storage();
            const myBucket = storage.bucket(bucketName);

            const today = new Date().toISOString().slice(0, 10);
            const file = myBucket.file(today+'/'+uuidv4()+'.json');

            file.save(req.rawBody, {resumable: false}, function(err) {
                if (!err) {
                    res.status(200).send('OK');
                } else {
                    res.status(200).send(err.message);
                }
            });
        } catch (err) {
            res.status(200).send(err.message);
        }
    } else {
        res.status(404).send('Not Found');
    }

    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
};
