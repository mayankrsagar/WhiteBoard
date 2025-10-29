import fs from "fs";
import multer from "multer";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

// __dirname workaround for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    const dir = join(__dirname, "..", "img");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },

  filename: (_, file, cb) =>
    cb(
      null,
      `${file.fieldname}-${Date.now()}.${file.originalname.split(".").pop()}`
    ),
});

const upload = multer({ storage });
export default upload;
