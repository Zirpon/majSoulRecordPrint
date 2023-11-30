import React, { PureComponent } from 'react';
import {
    Label,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ReferenceArea,
    PieChart, Pie, Sector, Cell,
    ComposedChart,
    Area,
    ResponsiveContainer,
} from 'recharts';

const RankTitle = ['初心⭐', '初心⭐⭐', '初心⭐⭐⭐',
    '雀士⭐', '雀士⭐⭐', '雀士⭐⭐⭐',
    '雀杰⭐', '雀杰⭐⭐', '雀杰⭐⭐⭐',
    '雀豪⭐', '雀豪⭐⭐', '雀豪⭐⭐⭐',
    '雀圣⭐', '雀圣⭐⭐', '雀圣⭐⭐⭐',
    '魂天']

export default function Cchart(props) {
    const { data, n } = props;
    //console.log(data);
    var datatmp = data.slice(0, n);
    var playerName = data[0].name

    const formatXAxis = (tickItem) => {
        if (tickItem == 1)
            return "1st";
        else if (tickItem == 2)
            return "2nd";
        else if (tickItem == 3)
            return "3rd";
        else if (tickItem == 4)
            return "4th"
        return tickItem;
    }

    const formatRank = (rankItem) => {
        return RankTitle[rankItem - 1]
    }

    const formatDeltaptToolTips = (toolTipsItem, itemName, z) => {
        if (z.dataKey != "deltapt") return [toolTipsItem, itemName];
        //console.log(toolTipsItem, itemName,z)
        var match = null;
        var sumdeltapt = 0;
        for (let eleindex = 0; eleindex < datatmp.length; eleindex++) {
            const element = datatmp[eleindex];
            if (element[z.dataKey])
                sumdeltapt += element[z.dataKey];

            if (element.uuid === z.payload.uuid) {
                match = eleindex;
                //console.log(element.uuid, z.payload.uuid)
                break;
            }
        }

        if (match != null) {
            var ret = JSON.stringify([parseInt(toolTipsItem), "近期上分Sum:" + sumdeltapt])
            //console.log([ret,itemName], newarr)
            return [ret, itemName]
        } else
            return [toolTipsItem, itemName]
    }

    const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1 }, (_, i) => + (i * step));

    //////////// piechart
    var piechardata = [
        { name: 'Group A', value: 400 },
        { name: 'Group B', value: 300 },
        { name: 'Group C', value: 300 },
        { name: 'Group D', value: 200 },
    ];

    const renderActiveShape = (props) => {
        const RADIAN = Math.PI / 180;
        const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
        const sin = Math.sin(-RADIAN * midAngle);
        const cos = Math.cos(-RADIAN * midAngle);
        const sx = cx + (outerRadius + 10) * cos;
        const sy = cy + (outerRadius + 10) * sin;
        const mx = cx + (outerRadius + 30) * cos;
        const my = cy + (outerRadius + 30) * sin;
        const ex = mx + (cos >= 0 ? 1 : -1) * 22;
        const ey = my;
        const textAnchor = cos >= 0 ? 'start' : 'end';

        return (
            <g>
                <text x={cx} y={cy} dy={8} textAnchor="middle" fill="#76ff03">
                    {payload.name}
                </text>
                <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius}
                    startAngle={startAngle} endAngle={endAngle} fill={fill} />
                <Sector cx={cx} cy={cy} innerRadius={innerRadius + 6} outerRadius={outerRadius + 10}
                    startAngle={startAngle} endAngle={endAngle} fill={fill} />
                <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
                <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#ff9800">{`总上分 ${value}`}</text>
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={30} textAnchor={textAnchor} fill="#4caf50">
                    {`(Rate ${(percent * 100).toFixed(2)}%)`}
                </text>
            </g>
        );
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, payload, value }) => {
        const RADIAN = Math.PI / 180;

        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        //console.log(percent, index, payload, value)
        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${payload.name} ${value}`}
            </text>
        );
    };
    const [piestate1, setPiestate1] = React.useState({ activeIndex: 0, });
    const [piestate2, setPiestate2] = React.useState({ activeIndex: 0, });
    const [piestate3, setPiestate3] = React.useState({ activeIndex: 0, });
    const onPieEnter1 = (_, index) => { setPiestate1({ activeIndex: index, }); };
    const onPieEnter2 = (_, index) => { setPiestate2({ activeIndex: index, }); };
    const onPieEnter3 = (_, index) => { setPiestate3({ activeIndex: index, }); };

    const piechart_data_filter = () => {
        //铜之间+局和
        var sum_tong_up = 0;
        var sum_tong_down = 0;
        //银之间
        var sum_yin_up = 0;
        var sum_yin_down = 0;
        //金之间
        //玉之间 to be continue

        for (var i = 0, len = data.length; i < len; i++) {
            //console.log(data[i])
            if (data[i].roomType === '铜之间') {
                if (data[i].deltapt >= 0) sum_tong_up += data[i].deltapt;
                else sum_tong_down += data[i].deltapt;
            } else if (data[i].roomType === '银之间') {
                if (data[i].deltapt >= 0) sum_yin_up += data[i].deltapt;
                else sum_yin_down += data[i].deltapt;
            }
        }

        piechardata = {
            tong: [
                { name: '铜之间+分：', value: sum_tong_up },
                { name: '铜之间-分：', value: -sum_tong_down },
            ],
            yin: [
                { name: '银之间+分：', value: sum_yin_up },
                { name: '银之间-分：', value: -sum_yin_down },
            ],
            total: [
                { name: '铜之间：', value: sum_tong_up + sum_tong_down },
                { name: '银之间：', value: sum_yin_up + sum_yin_down },]

        };
        return piechardata;
    }
    piechart_data_filter();

    /////// areachart ///////////////////////////////////////////////////////////////////////////
    var sumRank4deltapt_tong = 0;
    var sumRank4deltapt_yin = 0;
    var sumRank5deltapt_tong = 0;
    var sumRank5deltapt_yin = 0;
    var sumRank6deltapt_tong = 0;
    var sumRank6deltapt_yin = 0;
    var sumDeltapt_tong = 0;
    var sumDeltapt_yin = 0;
    const areachart_data_filter = () => {
        var rank4data = []
        for (var i = 0, len = data.length; i < len; i++) {
            if (data[i].rank == 4 && data[i].roomType === '铜之间') {
                Object.defineProperty(data[i], "rank4deltapt_tong", { writable: true, configurable: true, value: data[i].deltapt });
                sumRank4deltapt_tong += data[i].deltapt;
                sumDeltapt_tong += data[i].deltapt;
            } else if (data[i].rank == 4 && data[i].roomType === '银之间') {
                Object.defineProperty(data[i], "rank4deltapt_yin", { writable: true, configurable: true, value: data[i].deltapt });
                sumRank4deltapt_yin += data[i].deltapt;
                sumDeltapt_yin += data[i].deltapt;
            } else if (data[i].rank == 5 && data[i].roomType === '铜之间') {
                Object.defineProperty(data[i], "rank5deltapt_tong", { writable: true, configurable: true, value: data[i].deltapt });
                sumRank5deltapt_tong += data[i].deltapt;
                sumDeltapt_tong += data[i].deltapt;
            } else if (data[i].rank == 5 && data[i].roomType === '银之间') {
                Object.defineProperty(data[i], "rank5deltapt_yin", { writable: true, configurable: true, value: data[i].deltapt });
                sumRank5deltapt_yin += data[i].deltapt;
                sumDeltapt_yin += data[i].deltapt;
            } else if (data[i].rank == 6 && data[i].roomType === '铜之间') {
                Object.defineProperty(data[i], "rank6deltapt_tong", { writable: true, configurable: true, value: data[i].deltapt });
                sumRank6deltapt_tong += data[i].deltapt;
                sumDeltapt_tong += data[i].deltapt;
            } else if (data[i].rank == 6 && data[i].roomType === '银之间') {
                Object.defineProperty(data[i], "rank6deltapt_yin", { writable: true, configurable: true, value: data[i].deltapt });
                sumRank6deltapt_yin += data[i].deltapt;
                sumDeltapt_yin += data[i].deltapt;
            } else if (data[i].roomType === '铜之间') {
                sumDeltapt_tong += data[i].deltapt;
            } else if (data[i].roomType === '银之间') {
                sumDeltapt_yin += data[i].deltapt;
            }
            //console.log(data[i])
        }
    }
    areachart_data_filter();

    const formatAreachartToolTips = (toolTipsItem, itemName, z) => {
        if (z.dataKey != "rank4deltapt_tong" && z.dataKey != "rank4deltapt_yin" &&
            z.dataKey != "rank5deltapt_tong" && z.dataKey != "rank5deltapt_yin" &&
            z.dataKey != "rank6deltapt_tong" && z.dataKey != "rank6deltapt_yin")
            return [toolTipsItem, itemName];
        //console.log(toolTipsItem, itemName,z)
        var match = null;
        var sumdeltapt = 0;

        for (let eleindex = 0; eleindex < data.length; eleindex++) {
            const element = data[eleindex];

            if (element.uuid === z.payload.uuid) {
                match = eleindex;
            }

            if (match != null && element[z.dataKey]) {
                sumdeltapt += element[z.dataKey];
            }
        }

        var ret = JSON.stringify([parseInt(toolTipsItem), "Sum:" + sumdeltapt])
        //console.log([ret,itemName], newarr)
        return [ret, itemName]
    }

    var tmmmmm = `铜/银之间上分统计：雀士⭐(铜/银之间): ${sumRank4deltapt_tong}/${sumRank4deltapt_yin};
雀士⭐⭐(铜/银之间): ${sumRank5deltapt_tong}/${sumRank5deltapt_yin};
雀士⭐⭐⭐(铜/银之间): ${sumRank6deltapt_tong}/${sumRank6deltapt_tong};
铜之间: ${sumDeltapt_tong} 银之间: ${sumDeltapt_yin}`

    //console.log(tmmmmm)
    ///////////////////////
    //console.log(data);
    return (
        <>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart width={800} height={300} data={datatmp}
                    margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="endtime" hide={false} tick={false} tickLine={false} 
                        axisLine={false} reversed={true} >
                        <Label value={`玩家：${playerName}`} offset={0} position="insideBottom" stroke="#ff9800"/>
                    </XAxis>
                    <YAxis yAxisId="1" domain={['dataMin - 0.3', 'dataMax + 0.3']} ticks={[1, 2, 3, 4]}
                        tick={{ stroke: '#76ff03', strokeWidth: 1 }} interval={0} reversed={true} orientation="right"
                        tickFormatter={formatXAxis} type="number" allowDecimals={false} />
                    <YAxis yAxisId="2" type="number" allowDataOverflow={false}
                        //domain={([dataMin, dataMax]) => { const absMax = Math.max(Math.abs(dataMin), Math.abs(dataMax)); return [-absMax, absMax]; }}
                        //domain={['dataMin - 65000', 'dataMax + 65000']} 
                        domain={['dataMin - 150', 'dataMax + 150']}
                        tick={{ stroke: '#2196f3', strokeWidth: 1 }} />
                    <YAxis yAxisId="3" type="number" allowDataOverflow={false} orientation="right"
                        domain={['dataMin-20', 'dataMax+20']} tick={{ stroke: '#ff8a80', strokeWidth: 1 }} />

                    <Tooltip formatter={formatDeltaptToolTips} />
                    <Legend verticalAlign="top" height={36} />
                    <Line yAxisId="1" type="linear" dataKey="顺位" stroke="#76ff03" strokeWidth={2} animationDuration={300} />
                    <Line yAxisId="2" type="monotone" dataKey="finalpoint" name="胡牌点数" stroke="#2196f3" strokeWidth={2} strokeDasharray="4 1 2" animationDuration={300} />
                    <Line yAxisId="3" type="basic" dataKey="deltapt" stroke="#ff9800" name="Δpt(天梯分变动)" strokeWidth={2} animationDuration={300} strokeDasharray="4 1" />
                </LineChart>
            </ResponsiveContainer>
            <br/>
            <ResponsiveContainer width="100%" height={400}>
                <ComposedChart width={800} height={400} data={data}
                    margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="endtime" hide={false} tick={false} tickLine={false}
                        axisLine={false} reversed={true} scale="band">
                        <Label value={tmmmmm} offset={0} position="insideBottom" stroke="#ff9800" />
                    </XAxis>
                    <YAxis yAxisId="1" domain={['dataMin - 0.3', 'dataMax + 0.3']} ticks={range(1, RankTitle.length+1, 1).slice(1)}
                        tick={{ stroke: '#76ff03', strokeWidth: 0.4 }} interval={0} orientation="left" minTickGap={10}
                        tickFormatter={formatRank} mirror={true} type="number" allowDecimals={false} />
                    <YAxis yAxisId="2" type="number" orientation="left" mirror={false}
                        domain={['dataMin - 150', 'dataMax + 150']} tick={{ stroke: '#2196f3', strokeWidth: 1 }} />
                    <YAxis yAxisId="3" type="number" allowDataOverflow={false} orientation="right"
                        domain={['dataMin-20', 'dataMax+20']} tick={{ stroke: '#ff8a80', strokeWidth: 1 }} />
                    <Tooltip formatter={formatAreachartToolTips} />
                    {/*<Legend verticalAlign="top" height={36} />*/}
                    <Line yAxisId="1" type="linear" dataKey="rank" dot={false} stroke="#ff9800" strokeWidth={5} animationDuration={300} />
                    <Line yAxisId="2" type="monotone" dataKey="Curpt" dot={false} stroke="#4caf50" name="当前pt(天梯分)" strokeWidth={3} animationDuration={300} />
                    <Area yAxisId="3" type="monotone" dataKey="rank4deltapt_tong" name="雀士⭐铜之间Δpt" stroke="#8B4513" fill="#8B4513" />
                    <Area yAxisId="3" type="monotone" dataKey="rank4deltapt_yin" name="雀士⭐银之间Δpt" stroke="#C0C0C0" fill="#C0C0C0" />
                    <Area yAxisId="3" type="monotone" dataKey="rank5deltapt_tong" name="雀士⭐⭐铜之间Δpt" stroke="#8B4513" fill="#8B4513" />
                    <Area yAxisId="3" type="monotone" dataKey="rank5deltapt_yin" name="雀士⭐⭐银之间Δpt" stroke="#C0C0C0" fill="#C0C0C0" />
                    <Area yAxisId="3" type="monotone" dataKey="rank6deltapt_tong" name="雀士⭐⭐⭐铜之间Δpt" stroke="#8B4513" fill="#8B4513" />
                    <Area yAxisId="3" type="monotone" dataKey="rank6deltapt_yin" name="雀士⭐⭐⭐银之间Δpt" stroke="#C0C0C0" fill="#C0C0C0" />
                </ComposedChart>
            </ResponsiveContainer>
            <ResponsiveContainer width="100%" height={400}>
                <PieChart width={800} height={300}>
                    <Pie data={piechardata.tong} label={renderCustomizedLabel} labelLine={false}
                        cx="20%" cy="50%" innerRadius={70} outerRadius={100} fill="#8884d8" dataKey="value">
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Pie data={piechardata.yin} label={renderCustomizedLabel} labelLine={false}
                        cx="45%" cy="50%" innerRadius={70} outerRadius={100} fill="#8884d8" dataKey="value">
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                        ))}
                    </Pie>
                    <Pie data={piechardata.total} activeIndex={piestate3.activeIndex} activeShape={renderActiveShape}
                        cx="75%" cy="50%" innerRadius={70} outerRadius={100} fill="#8884d8" dataKey="value" onMouseEnter={onPieEnter3} />
                </PieChart>
            </ResponsiveContainer>
        </>
    )
}