# Python Plugin

The Python plugin will allow you to execute a Python code on the server of your choice in Clarive and to see its result.

## What is Python

Python is an interpreted, object-oriented, high-level programming language with dynamic semantics. Its high-level,
built-in data structures, combined with dynamic typing and dynamic binding, make it very attractive for Rapid
Application Development, as well as for use as a scripting or glue language for connecting existing components.

## Requirements

To be able to use the plugin correctly, you must have Python installed on the server where you wish to execute the code.

## Installing

To install the plugin, place the `cla-python-plugin` folder inside `CLARIVE_BASE/plugins` directory in the Clarive
instance.

## How to Use

Once the plugin is placed in its folder, you can start using it by going to your Clarive instance.

After restarting your Clarive instance, you will have a new palette service called 'Run Python Code'.

### Run Python Code

The service will execute the code you write in it on the server you specify.  The service will create a temporary file
with the code, which will be shipped to the specified server.

The parameters available for this service are:

- **Server** - The GenericServer Resource where you wish to execute the code.
- **Python path** - Full path for Python launching script, including the file. If you leave it empty, the plugin will
  launch *Python* as a system environment variable.
- **Python parameters** - Additional flags for the Python command.
- **Remote temp path** - Temporary path to which the file with the code will be shipped.
- **Python code editor** - Enter here the code you wish to execute.
- **Errors and Output** - These two fields deal with managing control errors. The options are:
   - **Fail and Output Error** - Search for the configured error pattern in script output. If found, an error message is
     displayed in the monitor showing the match.
   - **Warning and Output warning** - Search for configured warning pattern in script output. If found, an error message
     is displayed in the monitor showing the match.
   - **Custom** - If combo box errors is set to custom, a new form is displayed to define the behavior with these
     fields:
   - **Ok** - Range of return code values for the script to have succeeded. No message will be displayed in the monitor.
   - **Warn** - Range of return code values to warn the user. A warning will be displayed in the  monitor.
   - **Error** - Range of return code values for the script to have failed. An error message will be displayed in the
     monitor.

The plugin will return all the console output you set in the Python code.

Configuration example:

      Server: python_server
      Python path: /sytem/python.sh
      Python parameters: -d
      Remote temp path: /tmp
      Code Editor: parents, babies = (1, 1)
                        while babies < 100:
                        print 'This generation has {0} babies'.format(babies)
                        parents, babies = (babies, parents + babies)
