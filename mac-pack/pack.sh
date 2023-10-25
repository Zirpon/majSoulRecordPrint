pip3 install -i http://mirrors.aliyun.com/pypi/simple py2app pywebview --trusted-host mirrors.aliyun.com 
#py2applet --make-setup ./src/APP.py
rm -rf build dist 

python3 py2app_setup.py py2app --report-missing-from-imports
