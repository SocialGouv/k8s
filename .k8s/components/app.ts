import env from "@kosko/env"

import config from "../../socialgouv.json"

import app from "@socialgouv/kosko-charts/components/app"
import nginx from "@socialgouv/kosko-charts/components/nginx"

const { type } = config

if (type === "app") {
  const { create } = app

  const manifests = create("app", {
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
  })
} else {
  const { create } = nginx

  const manifests = create("app", {
    env,
  })
}

export default manifests
