pip3 install -i http://mirrors.aliyun.com/pypi/simple py2app pywebview --trusted-host mirrors.aliyun.com 
#py2applet --make-setup ./src/APP.py

#python3 py2app_setup.py py2app

Pyinstaller -F ./src/APP.py \
    --log-level=WARN \
    --noconfirm \
    --noconsole \
    --add-data "./assets/react.html:assets" \
    --add-data "./assets/newTab.html:assets" \
    --add-data "./webpack-demo/dist/:./webpack-demo/dist/" \
    --add-data "./src/browseinject.js:src" \
    --distpath ./pack/dist/ --workpath ./pack/build/ \
    -i ./mac-pack/majsoul.icns -n PrintApp --clean