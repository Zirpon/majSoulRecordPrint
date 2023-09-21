import webview
import sys
from recordApi import  RecordApi
from menuApi import MenuApi

DEBUG = True
if getattr(sys, 'frozen', False) and hasattr(sys, '_MEIPASS'):
    print('running in a PyInstaller bundle')
    import loading
    DEBUG = False

if __name__ == '__main__':
    majWindow = webview.create_window(MenuApi.MajSoulWindowTitle, MenuApi.majSoul_url, js_api=RecordApi(), text_select=True, zoomable=True, draggable=True)
    #recordWindow = webview.create_window(MenuApi.RecordWindowTitle, MenuApi.record_url, js_api=RecordApi())
    webview.start(private_mode=False, menu=MenuApi().menu_items, debug=DEBUG)
