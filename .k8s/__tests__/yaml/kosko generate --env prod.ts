//
import fs from "fs"
import path from "path"
import { getEnvManifests } from "@socialgouv/kosko-charts/testing"
import { project } from "@socialgouv/kosko-charts/testing/fake/gitlab-ci.env"

const sourceFilePath = path.join(__dirname, "redirect.yml")
const destFolderPath = path.join(__dirname, "../..", "environments/prod/yaml")
const destFilePath = path.join(destFolderPath, "redirect.yml")

const name = "myapp"

jest.setTimeout(1000 * 60)

beforeEach(() => {
  fs.mkdirSync(destFolderPath)
  fs.copyFile(sourceFilePath, destFilePath, () => {})
});

afterEach(() => {
  fs.rmdirSync(destFolderPath, { recursive: true })
})

test("yaml: kosko generate --prod", async () => {
  expect(
    await getEnvManifests("prod", "'!(_*)'", {
      ...project(name).prod,
      SOCIALGOUV_CONFIG_PATH: __dirname + "/config.json",
    })
  ).toMatchSnapshot()
})
