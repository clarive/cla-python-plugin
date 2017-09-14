var reg = require("cla/reg");

reg.register('service.python.run', {
    name: _('Run Python Code'),
    icon: '/plugin/cla-python-plugin/icon/python.svg',
    form: '/plugin/cla-python-plugin/form/python-form.js',
    handler: function(ctx, config) {

        var ci = require("cla/ci");
        var log = require("cla/log");
        var fs = require("cla/fs");
        var path = require('cla/path');
        var reg = require('cla/reg');
        var proc = require("cla/process");
        var CLARIVE_BASE = proc.env('CLARIVE_BASE');
        var CLARIVE_TEMP = proc.env('TMPDIR');
        var filePath;
        var errors = config.errors;
        var server = config.server;
        var response;
        var remoteTempPath = config.remoteTempPath;
        var isJob = ctx.stash("job_dir");
        var pythonPath = config.pythonPath;

        function remoteCommand(params, command, server, errors) {
            var output = reg.launch('service.scripting.remote', {
                name: _('Python execute code'),
                config: {
                    errors: errors,
                    server: server,
                    path: command,
                    output_error: params.output_error,
                    output_warn: params.output_warn,
                    output_capture: params.output_capture,
                    output_ok: params.output_ok,
                    meta: params.meta,
                    rc_ok: params.rcOk,
                    rc_error: params.rcError,
                    rc_warn: params.rcWarn
                }
            });
            return output;
        }

        function shipFiles(server, filePath, remoteTempPath) {
            var output = reg.launch('service.fileman.ship', {
                name: _('Python ship file'),
                config: {
                    server: server,
                    local_path: filePath,
                    remote_path: remoteTempPath
                }
            });
        }


        if (isJob) {
            filePath = path.join(isJob, "python-code.py");
            fs.createFile(filePath, config.code);
        } else {
            filePath = path.join(CLARIVE_TEMP, "python-code.py");
            fs.createFile(filePath, config.code);
        }

        var pythonArgs = config.pythonArgs || [];
        var pythonParams = pythonArgs.join(" ");
        var pythonCommand;
        if (pythonPath == '') {
            pythonCommand = "python ";
        } else {
            pythonCommand = pythonPath + " ";
        }

        shipFiles(server, filePath, remoteTempPath);
        var remoteFilePath = path.join(remoteTempPath, "python-code.py");
        var pythonRemoteCommand = pythonCommand + pythonParams + " " + remoteFilePath;

        log.info(_("Executing python code"));
        response = remoteCommand(config, pythonRemoteCommand, server, errors);
        reg.launch('service.scripting.remote', {
            name: _('Python remove file'),
            config: {
                errors: errors,
                server: server,
                path: "rm " + remoteFilePath
            }
        });
        log.info(_("Python code executed: "), response.output);
        fs.deleteFile(filePath);

        return response.output;
    }
});
