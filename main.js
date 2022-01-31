import fs from "fs";
import ncp from "ncp";
import path from "path";
import { promisify } from "util";

const access = promisify(fs.access);
const copy = promisify(ncp);

async function copyTemplateFiles(options) {
  return copy(options.templateDirectory, options.targetDirectory, {
    clobber: false,
  });
}

export async function createProject(options) {
  options = {
    ...options,
    targetDirectory: path.resolve(process.cwd(), "仕様書"),
  };
  console.log(options);
  const currentFileUrl = import.meta.url;
  const templateDir = path.resolve(
    new URL(currentFileUrl).pathname.replace("/main.js", ""),
    "仕様書"
  );
  options.templateDirectory = templateDir;
  console.log(templateDir);

  try {
    await access(templateDir, fs.constants.R_OK);
  } catch (err) {
    console.error("%s Invalid template name", "ERROR");
    process.exit(1);
  }

  console.log("Copy project files");
  await copyTemplateFiles(options);

  console.log("%s Project ready", "DONE");
  return true;
}
