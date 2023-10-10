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
    ResponsiveContainer,
} from 'recharts';


const RankTitle = ['初心1', '初心2','初心3',
             '雀士1','雀士2','雀士3',
             '雀杰1', '雀杰2','雀杰3',
             '雀豪1','雀豪2','雀豪3',
             '雀圣1','雀圣2','雀圣3',
             '魂天']

export default function Cchart(props) {
    const { data, n } = props;
    //console.log(data);
    var datatmp = data.slice(0, n);

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
        return RankTitle[rankItem-1]
    }

    const formatDeltaptToolTips = (toolTipsItem, itemName, z) => {
        if (itemName != "deltapt") return [toolTipsItem, itemName];
        //console.log(toolTipsItem, itemName,z)
        var match = false;
        for (let eleindex = 0; eleindex < datatmp.length; eleindex++) {
            const element = datatmp[eleindex];

            if (element.uuid === z.payload.uuid) {
                match = eleindex;
                //console.log(element.uuid, z.payload.uuid)
                break;
            }
        }

        if (match) {
            var sumdeltapt = 0;
            var newarr = datatmp.slice(0, match + 1);
            //console.log(newarr.length)
            for (var i = 0, len = newarr.length; i < len; i++) {
                sumdeltapt += parseInt(newarr[i].deltapt);
                //console.log(newarr[i])
            }
            var ret = JSON.stringify([parseInt(toolTipsItem), "近期上分Sum:" + sumdeltapt])
            //console.log([ret,itemName], newarr)
            return [ret, itemName]
        }
        else
            return [toolTipsItem, itemName]
    }

    const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1}, (_, i) =>  + (i * step));
    return (
        <>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart width={800} height={300} data={datatmp}
                    margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="endtime" hide={true} axisLine={false} reversed={true} />
                    <YAxis yAxisId="1" domain={['dataMin-0.3', 'dataMax+0.3']} ticks={[1, 2, 3, 4]}
                        tick={{ stroke: '#76ff03', strokeWidth: 1 }} interval={0} reversed={true} orientation="right"
                        tickFormatter={formatXAxis} type="number" allowDecimals={false} />
                    <YAxis yAxisId="3" type="number" allowDataOverflow orientation="right"
                        domain={['dataMin-200', 'dataMax+200']} tick={{ stroke: '#ff8a80', strokeWidth: 1 }} />
                    <YAxis yAxisId="2" type="number" allowDataOverflow
                        domain={['dataMin-65000', 'dataMax+65000']} tick={{ stroke: '#2196f3', strokeWidth: 1 }} />
                    <Tooltip formatter={formatDeltaptToolTips} />
                    <Legend />
                    <Line yAxisId="1" type="linear" dataKey="顺位" stroke="#76ff03" strokeWidth={2} animationDuration={300} />
                    <Line yAxisId="3" type="basic" dataKey="deltapt" stroke="#ff8a80" strokeWidth={2} animationDuration={300} strokeDasharray="4 1" />
                    <Line yAxisId="2" type="monotone" dataKey="finalpoint" stroke="#2196f3" strokeWidth={2} strokeDasharray="4 1 2" animationDuration={300} />
                </LineChart>
            </ResponsiveContainer>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart width={800} height={300} data={data}
                    margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="endtime" hide={true} axisLine={false} reversed={true} />
                    <YAxis yAxisId="1" domain={['dataMin-0.3', 'dataMax+0.3']} ticks={range(1,17,1).slice(1)}
                        tick={{ stroke: '#76ff03', strokeWidth: 0}} interval={0} orientation="right" minTickGap={10}
                        tickFormatter={formatRank} type="number" allowDecimals={false} />
                    <YAxis yAxisId="2" type="number" allowDataOverflow
                        domain={['dataMin-150', 'dataMax+500']} tick={{ stroke: '#2196f3', strokeWidth: 1 }} />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="1" type="linear" dataKey="rank" dot={false} stroke="#ff9800" strokeWidth={5} animationDuration={300} />
                    <Line yAxisId="2" type="monotone" dataKey="Curpt" dot={false} stroke="#4caf50" strokeWidth={3} animationDuration={300} />
                </LineChart>
            </ResponsiveContainer>

        </>
    )
}
/*



*/
