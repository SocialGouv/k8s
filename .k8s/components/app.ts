import env from "@kosko/env"

import config from "../../.socialgouv/config.json"

import * as app from "@socialgouv/kosko-charts/components/app"
import * as nginx from "@socialgouv/kosko-charts/components/nginx"

const { type } = config

const { create } = type === "app" ? app : nginx

const manifests = create(
  "app",
  type === "app"
    ? {
        env,
        config: { containerPort: 3000 },
        deployment: {
          container: {
            resources: {
              requests: {
                cpu: "50m",
                memory: "128Mi",
              },
              limits: {
                cpu: "200m",
                memory: "256Mi",
              },
            },
          },
        },
      }
    : { env }
)

export default manifests
