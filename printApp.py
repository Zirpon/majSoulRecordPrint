from webview import create_window as webview_create_window
from webview import start as webview_start
import majSoulRecordTransformer as transformer
import json
from os import path as os_path

"""
This example demonstrates how to create a pywebview api without using a web
server
"""

class Api:
    def __init__(self):
        if os_path.exists("setting.json"):
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

if __name__ == '__main__':
    api = Api()
    webview_create_window('API example', "./assets/index.html", js_api=api, on_top=True)
    webview_start(private_mode=False)
    #webview.start(debug=True)
