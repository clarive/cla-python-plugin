# Python Plugin

<img src="https://cdn.rawgit.com/clarive/cla-python-plugin/master/public/icon/python.svg?sanitize=true" alt="Python Plugin" title="Python Plugin" width="120" height="120">

The Python plugin will allow you to execute a Python code on the server of your choice in Clarive and to see its result.

## What is Python

Python is an interpreted, object-oriented, high-level programming language with dynamic semantics. Its high-level,
built-in data structures, combined with dynamic typing and dynamic binding, make it very attractive for Rapid
Application Development, as well as for use as a scripting or glue language for connecting existing components.

## Requirements

To be able to use the plugin correctly, you must have Python installed on the server where you wish to execute the code.

## Installing

To install the plugin, place the `cla-python-plugin` folder inside `$CLARIVE_BASE/plugins` directory in the Clarive
instance.

## Parameters

The service will execute the code you write in it on the server you specify.  The service will create a temporary file
with the code, which will be shipped to the specified server.

The parameters available for this service are:

- **Server (variable name: server)** - The GenericServer Resource where you wish to execute the code.
- **User (user)** - User which will be used to connect to the server.
- **Python path (python_path)** - Full path for Python launching script, including the file. If you leave it empty, the plugin will
  launch *Python* as a system environment variable.
- **Python parameters (python_args)** - Additional flags for the Python command.
- **Remote temp path (remote_temp_path)** - Temporary path to which the file with the code will be shipped.
- **Python code editor (code)** - Enter here the code you wish to execute.

**Only Clarive EE**

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

## How to use

### In Clarive EE

Once the plugin is placed in its folder, you can find this service in the palette in the section of generic service and can be used like any other palette op.

Op Name: **Run Python code**

Example:

```yaml
      Server: python_server
      Python path: /sytem/python.sh
      Python parameters: -d
      Remote temp path: /tmp
      Code Editor: parents, babies = (1, 1)
                        while babies < 100:
                        print 'This generation has {0} babies'.format(babies)
                        parents, babies = (babies, parents + babies)
``` 

### In Clarive SE

#### Rulebook

If you want to use the plugin through the Rulebook, in any `do` block, use this ops as examples to configure the different parameters:

```yaml
rule: Python demo
do:
   - python_script:
       server: python_server   # Required. Use the mid set to the resource you created
       user: ${username}
       remote_temp_path: "/tmp" # Required
       python_args: ["-d"]            
       code: |                  # Required
          x = 1
          if x == 1: 
            print("x is 1.");
```

##### Outputs

###### Success

The plugin will return all the console output you set in the Python code.

```yaml
do:
    - myvar = python_script:
       server: python_server   # use the mid set to the resource you created
       user: "clarive_user"
       remote_temp_path: "/tmp"
       python_args: ["-d"]          
       code: |
          x = 1
          if x == 1: 
            print("x is 1.");
    - echo: ${myvar}
```

For this command the output will be similar to this one:

```yaml
x is 1. 
```

###### Possible configuration failures

**Code failed**

```yaml
Error running remote script
```

Make sure that the option is available and you code is correct to be executed in Python.

**Variable required**

```yaml
Error in rulebook (compile): Required argument(s) missing for op "python_script": "server"
```

Make sure you have all required variables defined.

**Not allowed variable**

```yaml
Error in rulebook (compile): Argument `Code` not available for op "python_script"
```

Make sure you are using the correct paramaters (make sure you are writing the variable names correctly).

## More questions?

Feel free to join **[Clarive Community](https://community.clarive.com/)** to resolve any of your doubts.