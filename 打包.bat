::https://pyinstaller.org/en/stable/man/pyinstaller.html
::https://zhuanlan.zhihu.com/p/577986794
::https://github.com/upx/upx/releases/tag/v4.1.0
::https://www.zhihu.com/question/268397385
::https://zhuanlan.zhihu.com/p/57674343
::https://www.zhihu.com/question/281858271
::https://blog.csdn.net/yetugeng/article/details/86665753
::https://hoganchen.gitbooks.io/batch-learn-notes/content/pi-chu-li-zhi-duo-xing-zhu-shi.html

GOTO start

@if 1==0 (
--exclude-module bottle
--exclude-module pywin32-ctypes ^
--exclude-module altgraph ^
--exclude-module tzdata ^
--exclude-module typing_extensions ^
--exclude-module pyinstaller-hooks-contrib ^
--exclude-module Pillow ^
--exclude-module numpy ^
--exclude-module pytz ^
--exclude-module cycler ^
--exclude-module fonttools ^
--exclude-module kiwisolver ^
--exclude-module pyparsing ^
--exclude-module python-dateutil ^
--exclude-module six ^
--upx-exclude "Qt*.dll" ^
--upx-exclude "PySide2\*.pyd" ^
--log-level=WARN
--add-data ".\assets\record.html;assets" ^
--add-data ".\assets\logo.jpg;assets" ^
--add-data ".\assets\bg1.jpg;assets" ^
--add-data ".\assets\bg2.jpg;assets" ^
--add-data ".\assets\bg4.png;assets" ^
--add-data ".\assets\bg5.jpg;assets" ^
--add-data ".\assets\loading.jpg;assets" ^
--add-data ".\assets\styles.css;assets" ^
--add-data ".\assets\slider.js;assets" ^
--add-data ".\assets\favicon.ico;assets" ^
--exclude-module pyinstaller ^
--nowindowed ^
--upx-dir "D:\Program Files\upx-4.1.0-win64" ^
)

::rm Pipfile.lock
::rm Pipfile
::pipenv run pip install -i http://mirrors.aliyun.com/pypi/simple pywebview scipy matplotlib pyinstaller --trusted-host mirrors.aliyun.com

:start

pipenv run pip install -i http://mirrors.aliyun.com/pypi/simple pywebview pyinstaller Pillow --trusted-host mirrors.aliyun.com 
pipenv graph

pipenv run Pyinstaller -F .\src\APP.py ^
    --log-level=WARN ^
    --noconfirm ^
    --noconsole ^
    --add-data ".\assets\react.html;assets" ^
    --add-data ".\assets\newTab.html;assets" ^
    --add-data ".\assets\hub.html;assets" ^
    --add-data ".\assets\hub.js;assets" ^
    --add-data ".\assets\favicon.ico;assets" ^
    --add-data ".\src\browseinject.js;src" ^
    --add-data ".\assets\dist\;./assets/dist/" ^
    --splash ".\webpack-demo\src\assets\images\loading.jpg" ^
    --distpath .\pack\dist\ --workpath .\pack\build\ ^
    -i .\majsoul.ico -n PrintApp --clean

copy /Y ".\pack\dist\PrintApp.exe" "."
copy /Y ".\pack\dist\PrintApp.exe" ".."
copy /Y ".\pack\dist\PrintApp.exe" "C:\\test\\"

::pipenv uninstall --all
::pipenv --rm

pause