# .k8s

A dynamic `.k8s` folder containing the configuration required by Kosko to generate Kubernetes manifests.

## Config

in `.socialgouv/config.json`

Only `name` and `type` are mandatory.


| Key                 | Type                | Description                                                                                                                                 |
| ------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| name                | string              | Application name                                                                                                                            |
| type                | "app" | "static"    | Deployment type: either `app` (Dockerfile) or `static`                                                                                      |
| hasura              | boolean | "exposed" | Add hasura container (if value is `exposed`, a dedicated hasura ingress will be created)                                                    |
| azurepg             | boolean             | Add an azurepg connection                                                                                                                   |
| probesPath          | object              | The base url for [kubernetes probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/) |
| probes              | object              | Custom [probes configuration](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#probe-v1-core)                           |
| resources           | object              | Custom [resources](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#resourcerequirements-v1-core)                       |
| subdomain           | string              | Force the default production subdomain.                                                                                                     |
| ingress.annotations | object              | Add custom [ingress annotations](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations)                     |
| registry            | "harbor" | "ghcr"   | Indicates which registry to use. Default is `harbor`                                                                                        |

Example :

```json
{
  "name": "myapp",
  "type": "app",
  "subdomain": "myapp-beta",
  "hasura": true,
  "probesPath": "/index.html",
  "ingress": {
    "annotations": {
      "nginx.ingress.kubernetes.io/configuration-snippet": "more_set_headers \"X-Answer: 42\";"
    }
  },
  "resources": {
    "requests": {
      "memory": "128Mi",
      "cpu": "200m"
    },
    "limits": {
      "memory": "256Mi",
      "cpu": "500m"
    }
  }
}
```

### Kubernetes

in `.socialgouv/environments`, add your config maps and sealed-secrets :

- dev : feature-branches
- preprod : deployed on new releases
- prod : deployed on new releases or manually

```
environments
 |-dev
    |-[name].configmap.yaml
    |-[name].sealed-secret.yaml
    |-pg.sealed-secret.yaml        # Postgres connection
    |-yaml
      |-another-ingress.yml
      |-some-netpol.yml
  ...
```

You can also provide additionnal kube manifests in each environment `yaml` subfolder.

### Dev

You can execute locally like this :

```sh
cd .k8s
yarn
export SOCIALGOUV_CONFIG_PATH=/path/to/config.json;
export $(grep -v '^#' .env.sample | xargs);
yarn -s generate
```
