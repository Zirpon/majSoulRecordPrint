import webview
import majSoulRecordTransformer as transformer
import json
from os import path
import webview.menu as wm

"""
This example demonstrates how to create a pywebview api without using a web
server
"""

ApiWindowTitle = 'API'
MajSoulWindowTitle = 'MajSoul'

class Api:
    def __init__(self):
        if path.exists("setting.json"):
            with open("setting.json",'r+',encoding='utf-8') as load_f:
                transformer.settingDict = json.load(load_f)
                transformer.MJSoulID = transformer.settingDict['MJSoulID']
                transformer.MJSoulName = transformer.settingDict['MJSoulName']
            transformer.LoadData()

    def setIdName(self, id, name, n):
        transformer.MJSoulID = int(id)
        transformer.MJSoulName = name
        transformer.recentGameN = int(n)
        transformer.settingDict["MJSoulID"] = int(id)
        transformer.settingDict["MJSoulName"] = name
        with open("setting.json",'w',encoding='utf-8') as load_f:
            json.dump(transformer.settingDict, load_f, indent=2, sort_keys=False, ensure_ascii=False)  # 写为多行

        response = {'message': 'Hello {0} {1} {2}!'.format(int(id), name, n)}
        return response
    
    def loadData(self):
        count_list, sortedCountList = transformer.LoadData()
        #print(self.count_list, self.sortedCountList)
        #print(transformer.MJSoulName, transformer.MJSoulID)
        response = {'message': 'loadData \n\n\n<p>{0}<p>\n\n\n\n\n<p>{1}<p><p><p>'.
                    format(count_list, sortedCountList)}
        return response

    def printCountList(self):
        transformer.LoadData()
        sortedCountList = transformer.printCountList()
        response = {'message': 'printCountList \n\n\n<p>{0}<p>\n\n\n\n\n<p><p><p><p>'.
                    format(sortedCountList)}
        return response       

    def printCSV(self):
        transformer.LoadData()
        transformer.printCountList()
        csvFileName = transformer.printCSV()
        response = {'message': 'printCSV \n\n\n<p>{0}<p>\n\n\n\n\n<p><p><p><p>'.
                    format(csvFileName)}
        return response

    def graphicCSV(self, n):
        transformer.recentGameN = int(n)
        transformer.LoadData()
        transformer.printCountList()
        transformer.printCSV()
        nn = transformer.graphicCSV()
        response = {'message': 'graphicCSV \n\n\n<p>战绩图表已生成 {0}<p>\n\n\n\n\n<p><p><p><p>'.format(nn)}
        return response

    def error(self):
        raise Exception('This is a Python exception')

class menuApi():
    def __init__(self):
        self.menu_items = [
            wm.Menu(
                'Test Menu',
                [
                    wm.MenuAction('Change Active Window Content', self.change_active_window_content),
                    wm.MenuSeparator(),
                    wm.Menu(
                        'Random',
                        [
                            wm.MenuAction('获取牌谱数据', self.click_me),
                            wm.MenuAction('File Dialog', self.open_file_dialog),
                        ],
                    ),
                ],
            ),
            wm.MenuAction('置顶', self.on_top),
            wm.Menu('about', [wm.MenuAction('v0.2', self.do_nothing)]),
        ]

    def change_active_window_content(self):
        active_window = webview.active_window()
        with open('./assets/test.html','r',encoding='utf-8') as f:
            content = f.read()
            active_window.load_html(content)
        f.close()

    def click_me(self):
        active_window = webview.active_window()
        if active_window.title == MajSoulWindowTitle:
            with open('./assets/browseinject.js','r',encoding='utf-8') as f:
                content = f.read()
                active_window.evaluate_js(
                    content + 
                    r"""
                    """
                )
            f.close()
        elif active_window.title == ApiWindowTitle:
            active_window.evaluate_js(r"""alert("click me finished");""")

    def do_nothing(self):
        pass

    def on_top(self):
        active_window = webview.active_window()
        active_window.on_top = not active_window.on_top
        if active_window.on_top:
            active_window.evaluate_js(r"""alert("已置顶");""")
        else:
            active_window.evaluate_js(r"""alert("已取消置顶");""")

    def say_this_is_window_2(self):
        active_window = webview.active_window()
        if active_window:
            active_window.load_html('<h1>This is window 2</h2>')

    def open_file_dialog(self):
        active_window = webview.active_window()
        active_window.create_file_dialog(webview.SAVE_DIALOG, directory='/', save_filename='test.file')

    class menuJS_api:    
        def savegamedataJson(self, filename, content):
            #print(content)
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(content)
            f.close()
            return {'message': path.abspath(filename)}

if __name__ == '__main__':
    api = Api()
    menuApi = menuApi()

    apiWindow = webview.create_window(ApiWindowTitle, "./assets/index.html", js_api=api)
    majWindow = webview.create_window(MajSoulWindowTitle, 'https://game.maj-soul.com/1/', js_api=menuApi.menuJS_api())
    webview.start(private_mode=False, menu=menuApi.menu_items, debug=True)
