import webview
import sys
import os
import GLOBALS

GLOBALS._init()

if getattr(sys, 'frozen', False) and hasattr(sys, '_MEIPASS'):
    #print('running in a PyInstaller bundle')
    if sys.platform.startswith('linux'):
        #print('当前系统为 Linux')
        pass
    elif sys.platform.startswith('win'):
        import loading
        #print('当前系统为 Windows')
        pass
    elif sys.platform.startswith('darwin'):
        #print('当前系统为 macOS')
        pass
    GLOBALS.set_value('DEBUG', False)
    GLOBALS.set_value('BASE_PATH',sys._MEIPASS)
else:
    GLOBALS.set_value('DEBUG', True)
    GLOBALS.set_value('BASE_PATH', os.path.abspath(os.curdir))
    #os.path.dirname(sys.argv[0])

GLOBALS.set_value('CONFIG_FILE', "./setting.json")
GLOBALS.set_value('NEWTAB_URL', "./assets/newTab.html")
GLOBALS.set_value('INJECT_SCRIPT', "./src/browseinject.js")

DEBUG = GLOBALS.get_value('DEBUG')
#print("DEBUG:"+str(GLOBALS.get_value('DEBUG')))
#print("BASE_PATH:"+GLOBALS.get_value('BASE_PATH'))

from appJS import RecordApi
from appMenu import MenuApi
if __name__ == '__main__':
    majWindow = webview.create_window(MenuApi.MajSoulWindowTitle, MenuApi.majSoul_url, js_api=RecordApi(), text_select=True, zoomable=True, draggable=True)
    #recordWindow = webview.create_window(MenuApi.RecordWindowTitle, "https://www.baidu.com", js_api=RecordApi(), text_select=True, zoomable=True, draggable=True)
    webview.start(private_mode=False, menu=MenuApi().menu_items, debug=DEBUG)
