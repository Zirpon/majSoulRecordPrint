import webview
import webview.menu as wm
from appJS import RecordApi
import time
from os import path
import GLOBALS
import appUtils

g_newtab_url = GLOBALS.get_value('NEWTAB_URL')
g_newtab_path = appUtils.formatUrl(g_newtab_url)

g_script_url = GLOBALS.get_value('INJECT_SCRIPT')
g_script_path = appUtils.formatUrl(g_script_url)

class MenuApi():
    RecordWindowTitle = 'Record'
    MajSoulWindowTitle = 'MajSoul'
    ReactWindowsTitle = 'React'
    StorageWindowsTitle = 'StorageAgent'

    record_url = './assets/dist/index.html'
    # 中文服
    majSoul_url = 'https://game.maj-soul.com/1/'
    # 日服
    jp_majSoul_url = 'https://game.mahjongsoul.com/'
    # 国际服
    usa_majsoul_url = 'https://mahjongsoul.game.yo-star.com'
    react_url = './assets/react.html'
    storage_url = './assets/hub.html'

    def __init__(self):
        pass
    
    @staticmethod
    def view_react():
        active_window = webview.active_window()
        active_window.set_title(MenuApi.ReactWindowsTitle)
        active_window.load_url((MenuApi.react_url))
    
    @staticmethod
    def view_record():
        active_window = webview.active_window()
        active_window.set_title(MenuApi.RecordWindowTitle)
        active_window.load_url(appUtils.formatUrl(MenuApi.record_url))
        active_window.resize(980, 850)

    @staticmethod
    def view_majsoul():
        active_window = webview.active_window()
        active_window.set_title(MenuApi.MajSoulWindowTitle)
        active_window.load_url(MenuApi.majSoul_url)

    @staticmethod
    def view_jp_majsoul():
        active_window = webview.active_window()
        active_window.set_title(MenuApi.MajSoulWindowTitle)
        active_window.load_url(MenuApi.jp_majSoul_url)

    @staticmethod
    def click_me():
        active_window = webview.active_window()
        if active_window.title == MenuApi.MajSoulWindowTitle:
            with open(g_script_path,'r',encoding='utf-8') as f:
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
        if active_window is not None:
            if not GLOBALS.get_value('DEBUG') and GLOBALS.get_value('PLATFORM') == 'win':
                active_window.evaluate_js("""alert("bug: windows no ontop");""")
                return

            active_window.on_top = not (active_window.on_top)
            if active_window.on_top:
                active_window.evaluate_js('alert("已置顶");')
            else:
                active_window.evaluate_js('alert("已取消置顶");')
            return
            """
            if MenuApi.RecordWindowTitle in active_window.title:
                active_window.title = MenuApi.RecordWindowTitle + (active_window.on_top and ' [已置顶]' or '')
            elif MenuApi.MajSoulWindowTitle in active_window.title:
                active_window.title = MenuApi.MajSoulWindowTitle + (active_window.on_top and ' [已置顶]' or '')
            elif MenuApi.ReactWindowsTitle in active_window.title:
                active_window.title = MenuApi.ReactWindowsTitle + (active_window.on_top and ' [已置顶]' or '')
            """
        else:
            pass
            
    @staticmethod
    def newWindow():
        newTab = webview.create_window("New Tab", js_api=RecordApi(),
            url=appUtils.formatUrl(g_newtab_path),
            text_select=True, zoomable=True, draggable=True)
        def on_closed():
            GLOBALS.get_value('WINDOWS_SET').remove(newTab)
            if len(GLOBALS.get_value('WINDOWS_SET')) == 1 and GLOBALS.get_value('WINDOWS_SET')[0] == (GLOBALS.get_value('HUB_WINDOW')):
                GLOBALS.get_value('HUB_WINDOW').destroy()
        newTab.events.closed += on_closed
        GLOBALS.get_value('WINDOWS_SET').append(newTab)
        return newTab
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
                wm.MenuAction('雀魂日服', view_jp_majsoul),
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
                wm.MenuAction('新窗口', newWindow),
            ],
        ),
        wm.Menu(
            '设置',
            [
                wm.MenuAction('置顶', on_top),
                #wm.MenuSeparator(),
                #wm.MenuAction('File Dialog', open_file_dialog),
                wm.MenuSeparator(),
                wm.Menu('about', [wm.MenuAction('v0.2', do_nothing)]),

            ],
        ),
    ]