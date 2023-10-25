import webview
import majSoulRecordTransformer as transformer
import os
import json
import GLOBALS
import appUtils

g_configfile = GLOBALS.get_value('CONFIG_FILE')
class RecordApi:
    def __init__(self):
        transformer.initprofile()
        transformer.LoadData()
        # 接口函数执行标识
        self.funcFlag = 0
        self.loadDataReturn = []
        self.printCountListReturn = []
        self.printCSVReturn = []
        self.graphicCSVReturn = 0
        #pass

    def setIdName(self, id, name, n = 40):
        transformer.MJSoulID = int(id)
        transformer.MJSoulName = name
        transformer.recentGameN = int(n)

        settingDict={}
        settingDict["MJSoulID"] = int(id)
        settingDict["MJSoulName"] = name
        
        os.makedirs(os.path.dirname(g_configfile), exist_ok=True)
        with open(g_configfile,'w',encoding='utf-8') as load_f:
            json.dump(settingDict, load_f, indent=2, sort_keys=False, ensure_ascii=False)  # 写为多行
        load_f.close()

        response = {'message': 'Hello {0} {1} {2}!'.format(int(id), name, n), 'path':os.path.abspath(g_configfile)}
        return response
    
    def getIdName(self):
        if not os.path.exists(g_configfile):
            return -1
        try:
            with open(g_configfile,'r',encoding='utf-8') as load_f:
                newload_dict = json.load(load_f)
                return {'id': newload_dict['MJSoulID'], 'name':newload_dict['MJSoulName'], 'err':0}
        except:
            #print(g_configfile+"文件读取出错 请检查文件数据格式")
            return {'err':-1}

    def resetFlag(self, nclick):
        self.funcFlag = 0
        response = {'message': 'resetFlag 点击次数：{0}\n 执行次序：{1}\n\n'.
            format(nclick, self.funcFlag)}        
        return response

    def breaking(self, n):
        if self.funcFlag >= n:
            return
        while True:
            if self.funcFlag < 1:
                self.loadDataReturn = transformer.LoadData()
                self.funcFlag += 1
                if self.funcFlag == n:break
            elif self.funcFlag < 2:
                self.printCountListReturn = transformer.printCountList()
                self.funcFlag += 1
                if self.funcFlag == n:break                    
            elif self.funcFlag < 3:
                self.printCSVReturn = transformer.printCSV()
                self.funcFlag += 1
                if self.funcFlag == n:break
            elif self.funcFlag < 4: 
                self.graphicCSVReturn = transformer.graphicCSV()
                self.funcFlag += 1
                if self.funcFlag == n:break
        return
 
    # 筛选 时间倒序
    def loadData(self, nclick):
        self.breaking(1)
        response = {'message': 'loadData 执行次序：{0} 点击次数：{1}\n筛选天梯战绩数据(比赛场数据没有计入)'.
            format(self.funcFlag, nclick, "\n".join([str(i) for i in self.loadDataReturn])),
            'data':self.loadDataReturn}        
        return response

    # 格式化输出某些数据 比如 时间 名次
    def printCountList(self, nclick):
        self.breaking(2)
        response = {'message': 'printCountList 执行次序：{0} 点击次数：{1}\n场次视角战绩数据(比赛场数据没有计入)'.
            format(self.funcFlag, nclick, "\n".join([str(i) for i in self.printCountListReturn])),
            'data':self.printCountListReturn}
        return response

    def printCSV(self, nclick):
        self.breaking(3)
        response = {'message': 'printCSV 执行次序：{0} 点击次数：{1}\n个人视角战绩数据(比赛场数据没有计入)'.
            format(self.funcFlag, nclick, "\n".join([str(i) for i in self.printCSVReturn])),
            'data':self.printCSVReturn[0], 'strdata':self.printCSVReturn[1:], 'total':self.printCSVReturn}
        return response

    def graphicCSV(self, nclick, n):
        transformer.recentGameN = int(n)
        self.breaking(4)
        response = {'message': 'graphicCSV 执行次序：{0} 点击次数：{1}\n战绩数据图表已生成\n记录场次：{2}'.
                    format(self.funcFlag, nclick, self.graphicCSVReturn)}
        return response

    def savegamedataJson(self, filename, content):
        #print(content)
        os.makedirs(os.path.dirname(filename), exist_ok=True)
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        f.close()
        return {'message': os.path.abspath(filename)}
    
    def load_url(self, url):
        #print(url)
        webview.active_window().load_url('https://'+url)
        return True

    def error(self):
        raise Exception('This is a Python exception')
