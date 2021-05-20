# .k8s

A dynamic `.k8s` folder containing the configuration required by Kosko to generate Kubernetes manifests.

## Config

in `.socialgouv/config.json`

| Key                 | Description                                                                                                                                 |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| name                | application name                                                                                                                            |
| type                | app (Dockerfile), static                                                                                                                    |
| hasura              | add hasura container                                                                                                                        |
| azurepg             | add an azurepg connection                                                                                                                   |
| probesPath          | The base url for [kubernetes probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/) |
| probes              | Custom [probes configuration](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#probe-v1-core)                           |
| resources           | Custom [resources](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#resourcerequirements-v1-core)                       |
| subdomain           | force the default production subdomain.                                                                                                     |
| ingress.annotations | add custom ingress annotations                                                                                                              |

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
