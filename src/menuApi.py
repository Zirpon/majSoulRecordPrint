import webview
import webview.menu as wm
from recordApi import RecordApi
import time
from os import path

class MenuApi():
    RecordWindowTitle = 'Record'
    MajSoulWindowTitle = 'MajSoul'
    ReactWindowsTitle = 'React'

    record_url = './assets/record.html'
    majSoul_url = 'https://game.maj-soul.com/1/'
    react_url = './assets/react.html'

    def __init__(self):
        pass

    # 搞不懂 VSCODE调试启动需要../assets/xxx才能加载url
    # 打包加载 就./assets/xxx
    def formatUrl(url):
        return path.abspath(url)
    
    @staticmethod
    def view_react():
        active_window = webview.active_window()
        active_window.set_title(MenuApi.ReactWindowsTitle)
        active_window.load_url(MenuApi.formatUrl(MenuApi.react_url))
    
    @staticmethod
    def view_record():
        active_window = webview.active_window()
        active_window.set_title(MenuApi.RecordWindowTitle)
        active_window.load_url(MenuApi.formatUrl(MenuApi.record_url))
        active_window.resize(1024, 1268)

    @staticmethod
    def view_majsoul():
        active_window = webview.active_window()
        active_window.set_title(MenuApi.MajSoulWindowTitle)
        active_window.load_url(MenuApi.majSoul_url)

    @staticmethod
    def click_me():
        active_window = webview.active_window()
        if active_window.title == MenuApi.MajSoulWindowTitle:
            with open('./src/browseinject.js','r',encoding='utf-8') as f:
                content = f.read()
                active_window.evaluate_js(content)
            f.close()
        else:
            active_window.title == MenuApi.RecordWindowTitle
            active_window.evaluate_js(r"""alert("click me finished");""")

    @staticmethod
    def do_nothing():
        pass

    @staticmethod
    def on_top():
        active_window = webview.active_window()
        active_window.on_top = not active_window.on_top
        """
        if active_window.on_top:
            active_window.evaluate_js("alert("已置顶");")
        else:
            active_window.evaluate_js("alert("已取消置顶");")
        """
    @staticmethod
    def newWindow():
        newTab = webview.create_window("New Tab", js_api=RecordApi(),
            url=MenuApi.formatUrl("../assets/newTab.html"),
            text_select=True, zoomable=True, draggable=True)

        """
        with open('./assets/newTab.html','r',encoding='utf-8') as f:
            content = f.read()
            webview.create_window(MenuApi.MajSoulWindowTitle, html=content, js_api=RecordApi())
        f.close()
        """
    @staticmethod
    def open_file_dialog():
        active_window = webview.active_window()
        active_window.create_file_dialog(webview.SAVE_DIALOG, directory='/', save_filename='test.file')

    menu_items = [
        wm.Menu(
            'Test Menu',
            [
                wm.MenuAction('雀魂中文服', view_majsoul),
                wm.MenuSeparator(),
                wm.MenuAction('战绩可视化网页', view_record),
                wm.MenuSeparator(),
                wm.MenuAction('React 测试网页', view_react),
            ],
        ),
        wm.Menu(
            '牌谱',
            [
                wm.MenuAction('获取牌谱数据', click_me),
                wm.MenuSeparator(),
            ],
        ),
        wm.MenuAction('新窗口', newWindow),
        wm.Menu(
            '设置',
            [
                #wm.MenuAction('置顶', on_top),
                wm.MenuSeparator(),
                wm.MenuAction('File Dialog', open_file_dialog),
                wm.MenuSeparator(),
                wm.Menu('about', [wm.MenuAction('v0.2', do_nothing)]),

            ],
        ),
    ]