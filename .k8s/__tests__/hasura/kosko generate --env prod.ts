//

import { getEnvManifests } from "@socialgouv/kosko-charts/testing"
import { project } from "@socialgouv/kosko-charts/testing/fake/gitlab-ci.env"

const name = "myapp"

jest.setTimeout(1000 * 60)

test("hasura: kosko generate --prod", async () => {
  expect(
    await getEnvManifests("prod", "'!(_*)'", {
      ...project(name).prod,
      SOCIALGOUV_CONFIG_PATH: __dirname + "/config.json",
    })
  ).toMatchSnapshot()
})

test("hasura with ingress: kosko generate --prod", async () => {
  expect(
    await getEnvManifests("prod", "'!(_*)'", {
      ...project(name).prod,
      SOCIALGOUV_CONFIG_PATH: __dirname + "/config-with-ingress.json",
    })
  ).toMatchSnapshot()
})
