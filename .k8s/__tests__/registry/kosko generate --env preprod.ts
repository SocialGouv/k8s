//

import { getEnvManifests } from "@socialgouv/kosko-charts/testing"
import { project } from "@socialgouv/kosko-charts/testing/fake/gitlab-ci.env"

const name = "myapp"

jest.setTimeout(1000 * 60)
test("registry: kosko generate --preprod", async () => {
  expect(
    await getEnvManifests("preprod", "", {
      ...project(name).preprod,
      SOCIALGOUV_CONFIG_PATH: __dirname + "/config.json",
    })
  ).toMatchSnapshot()
})
