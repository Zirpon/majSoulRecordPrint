import webview
import sys
import os
import GLOBALS
import appUtils

GLOBALS._init()

if sys.platform.startswith('linux'):
    #print('当前系统为 Linux')
    GLOBALS.set_value('PLATFORM', 'linux')
    pass
elif sys.platform.startswith('win'):
    # windows pyinstaller 打包标记
    if getattr(sys, 'frozen', False) and hasattr(sys, '_MEIPASS'):
        import LOADINGS
        #print('running in a PyInstaller bundle')
        #print(sys._MEIPASS)
        GLOBALS.set_value('DEBUG', False)
        GLOBALS.set_value('BASE_PATH', sys._MEIPASS)
    else:
        GLOBALS.set_value('DEBUG', True)
        GLOBALS.set_value('BASE_PATH', os.path.abspath(os.curdir))
        # os.path.dirname(sys.argv[0])
    #print('当前系统为 Windows')
    GLOBALS.set_value('PLATFORM', 'win')
    pass
elif sys.platform.startswith('darwin'):
    # mac py2app 打包标记
    if len(sys._xoptions) > 0 and getattr(sys._xoptions, 'fronzen_modules', 'off'):
        GLOBALS.set_value('DEBUG', True)
        GLOBALS.set_value('BASE_PATH', os.path.abspath(os.curdir))
    else:
        #print('running in a py2app bundle')
        GLOBALS.set_value('DEBUG', False)
        GLOBALS.set_value('BASE_PATH', os.path.abspath(os.curdir))
    #print('当前系统为 macOS')
    GLOBALS.set_value('PLATFORM', 'darwin')
    pass

GLOBALS.set_value('CONFIG_FILE', "./setting.json")
GLOBALS.set_value('NEWTAB_URL', "./assets/newTab.html")
GLOBALS.set_value('INJECT_SCRIPT', "./src/browseinject.js")

DEBUG = GLOBALS.get_value('DEBUG')

# 打包会去掉标准输出 终端 要重定向
if not DEBUG:
    class Output:
        def __init__(self):
            self.text = ''

        def write(self, line):
            self.text += line
            with open(appUtils.formatUrl('./app_console.log'), 'w+', encoding='utf-8') as f:
                f.write(self.text)
                f.close()

        def writelines(self, lines):
            [self.write(line) for line in lines]

        def flush(self):
            with open(appUtils.formatUrl('./app_console.log'), 'w+', encoding='utf-8') as f:
                f.write(self.text)
                f.close()
            self.text = ''
    sys.stdout = Output()
    sys.stderr = Output()

print("DEBUG:" + str(GLOBALS.get_value('DEBUG')))
print("BASE_PATH:" + GLOBALS.get_value('BASE_PATH'))

from appJS import RecordApi
from appMenu import MenuApi
if __name__ == '__main__':
    windowtmp = webview.create_window(MenuApi.RecordWindowTitle, "https://cn.bing.com/",
        js_api=RecordApi(), text_select=True, zoomable=True, draggable=True)

    # 创建一个服务 实现跨域存储 #############################################
    # Define a couple of simple web apps using Bottleimport bottle
    import bottle
    from bottle import route, run, static_file
    app_hub = bottle.Bottle()

    @app_hub.route('/')
    def hello():
        return '<h1>Second Window</h1><p>This one is a web app and has its own server.</p>'

    @app_hub.route('/<filepath:path>')
    def server_static(filepath):
        print(GLOBALS.get_value('BASE_PATH')+'/assets/')
        return static_file(filepath, root=GLOBALS.get_value('BASE_PATH')+'/assets/')

    hub_window = webview.create_window(MenuApi.StorageWindowsTitle, app_hub,
                                       http_port=42001, text_select=True, zoomable=True, draggable=True, hidden=True)
    
    ########################################################################
    # 最后关闭跨域存储窗口
    def on_closedhub():
        GLOBALS.get_value('WINDOWS_SET').remove(hub_window)

    hub_window.events.closed += on_closedhub
    GLOBALS.set_value('HUB_WINDOW', hub_window)
    GLOBALS.set_value('WINDOWS_SET', [])
    GLOBALS.get_value('WINDOWS_SET').append(hub_window)

    ########################################################################
    def loadWindowUrl(window):
        # mac webkit 加载第一个页面失败 这是研究出来暂时使用的办法
        if GLOBALS.get_value('PLATFORM') == 'darwin':
            window.evaluate_js("alert('click me finished');")
            window.load_url(window.original_url)

        def on_closed():
            hub_window.show()
            GLOBALS.get_value('WINDOWS_SET').remove(window)
            if len(GLOBALS.get_value('WINDOWS_SET')) == 1 and GLOBALS.get_value('WINDOWS_SET')[0] == (GLOBALS.get_value('HUB_WINDOW')):
                GLOBALS.get_value('HUB_WINDOW').destroy()
        window.events.closed += on_closed
        GLOBALS.get_value('WINDOWS_SET').append(window)
    
    ########################################################################
    webview.start(loadWindowUrl, windowtmp, private_mode=False,
                  menu=MenuApi().menu_items, debug=DEBUG)
