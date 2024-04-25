# Welcom to MedCare Clinic Patient Scheduler!
# Overview
This repo contains the backend and frontend(coming soon) of the CS340 project. 

# Backend Setup
- Backend uses flask
- To setup the backend, it's reccomneded to use a virtual env.
## Setting up venv
1. Install venv if you don't already have it 
	- `pip install virtualenv` 
2. Change to dir of python project and create virtual environment
	- `cd /path/to/project` 
	- `python<version> -m venv <virtual env name>`
		- EX: `python3 -m venv env`
		- -m specifies the module name, searching `sys.path` for the named module and runs the corresponding *.py* file as a script, in this case, *venv*
3.  Activate the virtual environment with:
	- Linux OS:
		-  `source <virutal env name>/bin/activate`
		- Ex: `source env/bin/activate
	- Windows CMD prompt:
		- `<virtual env name>/Scripts/activate.bat`
	- Windows PowerShell:
		- `<virtual env name>/Scripts/activate.ps1`
4. Install packages in your new virtual environment!
	- To install packages from `requirements.txt` use
		- `pip install -r requirements.txt`
5. When done with virtual environment, deactivate it with
	- `deactivate` 
## Setting up DB User config
- create the file [backend/db_user.config] 
- Add your login information in the following format:
```config
[User.<your_name>]
user = cs340_<username> #This should be your mysql username
ps = <mysql ps>

```
- Then within [backend/app.py] look for `user_name` within the `read_config` function and change it to the name you entered as the table header in the config file. 
    - This will now connect the app to your database
## Running app
- To start running the flask app, make sure all dependencies are installed then run 
`python3 app.py`
- This should start a localhost server to view the return of the executed sql statements within [backend/app.py]
- You may need gunicorn to installed to have the app build correctly, I'd reccomend [this tutorial](https://github.com/osu-cs340-ecampus/flask-starter-app?tab=readme-ov-file#gunicorn) for setting that up with flask and if any other problems occur [this guide](https://github.com/osu-cs340-ecampus/flask-starter-app?tab=readme-ov-file#gunicorn) is also a great place to check the steps. 