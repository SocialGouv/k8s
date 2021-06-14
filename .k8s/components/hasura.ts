import env from "@kosko/env";
import { create } from "@socialgouv/kosko-charts/components/hasura";
import { getHarborImagePath } from "@socialgouv/kosko-charts/utils/getHarborImagePath";
import Config from "../utils/config";

export default () => {
  const { name, hasura } = Config();

  return hasura
    ? create("hasura", {
        env,
        config: { ingress: hasura === "exposed" },
        deployment: {
          image: getHarborImagePath({ name: `${name}-hasura` }),
        },
      })
    : [];
};
