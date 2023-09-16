#coding:UTF-8
import time
import json
import csv

"""
todo:
换一下app 那个猫猫图片
设置一下app 版本号 并且按钮可见
把爬取牌谱的 开源代码 看看 看看能不能整合过来 或者 整过去 就不用 开两个软件了
"""
MJSoulID = 0
MJSoulName = ""
settingDict = {"MJSoulID": 15707046, "MJSoulName": "九宫格烈火精灵"}

"""
with open("setting.json",'rw',encoding='utf-8') as load_f:
    settingDict = json.load(load_f)

MJSoulID = settingDict['MJSoulID']
MJSoulName = settingDict['MJSoulName']
"""

#图表显示最近N场的数据
recentGameN=30
RankTitle = ['初心1', '初心2','初心3',
             '雀士1','雀士2','雀士3',
             '雀杰1', '雀杰2','雀杰3',
             '雀豪1','雀豪2','雀豪3',
             '雀圣1','雀圣2','雀圣3',
             '魂天']
roomMode = {
    0:'友人场',
    1:'铜之间',
    2:'银之间',
    3:'金之间',
    4:'玉之间', 
    5:'王座间',
    100:'比赛场',
    101:'乱斗之间',
    102:'修罗之战',
    103:'宝牌狂热',
    104:'赤羽之战',
}

roundMode = {
    4:'东风场',
    8:'南风场',
}

RankPoint = [20,80,200,
             609,808,1001,
             1200,1400,2000,
             2800,3200,3600,
             4000,6000,9000,
             9001]
sortedCountList = []

def LoadData():
    with open("paipus.txt",'r',encoding='utf-8') as load_f:
        newload_dict = json.load(load_f)
    
    global sortedCountList
    count_list = []
    count_dict = {}
    class_list = []
    i=0
    for gameRecord in newload_dict:
        i+=1
        #if i == 1:
        #    print(gameRecord['gamedata'])
        gamedata = gameRecord['gamedata']
        #count_dict["source"] = gamedata['source']			
        #count_dict["accountid"] = gamedata['accountid']
        #count_dict["starttime"] = gamedata['starttime']
        count_dict["endtime"] = gamedata['endtime']
        count_dict["uuid"] = gamedata['uuid']
        #count_dict["version"] = gamedata['version']
        count_dict["playerdata"] = sorted(gamedata['playerdata'], key = lambda i: i['finalpoint'],reverse=True)
        count_dict["roomdata"] = gamedata['roomdata']

        # 人机局标识
        botMatchFlag = 0
        for i in range(len(count_dict["playerdata"])):
            count_dict["playerdata"][i]["顺位"] = i+1
            #count_dict["playerdata"][i]["rank"] = RankTitle[count_dict["playerdata"][i]["rank"]+1]
            if count_dict["playerdata"][i]['name'] == "电脑" \
            and count_dict["playerdata"][i]['rank'] == 1 \
            and count_dict["playerdata"][i]['pt'] == 0 \
            and count_dict["playerdata"][i]['id'] == 0 \
            and count_dict["playerdata"][i]['deltapt'] == 0 \
            or count_dict['roomdata']['room'] == 0:
                botMatchFlag += 1
        #count_dict["roomdata"] = gamedata['roomdata']
        if botMatchFlag == 0:
            count_list.append(count_dict)
        count_dict = {}
    #print(count_list)
    #逆序时间排序
    sortedCountList = sorted(count_list, key = lambda i: i['endtime'],reverse=True)
    return count_list, sortedCountList

    # 将提取的数据写入到新的文件中
    # 由于.write操作写入的是str类型数据,需要对count_list进行强制转换
    """
    with open('gameRecord.json', 'w', encoding='utf-8') as f:
        f.write(str(count_list))
    """

def printCountList():
    with open("Gridrecord.csv", 'w', newline='', encoding='utf-8') as f:
        for gamedata in sortedCountList:
            """
            #获取当前时间
            time_now = int(time.time())
            #转换成localtime
            time_local = time.localtime(tiendtimetamp)
            #转换成新的时间格式(2016-05-05 20:28:54)
            dt = time.strftime("%Y-%m-%d %H:%M:%S",time_local)
            """
            #gamedata['starttime'] = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(gamedata['starttime']))
            endtime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(gamedata['endtime']))
            f.writelines(gamedata['uuid']+'\t')
            f.writelines(roundMode[gamedata['roomdata']['round']]+'\t')
            f.writelines(roomMode[gamedata['roomdata']['room']]+'\n')

            for playerdata in gamedata["playerdata"]:
                playerdata["rankTitle"] = RankTitle[playerdata["rank"]-1]
                f.writelines("%d位\t%s\t%s\t%d\t%d\t%d\t%d\t" % 
                             (playerdata['顺位'], playerdata['name'], playerdata['rankTitle'], 
                              playerdata['finalpoint'], playerdata['pt'], playerdata['deltapt'],
                              playerdata['pt']+playerdata['deltapt']))
                if playerdata['顺位'] == 2:
                    f.writelines("\n")      
                if playerdata['顺位'] == 4:
                    f.writelines("\t")
            f.writelines(endtime+'\n')

    with open("gameRecord.json", "w", encoding='utf-8') as f:
        # json.dump(dict_, f)  # 写为一行
        json.dump(sortedCountList, f, indent=2, sort_keys=False, ensure_ascii=False)  # 写为多行
    return sortedCountList

#个人战绩
def printCSV():
    individualCSV = [["uuid","endtime","id","name","顺位","finalpoint","pt","deltapt","Curpt","rank","rankTitle"]]
    jsonFileName = "%s-%d.json" % (MJSoulName,MJSoulID)
    individualData = []

    for gamedata in sortedCountList:
        for playerData in gamedata['playerdata']:
        #for i in range(len(playerDataSorted)):
            #playerData = playerDataSorted[i]
            if playerData['id'] == MJSoulID and playerData['name'] == MJSoulName:
                #print(playerData)
                endtime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(gamedata['endtime']))
                individualData.append([gamedata['uuid'],
                                endtime,
                                playerData['id'],
                                playerData['name'],
                                playerData['顺位'],
                                playerData['finalpoint'],
                                playerData['pt'],
                                playerData['deltapt'],
                                playerData['pt'] + playerData['deltapt'],
                                playerData['rank'],
                                playerData['rankTitle']])
    """
    with open(jsonFileName, 'w', newline='', encoding='utf-8') as f:
        for gamedata in individualData:
            f.writelines(str(gamedata)+'\n')
    """
    csvFileName = "%s-%d.csv" % (MJSoulName,MJSoulID)
    with open(csvFileName, 'w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerows(individualCSV)
        #endtime字符串排序
        gameHistory = sorted(individualData, key = lambda i: i[1],reverse=False)
        writer.writerows(gameHistory)
    return individualData

from scipy.optimize import curve_fit
from scipy.signal import find_peaks
from scipy.signal import peak_prominences, peak_widths
from matplotlib import use as matplotlib_use
matplotlib_use('agg')
import matplotlib.pyplot as plt

def graphicCSV():
    csvFileName = "%s-%d.csv" % (MJSoulName,MJSoulID)
    #df = pd_read_csv(csvFileName)
    #print(recentGameN)
    df = {}
    df_index = []
    maxColumn = 0
    with open(csvFileName, newline='', encoding='utf-8') as csvfile:
        reader = csv.reader(csvfile)
        lineCount = 0
        for row in reader:
            if lineCount == 0:
                df_index = row
                for i in range(len(df_index)):
                    df.update({df_index[i]:[]})
                lineCount += 1
                #print(df)
            else:
                for i in range(len(df_index)):
                    if df_index[i] in ["顺位","finalpoint","pt","deltapt","Curpt","rank"]:
                        df[df_index[i]].append(int(row[i]))
                    else:
                        df[df_index[i]].append(row[i])
                lineCount += 1
        maxColumn = lineCount - 1
        #for i in range(len(df_index)):
            #print(len(df[df_index[i]][-recentGameN:]),str(df[df_index[i]][-recentGameN:])+'\n')
   # for i in range(maxColumn):
        #print(df, maxColumn, df['endtime'][0])
    #print(df)
    plt.rcParams['font.sans-serif']=['SimHei']
    plt.rcParams['axes.unicode_minus']=False
    plt.rcParams['figure.figsize']=[20,10]
    plt.rcParams['figure.dpi']=100
    #[["uuid","endtime","id","name","顺位","finalpoint","pt","deltapt","Curpt","rank","rankTitle"]]
    
    def graphicPlacing():
        plt.plot(df['endtime'][-recentGameN:], df['顺位'][-recentGameN:], label='顺位',
                    lw=2.5, linestyle='-', color="green", marker='^')
        plt.title('対戦記録')
        plt.grid(True)
        #y轴上下限
        plt.ylim(4.5,0.5)
        plt.xticks([])  # Disable xticks.
        plt.yticks([1,2,3,4], ['1st', '2nd', '3rd','4th'], rotation=0)  # Set text labels and properties.
        plt.legend(loc='best')#图列位置,可选best,center等
        plt.show()

    def graphicFinalpoint():
        plt.plot(df['endtime'][-recentGameN:], df['finalpoint'][-recentGameN:], label='finalpoint',
                    lw=2.5, linestyle='-', color="blue", marker='o') 
        #plt.axis('tight')
        plt.title('対戦記録')
        plt.grid(True)
        plt.xticks([])  # Disable xticks.
        plt.legend(loc='best')#图列位置,可选best,center等
        plt.show()

    def graphicDeltapt():
        plt.plot(df['endtime'][-recentGameN:], df['deltapt'][-recentGameN:], label='deltapt',
                    lw=2.5, linestyle='-', color="red", marker='o') 
        #plt.axis('tight')
        plt.title('対戦記録')
        plt.grid(True)
        plt.xticks([])  # Disable xticks.
        plt.legend(loc='best')#图列位置,可选best,center等
        #plt.show()

    def plot_twin(x, ax1, _y2, _ylabel2, color, linestyle, marker='h'):
        #'-' '--' ':' '-.'
        #marker: o h + * . _ | x s d ^ v > < p
        ax2 = ax1.twinx()  # 创建共用x轴的第二个y轴 
        #print(df['endtime'][-recentGameN:])
        ax2.set_ylabel(_ylabel2, color=color)
        ax2.tick_params(axis='y', labelcolor=color)
        ax2.plot(x, _y2, color=color, lw=2, linestyle=linestyle, label=_ylabel2, marker=marker)

        peaks, _ = find_peaks(_y2, distance=1)
        #print(_y2)#346-375
        #print(peaks)#0-29->375-30+1 ~ 375-30+30
        for peak in peaks:
            #print(maxColumn, recentGameN) # 376,30
            #print(maxColumn-recentGameN+1)
            peakIndex = maxColumn-recentGameN+peak

            #print(x, '\n', _y2,'\n', peakIndex,peak)
            annoText = "%s pt:%s" % (_ylabel2, _y2[peak])
            plt.annotate(annoText,xy=(x[peak], _y2[peak]), xytext=(x[peak], _y2[peak]+50),
                        arrowprops={'facecolor':'lightblue', 'shrink':0.15})
        return ax2

    def graphicTrends():
        fig, ax1 = plt.subplots()
        color = 'tab:blue'
        x = df['endtime'][-recentGameN:]
        y = df['顺位'][-recentGameN:]
        #print(x,y)
        ax1.set_ylabel("顺位", color=color)
        ax1.set_xlabel("近期%d场比赛" % recentGameN, color=color)
        print("近期%d场比赛" % recentGameN)
        ax1.plot(x, y, color=color, linestyle='-', label="顺位",  marker='h')
        ax1.set_ylim(4.5,0.5)
        ax1.set_yticks([1,2,3,4], ['1st', '2nd', '3rd','4th'])
        ax1.tick_params(axis='y', labelcolor=color, rotation=0)
        ax1.set_xticks([])  # Disable xticks.
        ax1.grid(True)

        ax2 = plot_twin(x, ax1, df['finalpoint'][-recentGameN:], 'finalpoint', 'tab:green', '--', 'p')
        ax3 = plot_twin(x, ax1, df['deltapt'][-recentGameN:], 'deltapt', 'tab:red', '-.', 'd')

        #近24h比赛数据
        z = df['deltapt'][-recentGameN:]
        intLatestTimer = int(time.mktime(time.strptime(x[-1], "%Y-%m-%d %H:%M:%S")))
        intTargetTimerIndex = 0
        for x_index in range(len(x)):
            x_time = x[x_index]
            int_x_time = int(time.mktime(time.strptime(x_time, "%Y-%m-%d %H:%M:%S")))
            if intLatestTimer - int_x_time > 24*60*60:
                intTargetTimerIndex = x_index
        #print(intTargetTimerIndex, x[intTargetTimerIndex], z[intTargetTimerIndex])
        #print(len(z[-intTargetTimerIndex:]),z[-intTargetTimerIndex:])

        deltapt_24h = sum([element for element in z[intTargetTimerIndex:]])
        plt.annotate("近24h比赛数据(%s,%s) deltaPtSum=%s" % 
                     (x[intTargetTimerIndex],z[intTargetTimerIndex],deltapt_24h),
                     xy=(x[intTargetTimerIndex], z[intTargetTimerIndex]),
                     xytext=(x[intTargetTimerIndex], z[intTargetTimerIndex]-100),
                     #textcoords='axes fraction', va='top', ha='left',
                     arrowprops={'facecolor':'yellow', 'shrink':0.15})
        fig.tight_layout()
        plt.title('対戦記録')
        plt.figlegend(['顺位', 'finalpoint', 'deltapt'])
        plt.savefig("MajSoulTrends.png")        
        #plt.show()

    def graphicHistory():
        def graphicRank(): 
            plt.plot(df['endtime'], df['rank'], label='rank',
                        lw=2.5, linestyle='-', color="red", marker='o') 
            #plt.axis('tight')
            plt.title('対戦記録')
            plt.grid(True)
            plt.xticks([])  # Disable xticks.
            plt.yticks(list(range(1,len(RankTitle)+1)), RankTitle, rotation=0)  # Set text labels and properties.
            plt.legend(loc='best')#图列位置,可选best,center等
            plt.show()

        def graphicCurpt():
            plt.plot(df['endtime'], df['Curpt'], label='Curpt',
                        lw=2, linestyle='-', color="green", marker='p') 
            #plt.axis('tight')
            plt.title('対戦記録')
            plt.grid(True)
            plt.xticks([])  # Disable xticks.
            plt.legend(loc='best')#图列位置,可选best,center等
            plt.show()

        #graphicRank()
        #graphicCurpt()
        fig, ax1 = plt.subplots()
        x = df['endtime']
        y = df['Curpt']
        ax1.set_ylabel("Curpt", color='tab:green')
        ax1.set_xlabel("记录%d场比赛" % maxColumn, color='tab:green')
        ax1.tick_params(axis='y', labelcolor='tab:green', rotation=0)
        ax1.set_xticks([])  # Disable xticks.
        ax1.grid(True)
        ax1.plot(x, y,  color='tab:green', lw=2, linestyle='-', label="Curpt", marker='p')

        ax2 = ax1.twinx()
        ax2.set_ylabel('rank', color='tab:blue')
        ax2.tick_params(axis='y', labelcolor='tab:blue')
        ax2.set_yticks(list(range(1,len(RankTitle)+1)), RankTitle) # range函数左闭右开
        ax2.set_ylim(0,len(RankTitle))
        #ax2.grid(True)
        ax2.plot(x, df['rank'], color='tab:blue', lw=2, linestyle='-', label='rank')

        #绘制峰值
        peaks, _ = find_peaks(df['Curpt'], distance=10)
        #这里的prominences是峰的显著度，widths_half数组包含两个峰的完整宽度，lefts和rights数组分别包含宽度的左侧和右侧边界值。
        prominences = peak_prominences(df['Curpt'], peaks)[0]
        widths_half = peak_widths(df['Curpt'], peaks, rel_height=0.5)
        
        #print(peaks,'\n', df['endtime'], '\n', df['Curpt'])
        x_p = [x[peak] for peak in peaks]  
        y_p = [y[peak] for peak in peaks]  
        #print(peaks, x_p, y_p)
        # '-' '--' ':' '-.'
        # marker:https://blog.csdn.net/Cristianozy/article/details/124536608
        #plt.plot(x_p, y_p, label='ptPeak',lw=2, linestyle='-.', color="red", marker='h')
        ax1.plot(x_p, y_p, label='ptPeak', lw=2, linestyle='-.', color='red', marker='h')
        #plt.hlines(*widths_half[1:], color="C2")
        #plt.text(y=80, s=r'$\lambda=1, r^2=0.8$') #Coordinates use the same units as the graph
        rank = 0
        for peak in peaks:
            for point in RankPoint[rank:]:
                if y[peak] >= point:
                    rank += 1
            annoText = "%s pt:%s" % (RankTitle[rank],y[peak])
            #https://matplotlib.org/stable/tutorials/text/annotations.html#plotting-guide-annotation
            ax1.annotate(annoText,xy=(x[peak], y[peak]), xytext=(x[peak], y[peak]+100),arrowprops={'facecolor':'lightblue', 'shrink':0.15})
        
        plt.title('対戦記録')
        plt.figlegend(['Curpt', 'ptPeak','rank'])
        plt.savefig("MajSoulHistory.png")
        #plt.show()
    
    #graphicPlacing()
    #graphicFinalpoint()
    #graphicDeltapt()
    graphicTrends()
    graphicHistory()
    return recentGameN

def main():
    #https://pyinstaller.org/en/stable/runtime-information.html
    import sys
    #print(sys)
    global MJSoulID
    global MJSoulName
    MJSoulID = settingDict['MJSoulID']
    MJSoulName = settingDict['MJSoulName']
    if getattr(sys, 'frozen', False) and hasattr(sys, '_MEIPASS'):
        print('running in a PyInstaller bundle')
        LoadData()
        printCountList()
        printCSV()
        graphicCSV()
    else:
        print('running in a normal Python process')
        print(sys.argv)
        if len(sys.argv) > 1 and (sys.argv[1] == "-g" or sys.argv[1] == '--graphic'):
            if sys.argv[2].isdecimal():
                global recentGameN
                recentGameN = int(sys.argv[2])
            graphicCSV()
        else:
            LoadData()
            printCountList()
            printCSV()

if __name__=="__main__":
    main()



