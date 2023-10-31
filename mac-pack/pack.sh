pipenv run pip install -i http://mirrors.aliyun.com/pypi/simple \
	py2app pywebview \
	--trusted-host mirrors.aliyun.com 
pipenv graph

#py2applet --make-setup ./src/APP.py
rm -rf build dist 

pipenv run python3 py2app_setup.py py2app 

#pipenv uninstall --all
#pipenv --rm