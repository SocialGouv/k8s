import env from "@kosko/env"
import { create } from "@socialgouv/kosko-charts/components/hasura"
import { getHarborImagePath } from "@socialgouv/kosko-charts/utils/getHarborImagePath"

import config from "../../.socialgouv/config.json"

export default () => {
  const { name, hasura } = config

  return hasura
    ? create({
        env,
        deployment: {
          image: getHarborImagePath({ name: `${name}-hasura` }),
        },
      })
    : []
}
