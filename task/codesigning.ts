import path = require("path");
import tl = require("azure-pipelines-task-lib/task");
import { ToolRunner } from "azure-pipelines-task-lib/toolrunner";
import fs = require("fs");

async function sign(signToolPath: string, filePath: string, hashingAlgorithm: string, timeServer: string, signCertPassword: string): Promise<number> {
  const signToolRunner: ToolRunner = tl.tool(signToolPath);
  let secureFilePath: string = tl.getTaskVariable("SECURE_FILE_PATH");
  console.log("Signing file: " + filePath);

  signToolRunner.arg("sign");
  signToolRunner.arg(["/fd", hashingAlgorithm]);
  signToolRunner.arg(["/t", timeServer]);
  signToolRunner.arg(["/f", secureFilePath]);
  signToolRunner.arg(["/p", signCertPassword]);
  signToolRunner.arg(filePath);

  return signToolRunner.exec(null);
}

async function run(): Promise<void> {
  try {
    tl.setResourcePath(path.join(__dirname, "task.json"));

    let signCertPassword: string = tl.getInput("signCertPassword", true);
    let timeServer: string = tl.getInput("timeServer", true);
    let hashingAlgorithm: string = tl.getInput("hashingAlgorithm", true);
    let filesPattern: string = tl.getInput("files", true);
    let signToolLocationMethod: string = tl.getInput("signToolLocationMethod", false);
    let signToolPath = path.resolve(__dirname, "./signtool.exe");

    if (signToolLocationMethod == "location") {
      let customSignToolPath: string = tl.getInput("signToolLocation", true);
      if (!customSignToolPath.endsWith("signtool.exe")) {
        throw `The path ${customSignToolPath} is invalid. Please use only valid files (signtool.exe).`
      }

      if (fs.existsSync(customSignToolPath)) {
        signToolPath = path.resolve(customSignToolPath);
      }
      else {
        throw `There is no signtool available at ${customSignToolPath}`;
      }
    }
    else if (signToolLocationMethod == "latest") {
      signToolPath = getLatestSignToolExe();
    }

    let filesToSign: string[] = tl.findMatch(null, filesPattern);
    if (!filesToSign || filesToSign.length === 0) {
      throw new Error(tl.loc("NoMatchingFiles", filesPattern));
    }
    for (let filePath of filesToSign) {
      await sign(signToolPath, filePath, hashingAlgorithm, timeServer, signCertPassword);
      console.log("Job Finished: Successfully signed file " + filePath + " with given certificate.");
    }
  } catch (err) {
    tl.setResult(tl.TaskResult.Failed, `${err}`);
  }
}

function getLatestSignToolExe() : string {
  let windowsKitDir: string = "C:\\Program Files (x86)\\Windows Kits\\10\\bin\\"
  if (!fs.existsSync(windowsKitDir)) {
    throw `There is no Windows 10 SDK installed at ${windowsKitDir}. You can choose a signtool with a custom path or use the built-in version.`;
  }

  let signToolPaths: string[] = findFilesInDir(windowsKitDir, "signtool.exe");
  let relativeSignToolPaths: string[] = signToolPaths.map(x => x.replace(windowsKitDir, ''));
  console.log(relativeSignToolPaths)
  return relativeSignToolPaths[0];
}

function findFilesInDir(startPath: string, filter: string): string[] {
  var results = [];
  var files = fs.readdirSync(startPath);
  for (var i = 0; i < files.length; i++) {
    var filename = path.join(startPath, files[i]);
    var stat = fs.lstatSync(filename);
    if (stat.isDirectory()) {
      results = results.concat(findFilesInDir(filename, filter));
    }
    else if (filename.endsWith(filter)) {
      results.push(filename);
    }
  }
  return results;
}

run();