import * as path from "path";
import * as assert from "assert";
import * as ttm from "azure-pipelines-task-lib/mock-test";
import * as exec from "child_process";

describe("CodeSigning Azure DevOps Extension", function (): void {
    this.timeout(20000);

    it("Should call signtool with configured parameters", (done: MochaDone) => {
        let tp: string = path.join(__dirname, "integration.callwithparams.js");
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();

        assert.equal(tr.succeeded, true, "should have succeeded");
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");

        done();
    });

    it("Should call signtool for all files that match pattern", (done: MochaDone) => {
        let tp: string = path.join(__dirname, "integration.callformatchingfiles.js");
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();

        assert.equal(tr.succeeded, true, "should have succeeded");
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");

        done();
    });

    it("If no files in root folder match given filter task should end with warnings", (done: MochaDone) => {
        let tp: string = path.join(__dirname, "integration.nofilesmatch.js");
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();

        assert.equal(tr.succeeded, true, "should have succeeded");
        assert.equal(tr.warningIssues.length, 1, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");

        done();
    });

    it("Should succeed signing AppBundles", (done: MochaDone) => {
        const signTool: string = path.join(__dirname, "../task/signtool.exe");
        const msixFile: string = path.join(__dirname, "test-files", "appbundle", "App.appxbundle");
        const certFile: string = path.join(__dirname, "test-files", "AppCertificate.pfx");
        const signCertPassword: string = "";

        exec.execFile(signTool,
            ["sign", "/fd", "SHA256", "/t", "http://timestamp.digicert.com", "/f", certFile, "/p", signCertPassword, msixFile],
            (error, stdout, stderr) => {
                if (error) {
                    throw error;
                }
                console.log(stderr);
                console.log(stdout);
                done();
            });
    });

    it("Should succeed signing AppPackage", (done: MochaDone) => {
        const signTool: string = path.join(__dirname, "../task/signtool.exe");
        const msixFile: string = path.join(__dirname, "test-files", "apppackage", "App.appx");
        const certFile: string = path.join(__dirname, "test-files", "AppCertificate.pfx");
        const signCertPassword: string = "";

        exec.execFile(signTool,
            ["sign", "/fd", "SHA256", "/t", "http://timestamp.digicert.com", "/f", certFile, "/p", signCertPassword, msixFile],
            (error, stdout, stderr) => {
                if (error) {
                    throw error;
                }
                console.log(stderr);
                console.log(stdout);
                done();
            });
    });

    it("Should succeed signing Exe", (done: MochaDone) => {
        const signTool: string = path.join(__dirname, "../task/signtool.exe");
        const msixFile: string = path.join(__dirname, "test-files", "exe", "App.exe");
        const certFile: string = path.join(__dirname, "test-files", "AppCertificate.pfx");
        const signCertPassword: string = "";

        exec.execFile(signTool,
            ["sign", "/fd", "SHA256", "/t", "http://timestamp.digicert.com", "/f", certFile, "/p", signCertPassword, msixFile],
            (error, stdout, stderr) => {
                if (error) {
                    throw error;
                }
                console.log(stderr);
                console.log(stdout);
                done();
            });
    });

    it("Should succeed signing DLL", (done: MochaDone) => {
        const signTool: string = path.join(__dirname, "../task/signtool.exe");
        const msixFile: string = path.join(__dirname, "test-files", "dll", "App.dll");
        const certFile: string = path.join(__dirname, "test-files", "AppCertificate.pfx");
        const signCertPassword: string = "";

        exec.execFile(signTool,
            ["sign", "/fd", "SHA256", "/t", "http://timestamp.digicert.com", "/f", certFile, "/p", signCertPassword, msixFile],
            (error, stdout, stderr) => {
                if (error) {
                    throw error;
                }
                console.log(stderr);
                console.log(stdout);
                done();
            });
    });
});