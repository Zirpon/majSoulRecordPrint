import bottle
from bottle import route, run, static_file
import webview
import sys
import os
import GLOBALS

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
        GLOBALS.set_value('DEBUG', False)
        GLOBALS.set_value('BASE_PATH',sys._MEIPASS)
        print(sys._MEIPASS)
    else:
        GLOBALS.set_value('DEBUG', True)
        GLOBALS.set_value('BASE_PATH', os.path.abspath(os.curdir))
        #os.path.dirname(sys.argv[0])
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
#print("DEBUG:"+str(GLOBALS.get_value('DEBUG')))
#print("BASE_PATH:"+GLOBALS.get_value('BASE_PATH'))

from appJS import RecordApi
from appMenu import MenuApi
if __name__ == '__main__':
    windowtmp = None
    if DEBUG:
        windowtmp = webview.create_window(MenuApi.RecordWindowTitle, "https://cn.bing.com/", js_api=RecordApi(), text_select=True, zoomable=True, draggable=True)
    else:
        #windowtmp = webview.create_window(MenuApi.RecordWindowTitle, "https://cn.bing.com/", js_api=RecordApi(), text_select=True, zoomable=True, draggable=True)
        windowtmp = webview.create_window(MenuApi.MajSoulWindowTitle, MenuApi.majSoul_url, js_api=RecordApi(), text_select=True, zoomable=True, draggable=True)
    def loadWindowUrl(window):
        # mac webkit 加载第一个页面失败 这是研究出来暂时使用的办法
        if GLOBALS.get_value('PLATFORM') == 'darwin':
            window.evaluate_js("alert('click me finished');")
            window.load_url(window.original_url)
    # Define a couple of simple web apps using Bottle
    app_hub = bottle.Bottle()
    @app_hub.route('/')
    def hello():
        return '<h1>Second Window</h1><p>This one is a web app and has its own server.</p>'
    
    @app_hub.route('/<filepath:path>')
    def server_static(filepath):
        return static_file(filepath, root='./assets/')

    #ddd = webview.create_window(MenuApi.StorageWindowsTitle, MenuApi.storage_url, text_select=True, zoomable=True, draggable=True, hidden=False)
   
    hub_window = webview.create_window(MenuApi.StorageWindowsTitle, app_hub, http_port=33333, text_select=True, zoomable=True, draggable=True, hidden=True)
    GLOBALS.set_value('HUB_WINDOW', hub_window)
    webview.start(loadWindowUrl, windowtmp, private_mode=False, menu=MenuApi().menu_items, debug=DEBUG)
    

