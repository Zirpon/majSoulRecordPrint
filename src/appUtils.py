from os import path
import  GLOBALS    

# 搞不懂 VSCODE调试启动需要../assets/xxx才能加载url
# 打包加载 就./assets/xxx
# https://pyinstaller.org/en/stable/runtime-information.html?highlight=_MEIPASS
# https://blog.csdn.net/Jayden_Gu/article/details/94134409
# https://zhuanlan.zhihu.com/p/269495918

"""
print os.getcwd()#获得当前工作目录
print os.path.abspath('.')#获得当前工作目录
print os.path.abspath('..')#获得当前工作目录的父目录
print os.path.abspath(os.curdir)#获得当前工作目录
"""

def formatUrl(url):
    return resource_path(path.join(url))
    return path.abspath(url)

def resource_path(relative_path):
    return path.join(GLOBALS.get_value('BASE_PATH'), relative_path)