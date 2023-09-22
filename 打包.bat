::https://pyinstaller.org/en/stable/man/pyinstaller.html
::https://zhuanlan.zhihu.com/p/577986794
::https://github.com/upx/upx/releases/tag/v4.1.0
::https://www.zhihu.com/question/268397385
::https://zhuanlan.zhihu.com/p/57674343
::https://www.zhihu.com/question/281858271

GOTO START
1、:: 注释内容（第一个冒号后也可以跟任何一个非字母数字的字符）
2、rem 注释内容（不能出现重定向符号和管道符号）
3、echo 注释内容（不能出现重定向符号和管道符号）〉nul
4、if not exist nul 注释内容（不能出现重定向符号和管道符号）
5、:注释内容（注释文本不能与已有标签重名）
6、%注释内容%（可以用作行间注释，不能出现重定向符号和管道符号）
7、goto 标签 注释内容（可以用作说明goto的条件和执行内容）
8、:标签 注释内容（可以用作标签下方段的执行内容）
::--log-level=WARN
:: --exclude-module bottle
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
::rm Pipfile.lock
::rm Pipfile


:START
pipenv run pip install -i http://mirrors.aliyun.com/pypi/simple pywebview scipy matplotlib pyinstaller --trusted-host mirrors.aliyun.com 
pipenv graph

Pyinstaller -F .\src\APP.py ^
    --log-level=WARN ^
    --nowindowed ^
    --noconfirm ^
    --noconsole ^
    --exclude-module pyinstaller ^
    --add-data ".\assets\record.html;assets" ^
    --add-data ".\assets\react.html;assets" ^
    --add-data ".\assets\newTab.html;assets" ^
    --add-data ".\assets\logo.jpg;assets" ^
    --add-data ".\assets\bg1.jpg;assets" ^
    --add-data ".\assets\bg2.jpg;assets" ^
    --add-data ".\assets\bg4.png;assets" ^
    --add-data ".\assets\bg5.jpg;assets" ^
    --add-data ".\assets\favicon.ico;assets" ^
    --add-data ".\assets\loading.jpg;assets" ^
    --add-data ".\assets\styles.css;assets" ^
    --add-data ".\assets\slider.js;assets" ^
    --add-data ".\src\browseinject.js;src" ^
    --upx-dir "D:\Program Files\upx-4.1.0-win64" ^
    --splash ".\assets\loading.jpg" ^
    --distpath .\pack\dist\ --workpath .\pack\build\ ^
    -i .\majsoul.ico -n PrintApp --clean

copy /Y ".\pack\dist\PrintApp.exe" "."
copy /Y ".\pack\dist\PrintApp.exe" ".."
copy /Y ".\pack\dist\PrintApp.exe" "C:\\test\\"

::pipenv uninstall --all
::pipenv --rm

pause