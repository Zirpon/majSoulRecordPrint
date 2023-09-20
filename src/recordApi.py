import webview
import majSoulRecordTransformer as transformer
from os import path
import json

class RecordApi:
    def __init__(self):
        transformer.initprofile()
        transformer.LoadData()
        #pass

    def setIdName(self, id, name, n = 40):
        transformer.MJSoulID = int(id)
        transformer.MJSoulName = name
        transformer.recentGameN = int(n)

        settingDict={}
        settingDict["MJSoulID"] = int(id)
        settingDict["MJSoulName"] = name
        with open("./setting.json",'w',encoding='utf-8') as load_f:
            json.dump(settingDict, load_f, indent=2, sort_keys=False, ensure_ascii=False)  # 写为多行
        load_f.close()

        response = {'message': 'Hello {0} {1} {2}!'.format(int(id), name, n), 'path':path.abspath("./setting.json")}
        return response
    
    def getIdName(self):
        if not path.exists("./setting.json"):
            return -1
        try:
            with open("./setting.json",'r',encoding='utf-8') as load_f:
                newload_dict = json.load(load_f)
                return {'id': newload_dict['MJSoulID'], 'name':newload_dict['MJSoulName'], 'err':0}
        except:
            print("./data/gamedata.json文件读取出错 请检查文件数据格式")
            return {'err':-1}

    
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
