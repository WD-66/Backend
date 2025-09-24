import { type RequestHandler } from 'express';
import formidable, { type Part } from 'formidable';

// 10mb
const maxFileSize = 10 * 1024 * 1024;

const filter = ({ mimetype }: Part) => {
  if (!mimetype || !mimetype.includes('image'))
    throw new Error('Only images are allowed', { cause: { status: 400 } });
  return true;
};

const processForm: RequestHandler = (req, res, next) => {
  const form = formidable({ filter, maxFileSize });

  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    // console.log('fields:', fields);
    // console.log('files:', files);

    if (!files || !files.image)
      throw new Error('Please upload a file.', { cause: { status: 400 } });

    req.body = fields;
    req.image = files.image[0];

    next();
  });
};

export default processForm;
