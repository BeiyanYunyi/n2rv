import express from 'express';
import expressJwt from 'express-jwt';
import multer from 'multer';
import config from '../../config/config.json';
import expressjwtOptions from '../utils/expressJwtConstructor';

require('express-async-errors');

const localUploadRouter = express.Router();

// 不开放匿名 API，以防存储空间被匿名上传的玩意儿搞爆
localUploadRouter.use(expressJwt(expressjwtOptions));

const storage = multer.diskStorage({
  destination: config.upload.uploadFileStoragePath || 'uploads/',
  filename: (_req, file, cb) => {
    const filename = file.originalname.split('.');
    cb(null, `upload-${Date.now()}.${filename[filename.length - 1]}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (config.upload.allowAllImages && file.mimetype.startsWith('image/')) {
      return cb(null, true);
    }
    if (config.upload.allowedMimeType.find((type) => type === file.mimetype)) {
      return cb(null, true);
    }
    return cb(null, false);
  },
});

localUploadRouter.use(upload.single('image'));

localUploadRouter.post('/', async (req, res) => {
  const succMap: Record<string, string> = {};
  const errFiles: string[] = [];
  if (req.file) {
    succMap[req.file.originalname] = `/uploads/${req.file.filename}`;
  } else {
    errFiles.push('');
  }
  const dataToReturn = { errFiles, succMap };
  res.json({ msg: '', code: 0, data: dataToReturn });
});

export default localUploadRouter;
