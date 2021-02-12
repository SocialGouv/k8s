import env from "@kosko/env"
import { create } from "@socialgouv/kosko-charts/components/nginx"
import { getHarborImagePath } from "@socialgouv/kosko-charts/utils/getHarborImagePath"

import Config from "../utils/config"

export default () => {
  const { name, type } = Config()

  return type === "static"
    ? create(name, {
        env,
        deployment: {
          image: getHarborImagePath({ name }),
        },
      })
    : []
}
