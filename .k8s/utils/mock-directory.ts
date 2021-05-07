//

import path from "path";
import fsx from "fs-extra";
import { directory } from "tempy";

const cwd = process.cwd();

beforeEach(async () => {
  process.chdir(directory());

  const tmp = process.cwd();

  await fsx.symlink(path.join(__dirname, "..", "utils"), `${tmp}/utils`);
  await fsx.copy(path.join(__dirname, "..", "components"), `${tmp}/components`);
  await fsx.symlink(
    path.join(__dirname, "..", "kosko.toml"),
    `${tmp}/kosko.toml`
  );
  await fsx.symlink(
    path.join(__dirname, "..", "node_modules"),
    `${tmp}/node_modules`
  );
  await fsx.symlink(
    path.join(__dirname, "..", "tsconfig.json"),
    `${tmp}/tsconfig.json`
  );
});

afterEach(() => {
  process.chdir(cwd);
});
