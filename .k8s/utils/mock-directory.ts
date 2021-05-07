import fs from "fs"
import path from "path"
import fsx from "fs-extra"
import { directory } from "tempy";

export default () => {
  const cwd = directory();

  fs.symlinkSync(path.join(__dirname, "..", "utils"), `${cwd}/utils`)
  fsx.copySync(path.join(__dirname, "..", "components"), `${cwd}/components`)
  fs.symlinkSync(path.join(__dirname, "..", "kosko.toml"), `${cwd}/kosko.toml`)
  fs.symlinkSync(path.join(__dirname, "..", "node_modules"), `${cwd}/node_modules`)
  fs.symlinkSync(path.join(__dirname, "..", "tsconfig.json"), `${cwd}/tsconfig.json`)

  return cwd
}
