import env from "@kosko/env"
import { create } from "@socialgouv/kosko-charts/components/nginx"
import { getHarborImagePath } from "@socialgouv/kosko-charts/utils/getHarborImagePath"

import config from "../../.socialgouv/config.json"

export default () => {
  const { name, type } = <Config>config

  return type === "static"
    ? create(name, {
        env,
        deployment: {
          image: getHarborImagePath({ name }),
        },
      })
    : []
}
