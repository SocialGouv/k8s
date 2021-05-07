//
import fs from "fs";
import path from "path";
import "../../utils/mock-directory";
import { getEnvManifests } from "@socialgouv/kosko-charts/testing";
import { project } from "@socialgouv/kosko-charts/testing/fake/gitlab-ci.env";

jest.setTimeout(1000 * 60);

test("yaml: kosko generate --dev", async () => {
  const name = "myapp";
  const destFolder = `${process.cwd()}/environments/dev/yaml`;
  const sourceFile = path.join(__dirname, "redirect.yml");

  fs.mkdirSync(destFolder, { recursive: true });
  fs.copyFile(sourceFile, `${destFolder}/redirect.yml`, () => {});
  expect(
    await getEnvManifests("dev", "'!(_*)'", {
      ...project(name).dev,
      SOCIALGOUV_CONFIG_PATH: __dirname + "/config.json",
    })
  ).toMatchSnapshot();
});
