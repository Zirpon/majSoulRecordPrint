// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts';

const RankTitle = ['初心⭐', '初心⭐⭐', '初心⭐⭐⭐',
    '雀士⭐', '雀士⭐⭐', '雀士⭐⭐⭐',
    '雀杰⭐', '雀杰⭐⭐', '雀杰⭐⭐⭐',
    '雀豪⭐', '雀豪⭐⭐', '雀豪⭐⭐⭐',
    '雀圣⭐', '雀圣⭐⭐', '雀圣⭐⭐⭐',
    '魂天'];

var myChart = null;

function myEchart(totaldata, n, dom) {
    //console.log(totaldata);
    var option;
    var dataRecent = totaldata.slice(0, n);
    //console.log(dataRecent);
    //datatmp.unshift(totaldata[0]);
    //console.log(datatmp);

    function dataExchange(datatmp) {
        // 置换行列
        var newArray = datatmp.map(function (col, i) {
            return datatmp.map(function (row) {
                return row[i];
            })
        });
        newArray = newArray.slice(0, totaldata[0].length);
        //console.log(totaldata[0].length, newArray)
        // 生成字典模式数组 方便读取
        var newArrayTmp = {};
        for (let index = 0; index < newArray.length; index++) {
            const element = newArray[index];
            newArrayTmp[element[0]] = element.slice(1);
        }
        //console.log(totaldata[0].length, newArrayTmp)
        return newArrayTmp
    }
    var recentData = dataExchange(dataRecent);
    var allData = dataExchange(totaldata);
    var playerName = allData.name[0];

    /////// areachart ///////////////////////////////////////////////////////////////////////////
    const piechart_data_filter = () => {
        //铜之间+局和
        var sum_tong_up = 0;
        var sum_tong_down = 0;
        //银之间
        var sum_yin_up = 0;
        var sum_yin_down = 0;
        //金之间
        var sum_jin_up = 0;
        var sum_jin_down = 0;
        //玉之间 to be continue



        allData['deltapt_tong'] = [];
        allData['deltapt_yin'] = [];
        allData['deltapt_jin'] = [];

        for (var i = 0, len = totaldata.length - 1; i < len; i++) {
           // console.log(i, totaldata[i])

            allData['deltapt_tong'][i] = 0;
            allData['deltapt_yin'][i] = 0;
            allData['deltapt_jin'][i] = 0;
            if (allData.roomType[i] === '铜之间') {
                allData['deltapt_tong'][i] = allData.deltapt[i];

                if (allData.deltapt[i] >= 0) sum_tong_up += allData.deltapt[i];
                else sum_tong_down += allData.deltapt[i];
            } else if (allData.roomType[i] === '银之间') {
                allData['deltapt_yin'][i] = allData.deltapt[i];

                if (allData.deltapt[i] >= 0) sum_yin_up += allData.deltapt[i];
                else sum_yin_down += allData.deltapt[i];
            } else if (allData.roomType[i] === '金之间') {
                allData['deltapt_jin'][i] = allData.deltapt[i];

                if (allData.deltapt[i] >= 0) sum_jin_up += allData.deltapt[i];
                else sum_jin_down += allData.deltapt[i];
            }
        }

        return {
            tong: [
                { name: '铜之间+分：', value: sum_tong_up },
                { name: '铜之间-分：', value: -sum_tong_down },
            ],
            yin: [
                { name: '银之间+分：', value: sum_yin_up },
                { name: '银之间-分：', value: -sum_yin_down },
            ],
            jin: [
                { name: '金之间+分：', value: sum_jin_up },
                { name: '金之间-分：', value: -sum_jin_down },
            ],
            total: [
                { name: '铜之间：', value: sum_tong_up + sum_tong_down },
                { name: '银之间：', value: sum_yin_up + sum_yin_down },
                { name: '金之间：', value: sum_jin_up + sum_jin_down },
            ]
        };
        //return piechardata;
    }
    var piechardata = piechart_data_filter();

    //////////////////////////////////////
    function formatToolTips(params, ticket, callback) {
        //console.log(params, ticket, callback)
        //还原原始 显示
        let str = '';
        params.forEach((item, idx) => {
            if (item.seriesName === '段位') {
                str += `${item.marker}${item.seriesName}： ${formatRank(item.data)}<br/>`
            } else {
                str += `${item.marker}${item.seriesName}： ${item.data}<br/>`
            }
        })

        // 自定义显示
        if (params[0].axisId.includes('endtime-all')) {
            return str;
        } else {
            var sumdeltapt = 0;
            for (let eleindex = 0; eleindex < recentData.deltapt.length; eleindex++) {
                sumdeltapt += recentData.deltapt[eleindex];

                if (eleindex == params[0].dataIndex) {
                    //console.log(element.uuid, z.payload.uuid)
                    break;
                }
            }

            str += "近期上分Sum：" + sumdeltapt + '<br/>';
            return str;
        }

    }

    const formatRank = (value) => {
        if (value > RankTitle.length) return RankTitle[RankTitle.length - 1]
        return RankTitle[value]
    }

    //console.log(allData)
    //////////////////////////////////////
    const colors = ['#5470C6', '#91CC75', '#EE6666'];
    option = {
        title: [{
            text: `玩家 ${playerName}`
        }, {
            bottom: '40%',
            left: 'center',
            text: `${piechardata.total[0].name} ${piechardata.total[0].value}\
                    ${piechardata.total[1].name} ${piechardata.total[1].value}\
                    ${piechardata.total[2].name} ${piechardata.total[2].value}`,
            textStyle: {
                color: '#ff9800',
            },
        }],
        color: colors,
        legend: {
            orient: 'horizontal',//默认是横向排列，也可以是竖向'vertical'
            left: 'center',//可以是方位词
            top: '2%'//也可以是数值和百分比
        },//标注系列的名称和颜色
        toolbox: {
            top: '2%',
            right: '2%',
            feature: {
                dataView: { show: true, readOnly: false },//是否只读
                magicType: { type: ['line', 'bar',] },//切换的图形
                restore: { show: true },//数据还原
                saveAsImage: { show: true }//保存图片
            }
        },
        tooltip: {//提示框
            trigger: 'axis',//坐标触发，还可以是item，只显示一个数据
            showContent: true,//提示框显示
            axisPointer: {
                type: 'cross'
            },
            //backgroundColor: "transparent",
            //borderColor: 'transparent',
            //padding: 0,
            //borderWidth: 0,
            formatter: formatToolTips,
        },

        grid: [
            {
                id: 0,
                left: '6%',
                right: '10%',
                height: '35%',
                bottom: '50%',
            },
            {
                id: 1,
                left: '6%',
                right: '10%',
                top: '60%',
                height: '35%'
            }
        ],
        xAxis: [{
            gridIndex: 0,
            type: 'category',
            show: false,
            //name: 'endtime',
            //xisLabel: { rotate: 50, interval: 0 },
            data: recentData.endtime,
            inverse: true,
            //axisLine: { onZero: true },
        },
        {
            gridIndex: 1,
            type: 'category',
            show: false,
            //boundaryGap: false,
            //isLine: { onZero: true },
            data: allData.endtime,
            position: 'top',
            name: 'endtime-all',
            inverse: true,
            //axisLine: { onZero: true },
        }],
        yAxis: [
            {
                id: 0,
                gridIndex: 0,
                type: 'value',
                name: '顺位',
                position: 'right',
                nameLocation: 'end',
                alignTicks: true,
                inverse: true,
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: colors[0]
                    }
                },
                axisLabel: {
                    formatter: (value) => (['1st', '2nd', '3rd', '4th'][value - 1])
                }
            },
            {
                id: 1,
                gridIndex: 0,
                type: 'value',
                name: 'Δpt(天梯分变动)',
                position: 'right',
                alignTicks: true,
                offset: 50,
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: colors[1]
                    }
                },
                axisLabel: {
                    formatter: '{value} pt'
                }
            },
            {
                id: 2,
                gridIndex: 0,
                type: 'value',
                name: '胡牌点数',
                position: 'left',
                alignTicks: true,
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: colors[2]
                    }
                },
                axisLabel: {
                    formatter: '{value}'
                }
            },
            {
                id: 3,
                gridIndex: 1,
                type: 'value',
                name: '当前pt(天梯分)',
                position: 'left',
                alignTicks: true,
                //offset: 50,
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: colors[1]
                    }
                },
                axisLabel: {
                    formatter: '{value} pt'
                }
            },
            {
                id: 4,
                gridIndex: 1,
                type: 'value',
                name: '段位',
                position: 'right',
                nameLocation: 'end',
                alignTicks: true,
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: colors[0]
                    }
                },
                offset: 50,
                min: 0,
                max: RankTitle.length - 1,
                interval: 1,
                axisTick: {
                    show: true,
                    alignWithLabel: true,
                },
                axisLabel: {
                    //interval: 0,
                    showMinLabel: true,
                    showMaxLabel: true,
                    formatter: formatRank,
                }
            },
            {
                id: 5,
                gridIndex: 1,
                type: 'value',
            },
        ],
        series: [
            {
                name: '顺位',
                type: 'line',
                yAxisIndex: 0,
                data: recentData.pos,
            },
            {
                name: 'Δpt(天梯分变动)',
                type: 'line',
                yAxisIndex: 1,
                data: recentData.deltapt,
            },
            {
                name: '胡牌点数',
                type: 'line',
                yAxisIndex: 2,
                data: recentData.finalpoint
            },
            {
                name: '当前pt(天梯分)',
                type: 'line',
                yAxisIndex: 3,
                xAxisIndex: 1,
                data: allData.pt,
            },
            {
                name: '段位',
                type: 'line',
                yAxisIndex: 4,
                xAxisIndex: 1,
                data: allData.rank,
            },
            {
                name: '铜之间上分',
                type: 'line',
                stack: 'Total',
                areaStyle: {},
                emphasis: {
                    focus: 'series'
                },
                xAxisIndex: 1,
                yAxisIndex: 5,
                data: allData.deltapt_tong,
            },
            {
                name: '银之间上分',
                type: 'line',
                stack: 'Total',
                areaStyle: {},
                emphasis: {
                    focus: 'series'
                },
                xAxisIndex: 1,
                yAxisIndex: 5,
                data: allData.deltapt_yin,
            },
            {
                name: '金之间上分',
                type: 'line',
                stack: 'Total',
                areaStyle: {},
                emphasis: {
                    focus: 'series'
                },
                xAxisIndex: 1,
                yAxisIndex: 5,
                data: allData.deltapt_jin,
            },
        ]
    };

    if (myChart != null && myChart != "" && myChart != undefined) {
        myChart.dispose();//销毁
        myChart = null;
    }
    myChart = echarts.init(dom, "dark", { width: "auto", height: "auto" });
    myChart.setOption(option);

    window.addEventListener("resize", () => {
        if (myChart != null && myChart != "" && myChart != undefined) {
            myChart.resize();            
        }
    });
}

export { myEchart }