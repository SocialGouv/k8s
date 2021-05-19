//

import fsx from "fs-extra";
import path from "path";
import { getEnvManifests } from "@socialgouv/kosko-charts/testing";
import { project } from "@socialgouv/kosko-charts/testing/fake/gitlab-ci.env";

// changes the cwd to a tmp folder
import "../../utils/mock-directory";

jest.setTimeout(1000 * 60);

test("yaml: kosko generate --prod", async () => {
  const name = "myapp";
  const destFolder = `${process.cwd()}/environments/prod/yaml`;
  const sourceFile = path.join(__dirname, "redirect.yml");

  await fsx.mkdir(destFolder, { recursive: true });
  await fsx.copyFile(sourceFile, `${destFolder}/redirect.yml`);

  expect(
    await getEnvManifests("prod", "'!(_*)'", {
      ...project(name).prod,
      SOCIALGOUV_CONFIG_PATH: __dirname + "/config.json",
    })
  ).toMatchSnapshot();
});
