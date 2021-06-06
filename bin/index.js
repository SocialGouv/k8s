#!/usr/bin/env node

const path = require('path');
const util = require('util');
const fs = require('fs-extra');
const exec = util.promisify(require('child_process').exec);

// Define directories pathes
const socialgouvEnvDir = path.join(__dirname, "../.socialgouv/environments");
const socialgouvCmpDir = path.join(__dirname, "../.socialgouv/components");
const k8sEnvDir = path.join(__dirname, "../.k8s/environments");
const k8sCmpDir = path.join(__dirname, "../.k8s/components");
const k8sEnvBakDir = path.join(__dirname, "../.k8s/environments.bak");
const k8sCmpBakDir = path.join(__dirname, "../.k8s/components.bak");

// Backup environments and components directory
const doBackups = async () => {
  try {
    await fs.copy(k8sEnvDir, k8sEnvBakDir);
    await fs.copy(k8sCmpDir, k8sCmpBakDir);
  } catch (error) {
    console.log("Error doBackups:", error);
  }
}

// Copy .socialgouv/environments and .socialgouv/components to .k8s directory
const copyEnvAndCmp = async () => {
  try {
    if (await fs.pathExists(socialgouvEnvDir)) {
      await fs.copy(socialgouvEnvDir, k8sEnvDir);
    }
    if (await fs.pathExists(socialgouvCmpDir)) {
      await fs.copy(socialgouvCmpDir, k8sCmpDir);
    }
  } catch (error) {
    console.log("Error copyEnvAndCmp:", error);
  }
}

// Install kosko charts dependencies
const installDependencies = async () => {
  try {
    const { stdout } = await exec('yarn --cwd .k8s');
    console.log(stdout);
  } catch (error) {
    console.log("Error installDependencies:", error);
  }
}

// Run kosko generate
const koskoGenerate = async () => {
  try {
    const { stdout } = await exec('yarn --cwd .k8s generate');
    console.log(stdout);
  } catch (error) {
    console.log("Error koskoGenerate:", error);
  }
}

// Backup environments and components directory
const restoreBackups = async () => {
  try {
    await fs.remove(k8sEnvDir);
    await fs.remove(k8sCmpDir);
    await fs.copy(k8sEnvBakDir, k8sEnvDir);
    await fs.copy(k8sCmpBakDir, k8sCmpDir);
    await fs.remove(k8sEnvBakDir);
    await fs.remove(k8sCmpBakDir);
  } catch (error) {
    console.log("Error restoreBackups:", error);
  }
}

const main = async () => {
  await doBackups();
  await copyEnvAndCmp();
  await installDependencies();
  await koskoGenerate();
  await restoreBackups();
}

main().catch((error) => {
  console.log(error);
  process.exit(1);
})
