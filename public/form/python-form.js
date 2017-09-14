(function(params) {
    var data = params.data;

    var serverComboBox = Cla.ui.ciCombo({
        name: 'server',
        class: 'generic_server',
        fieldLabel: _('Server'),
        value: data.server || '',
        allowBlank: false,
        width: 400,
        with_vars: 1
    });
    
    var pythonPathTextField = Cla.ui.textField({
        name: 'pythonPath',
        fieldLabel: _('Python path'),
        value: params.data.pythonPath || '',
    });

    var argumentsTextField = Cla.ui.arrayGrid({
        name: 'pythonArgs',
        fieldLabel: _('Python parameters'),
        value: params.data.pythonArgs,
        description: _('Python parameters'),
        default_value: '.',
    });

    var pythonCodeEditor = Cla.ui.codeEditor({
        name: 'code',
        fieldLabel: _('Code Editor'),
        value: params.data.code || '',
        mode: 'python',
        height: 500,
        anchor: '100%'
    });

    var remoteTempPathTextField = Cla.ui.textField({
        name: 'remoteTempPath',
        fieldLabel: _('Remote temp path'),
        value: params.data.remoteTempPath || '/tmp',
        allowBlank: false
    });

    var errorBox = Cla.ui.errorManagementBox({
        errorTypeName: 'errors',
        errorTypeValue: params.data.errors || 'fail',
        rcOkName: 'rcOk',
        rcOkValue: params.data.rcOk,
        rcWarnName: 'rcWarn',
        rcWarnValue: params.data.rcWarn,
        rcErrorName: 'rcError',
        rcErrorValue: params.data.rcError,
        errorTabsValue: params.data
    });

    var panel = Cla.ui.panel({
        layout: 'form',
        items: [
            serverComboBox,
            pythonPathTextField,
            argumentsTextField,
            remoteTempPathTextField,
            pythonCodeEditor,
            errorBox
        ]
    });


    return panel;
})