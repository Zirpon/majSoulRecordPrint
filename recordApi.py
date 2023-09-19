import webview
import majSoulRecordTransformer as transformer
from os import path
import json

class RecordApi:
    def __init__(self):
        if path.exists("setting.json"):
            with open("setting.json",'r+',encoding='utf-8') as load_f:
                transformer.settingDict = json.load(load_f)
                transformer.MJSoulID = transformer.settingDict['MJSoulID']
                transformer.MJSoulName = transformer.settingDict['MJSoulName']
            load_f.close()
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

    def savegamedataJson(self, filename, content):
        #print(content)
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        f.close()
        return {'message': path.abspath(filename)}
    
    def load_url(self, url):
        print(url)
        webview.active_window().load_url('https://'+url)
        return True

    def error(self):
        raise Exception('This is a Python exception')
