var reg = require("cla/reg");

reg.register('service.python.run', {
    name: _('Run Python Code'),
    icon: '/plugin/cla-python-plugin/icon/python.svg',
    form: '/plugin/cla-python-plugin/form/python-form.js',
    rulebook: {
        moniker: 'python_script',
        description: _('Executes a Python script'),
        required: ['server', 'code', 'remote_temp_path'],
        allow: ['server', 'code', 'remote_temp_path', 'user', 'python_path', 'python_args', 'errors'],
        mapper: {
            'remote_temp_path':'remoteTempPath',
            'python_path': 'pythonPath',
            'python_args': 'pythonArgs'
        },
        examples: [{
            python_script: {
                server: 'python_script',
                user: 'clarive_user',
                remote_temp_path: "/tmp/scripts/",
                python_path: "",
                python_args: "-d",
                code: `x = 1
          if x == 1:
            # indented four spaces 
            print("x is 1.");`,
                errors: "fail"
            }
        }]
    },
    handler: function(ctx, config) {

        var log = require("cla/log");
        var fs = require("cla/fs");
        var path = require('cla/path');
        var reg = require('cla/reg');
        var proc = require("cla/process");
        var CLARIVE_BASE = proc.env('CLARIVE_BASE');
        var CLARIVE_TEMP = proc.env('TMPDIR');
        var filePath;
        var errors = config.errors || "fail";
        var server = config.server;
        var response;
        var remoteTempPath = config.remoteTempPath || "/tmp";
        var isJob = ctx.stash("job_dir");
        var pythonPath = config.pythonPath || "";
        var fileName = "clarive-python-code-" + Date.now() + ".py";
        var user = config.user || "";


        function remoteCommand(params, command, server, errors, user) {
            var output = reg.launch('service.scripting.remote', {
                name: _('Python execute code'),
                config: {
                    errors: errors,
                    server: server,
                    user: user,
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

        function shipFiles(server, filePath, remoteTempPath, user) {
            var output = reg.launch('service.fileman.ship', {
                name: _('Python ship file'),
                config: {
                    user: user,
                    server: server,
                    local_path: filePath,
                    remote_path: remoteTempPath
                }
            });
        }


        if (isJob) {
            filePath = path.join(isJob, fileName);
            fs.createFile(filePath, config.code);
        } else {
            filePath = path.join(CLARIVE_TEMP, fileName);
            fs.createFile(filePath, config.code);
        }

        var pythonArgs = config.pythonArgs || [];
        var pythonParams = pythonArgs.join(" ");
        var pythonCommand;
        if (pythonPath == '' || !pythonPath) {
            pythonCommand = "python ";
        } else {
            pythonCommand = pythonPath + " ";
        }

        shipFiles(server, filePath, remoteTempPath, user);
        var remoteFilePath = path.join(remoteTempPath, fileName);
        var pythonRemoteCommand = pythonCommand + pythonParams + " " + remoteFilePath;

        log.info(_("Executing python code"));
        response = remoteCommand(config, pythonRemoteCommand, server, errors, user);
        reg.launch('service.scripting.remote', {
            name: _('Python remove file'),
            config: {
                user: user,
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