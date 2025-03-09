import multer, { diskStorage } from "multer";

import { nanoid } from "nanoid";
import path from "path";
import fs from "fs";

export const fileValidation = {
  images: ["image/png", "image/jpg", "image/jpeg"],
  files: ["application/pdf"]

}
// if i use diskStorage
export const upload = (fileType, folder) => {
  const storage = diskStorage({
    destination: function (req, file, cb) {
      const folderPath = path.resolve(".", `${folder}/${req.user._id}`);
      // check if forlder exist or not
      if (fs.existsSync(folderPath)) {
        return cb(null, folderPath);
      }
      else {
        fs.mkdirSync(folderPath, { recursive: true });
        const filename = `${folder}/${req.user._id}`;
        cb(null, folderPath);
      }

    },
    filename: function (req, file, cb) {
      console.log(file);
      cb(null, nanoid() + "___" + file.originalname);
    }
  });

  const fileFilter = (req, file, cb) => {
    if (!fileType.includes(file.mimetype)) {
      cb(new Error("Invalid file type"), false);
    } else {
      cb(null, true);
    }
  };


  const multerUpload = multer({ storage: storage, fileFilter: fileFilter });
  return multerUpload;
}



//if i use cloudinary
// export const uploadCloud = (fileType) => {
//   const storage = diskStorage({});

//   const fileFilter = (req, file, cb) => {
//     if (!fileType.includes(file.mimetype)) {
//       cb(new Error("Invalid file type"), false);
//     } else {
//       cb(null, true);
//     }
//   }
//   const multerUpload = multer({ fileFilter,storage: storage });
//   return multerUpload;
// }

export const uploadCloud = (fileType =["image/png", "image/jpg", "image/jpeg"]) => {
  if (!Array.isArray(fileType)) {
    throw new Error("fileType must be an array of allowed MIME types");
  }

  const storage = diskStorage({}); // Adjust storage config if needed

  const fileFilter = (req, file, cb) => {
    console.log("Received file:", file); // Debugging log

    if (!file || !file.mimetype) {
      console.error("File or mimetype is missing");
      return cb(new Error("File or mimetype is missing"), false);
    }

    console.log("Allowed types:", fileType);
    console.log("Uploaded file type:", file.mimetype);

    if (!fileType.includes(file.mimetype)) {
      console.error("Invalid file type:", file.mimetype);
      return cb(new Error("Invalid file type"), false);
    }

    cb(null, true);
  };

  const multerUpload = multer({ storage, fileFilter });
  return multerUpload;
};