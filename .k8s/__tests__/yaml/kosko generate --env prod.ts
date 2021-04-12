//
import fs from "fs"
import path from "path"
import { loadString } from "@kosko/yaml"
import { Manifest } from "@kosko/yaml"
import { getEnvManifests } from "@socialgouv/kosko-charts/testing"
import { project } from "@socialgouv/kosko-charts/testing/fake/gitlab-ci.env"

const yaml = fs.readFileSync(path.join(__dirname, "redirect.yml"), "utf8")
console.log("YAML", yaml);

const name = "myapp"

jest.setTimeout(1000 * 60)

beforeEach(() => {
  jest.clearAllMocks();
});

test("yaml: kosko generate --prod", async () => {
  jest.doMock("fs", () => ({
    existsSync: jest.fn().mockReturnValue(true),
    readdirSync: jest
      .fn()
      .mockReturnValue(["redirect.yaml"]),
  }));
  jest.doMock("@kosko/yaml", () => ({
    loadFile: (
      file,
      { transform }
    ) =>
      jest.fn().mockResolvedValueOnce(transform(loadString(yaml)[0])),
  }));
  expect(
    await getEnvManifests("prod", "'!(_*)'", {
      ...project(name).prod,
      SOCIALGOUV_CONFIG_PATH: __dirname + "/config.json",
    })
  ).toMatchSnapshot()
})

//
// import fs from "fs"
// import path from "path"
// import { loadString } from "@kosko/yaml"
// import { Manifest } from "@kosko/yaml"
// import { getEnvManifests } from "@socialgouv/kosko-charts/testing"
// import { project } from "@socialgouv/kosko-charts/testing/fake/gitlab-ci.env"

// const yaml = fs.readFileSync(path.join(__dirname, "redirect.yml"), "utf8")

// const name = "myapp"

// jest.setTimeout(1000 * 60)

// beforeEach(() => {
//   jest.clearAllMocks();
// });

// test("yaml: kosko generate --prod", async () => {
//   jest.doMock("fs", () => ({
//     existsSync: jest.fn().mockReturnValue(true),
//     readdirSync: jest
//       .fn()
//       .mockReturnValue(["redirect.yaml"]),
//   }));
//   jest.doMock("@kosko/yaml", () => ({
//     loadFile: (
//       file: string,
//       { transform }: { transform: (manifest: Manifest) => Manifest }
//     ) =>
//       jest.fn().mockResolvedValueOnce(transform(loadString(yaml)[0])),
//   }));
//   expect(
//     await getEnvManifests("prod", "'!(_*)'", {
//       ...project(name).prod,
//       SOCIALGOUV_CONFIG_PATH: __dirname + "/config.json",
//     })
//   ).toMatchSnapshot()
// })
