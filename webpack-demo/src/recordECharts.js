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
        str += params[0].axisValue + `<br/>`
        params.forEach((item, idx) => {
            if (item.seriesName === '段位') {
                str += `${item.marker}${item.seriesName}： ${formatRank(item.data)}<br/>`
            } else {
                str += `${item.marker}${item.seriesName}： ${item.data}<br/>`
            }
        })

        // 自定义显示
        if (params[0].axisId.includes('endtime-all') || params[0].axisIndex == 1) {
            return str;
        } else {
            var sumdeltapt = 0;
            for (let eleindex = 0; eleindex < allData.deltapt.length; eleindex++) {
                sumdeltapt += allData.deltapt[eleindex];

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
        if (value <= 0) return RankTitle[0];
        if (value - 1 >= RankTitle.length) return RankTitle[RankTitle.length - 1]
        return RankTitle[value - 1]
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
            top: '2%',//也可以是数值和百分比
            selected: {
                '铜之间上分': false,
                '银之间上分': false,
                '金之间上分': false,
            }
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
            selectedMode: true,
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
        dataZoom: [
            {
                //支持鼠标滚轮缩放
                type: 'inside',
                start: 0,
                end: 20,
                xAxisIndex: [0],
            },
            {
                //支持鼠标滚轮缩放
                type: 'slider',
                start: 0,
                end: 20,
                xAxisIndex: [0],
                left: "center",                           //组件离容器左侧的距离,'left', 'center', 'right','20%'
                //top: "top",                                //组件离容器上侧的距离,'top', 'middle', 'bottom','20%'
                right: "auto",                             //组件离容器右侧的距离,'20%'
                bottom: "45%",                            //组件离容器下侧的距离,'20%'
            },
            {
                //支持鼠标滚轮缩放
                type: 'inside',
                start: 0,
                end: 100,
                xAxisIndex: [1],
            },
            {
                //支持滑块滑动
                id: 'dataZoomX',
                show: true, //是否显示 组件。如果设置为 false，不会显示，但是数据过滤的功能还存在。
                type: 'slider',
                xAxisIndex: [1],
                //yAxisIndex: [3,4,5],    
                realtime: true,
                //filterMode: 'filter', // 设定为 'filter' 从而 X 的窗口变化会影响 Y 的范围。
                //filterMode: 'filter',                   //'filter'：当前数据窗口外的数据，被 过滤掉。即 会 影响其他轴的数据范围。每个数据项，只要有一个维度在数据窗口外，整个数据项就会被过滤掉。
                //'weakFilter'：当前数据窗口外的数据，被 过滤掉。即 会 影响其他轴的数据范围。每个数据项，只有当全部维度都在数据窗口同侧外部，整个数据项才会被过滤掉。
                //'empty'：当前数据窗口外的数据，被 设置为空。即 不会 影响其他轴的数据范围。
                //'none': 不过滤数据，只改变数轴范围。

                //radiusAxisIndex: 3, //设置 dataZoom-inside 组件控制的 radius 轴,可以用数组表示多个轴
                //angleAxisIndex: [0, 2], //设置 dataZoom-inside 组件控制的 angle 轴,可以用数组表示多个轴
                start: 0,
                end: 100,
                zoomOnMouseWheel: true, //如何触发缩放。可选值为：true：表示不按任何功能键，鼠标滚轮能触发缩放。false：表示鼠标滚轮不能触发缩放。'shift'：表示按住 shift 和鼠标滚轮能触发缩放。'ctrl'：表示按住 ctrl 和鼠标滚轮能触发缩放。'alt'：表示按住 alt 和鼠标滚轮能触发缩放。
                moveOnMouseMove: true, //如何触发数据窗口平移。true：表示不按任何功能键，鼠标移动能触发数据窗口平移。false：表示鼠标滚轮不能触发缩放。'shift'：表示按住 shift 和鼠标移动能触发数据窗口平移。'ctrl'：表示按住 ctrl 和鼠标移动能触发数据窗口平移。'alt'：表示按住 alt 和鼠标移动能触发数据窗口平移。
                zoomLock: false, //是否锁定选择区域（或叫做数据窗口）的大小。如果设置为 true 则锁定选择区域的大小，也就是说，只能平移，不能缩放。

                backgroundColor: "rgba(47,69,84,0)",  //组件的背景颜色
                dataBackground: {                        //数据阴影的样式。
                    //lineStyle: mylineStyle,              //阴影的线条样式
                    //areaStyle: myareaStyle,              //阴影的填充样式
                },
                fillerColor: "rgba(167,183,204,0.4)",  //选中范围的填充颜色。
                borderColor: "#ddd",                     //边框颜色。

                //startValue: 10,                           //数据窗口范围的起始数值
                //endValue: 100,                            //数据窗口范围的结束数值。
                orient: "horizontal",                    //布局方式是横还是竖。不仅是布局方式，对于直角坐标系而言，也决定了，缺省情况控制横向数轴还是纵向数轴。'horizontal'：水平。'vertical'：竖直。
                throttle: 100,                             //设置触发视图刷新的频率。单位为毫秒（ms）。
                left: "center",                           //组件离容器左侧的距离,'left', 'center', 'right','20%'
                //top: "top",                                //组件离容器上侧的距离,'top', 'middle', 'bottom','20%'
                right: "auto",                             //组件离容器右侧的距离,'20%'
                bottom: "auto",                            //组件离容器下侧的距离,'20%'
            },
            /*{
                id: 'dataZoomY',
                type: 'slider',
                yAxisIndex: [3, 4, 5],
                //filterMode: 'empty',
                start: 0,
                end: 100
            }*/],
        xAxis: [{
            id: 0,
            gridIndex: 0,
            type: 'category',
            show: false,
            //name: 'endtime',
            //xisLabel: { rotate: 50, interval: 0 },
            data: allData.endtime,
            inverse: true,
            //axisLine: { onZero: true },
        },
        {
            id: 1,
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
                xAxisIndex: 0,
                data: allData.pos,
            },
            {
                name: 'Δpt(天梯分变动)',
                type: 'line',
                yAxisIndex: 1,
                xAxisIndex: 0,
                data: allData.deltapt,
            },
            {
                name: '胡牌点数',
                type: 'line',
                yAxisIndex: 2,
                xAxisIndex: 0,
                data: allData.finalpoint
            },
            {
                name: '当前pt(天梯分)',
                type: 'line',
                yAxisIndex: 3,
                xAxisIndex: 1,
                data: allData.Curpt,
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