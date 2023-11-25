import React from 'react';
import { createRoot } from 'react-dom/client';
import WCollapse from '@kunukn/react-collapse';
import Papa from 'papaparse'
import CollapsibleTable from './loaddataForm'
import EnhancedTable from './recordForm'
import Cchart from './recordCharts'
import './assets/styles.css'
import DemoCarousel from './carousel'

const carouselContainer = document.getElementById("demo-carousel");
const roottom = createRoot(carouselContainer);
roottom.render(<DemoCarousel />);

window.addEventListener('pywebviewready', async function () {
    var container = document.getElementById('pywebview-status')
    container.innerHTML = '<i>pywebview</i> is ready'

    if (!localStorage.getItem('majSoulID') || !localStorage.getItem('majSoulName')) {
        //时序问题 顺序逻辑 但是此处的回调函数执行是异步的 
        //要么就在setcookie里直接设置innerhtml出来重复show也没什么问题
        pywebview.api.getIdName().then((response) => {
            if (!response || response == -1)
                console.log("setting.json not found")
            else if (response.err == -1)
                console.log("setting.json formate error")
            else if (response.err == 0) {
                setCookies(response.id, response.name)
            }
        })
    }
    //const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
    //await sleep(1000);
    showCookies()

    if (localStorage.getItem('majSoulGameN'))
        document.getElementById('majSoulGameN').value = localStorage.getItem('majSoulGameN')
})

/////雀魂profile操作接口/////////////////////////////////////////////////////////

function setCookies(id, name) {
    localStorage.setItem('majSoulID', id)
    localStorage.setItem('majSoulName', name)
    showCookies()
}

function showCookies() {
    document.getElementById('majSoulID').innerHTML = `<i>雀魂ID:</i>${localStorage.getItem('majSoulID')}`
    document.getElementById('majSoulName').innerHTML = `<i>雀魂Name:</i>${localStorage.getItem('majSoulName')}`
}
/////////////////////////////////////////////////////////////////////////////

function get_cookies() {
    pywebview.api.get_cookies().then(showResponse)
}

/////雀魂战绩操作按钮///////////////////////////////////////////////////////////////
function loadData(nclick) {
    pywebview.api.loadData(nclick).then(
        (response) => {
            showResponse(response)
            getWCollapseRoot().render(<CollapsibleTable rows={response.data} />);
        }
    )
}

function printCountList(nclick) {
    pywebview.api.printCountList(nclick).then(
        (response) => {
            //console.log(response)
            showResponse(response)
            getWCollapseRoot().render(<CollapsibleTable rows={response.data} />);
        }
    )
}

function printCSV(nclick) {
    pywebview.api.printCSV(nclick).then(
        (response) => {
            //console.log(response.data)
            //console.log(response.strdata)
            var csv = Papa.unparse({
                "fields": response.data,
                "data": response.strdata,
            });
            var jsondata = Papa.parse(csv, {
                header: true,
                //complete: data => {console.log(data.data);}
                transform: function (value, column) {
                    //console.log(value, column);
                    if (column === 'Curpt' || column === 'pt' ||
                        column === 'finalpoint' || column === 'deltapt' ||
                        column === 'rank' || column === '顺位')
                        return parseInt(value);
                    return value;
                },
            })
            //console.log(jsondata)

            showResponse(response)
            getWCollapseRoot().render(<EnhancedTable rows={jsondata.data} />);
            csvChart(jsondata.data)
        }
    )
}

function csvChart(jsondata) {
    getmyChartRoot().render(<Cchart data={jsondata} n={document.getElementById('majSoulGameN').value} />);
    //dddddr.unmount();
}

var G_myChartRoot = null
function getmyChartRoot() {
    const myChartContainer = document.getElementById("myChart");
    if (G_myChartRoot == null) {
        G_myChartRoot = createRoot(myChartContainer);
    }

    return G_myChartRoot;
}

function graphicCSV(nclick) {
    var majSoulGameN = document.getElementById('majSoulGameN').value;

    /*
    showResponse({ message: "请稍候..." });
    const loader = document.getElementById('loader')
    loader.classList.add('loader');
    loader.style.display = 'flex';
    */
    pywebview.api.graphicCSV(nclick, majSoulGameN).then((response) => {
        showResponse(response);
        document.getElementById('loader').style.display = 'none';
    })
}

function resetFlag(nclick) {
    pywebview.api.resetFlag(nclick).then(showResponse)
}

function CButton({ btName, btFunc, tmp = null }) {
    const [n, setn] = React.useState(0);
    function handleClick() {
        setn(n + 1);
        if (btName === "reset") {
            //setIntResetflag(tmp+1);
            btFunc();
            resetFlag(n)
        }
        else
            btFunc(n + 1);
    }

    React.useEffect(() => {
        setn(0);
        console.log(btName, tmp, n)
    }, [tmp]
    );

    return (<button type="checkbox" onClick={handleClick}>
        {btName}:({n})</button>)
}

function MyInput() {
    var defaultvalue = 40;
    if (localStorage.getItem('majSoulGameN'))
        defaultvalue = localStorage.getItem('majSoulGameN');

    const [text, setText] = React.useState(defaultvalue);

    function handleChange(e) {
        setText(e.target.value);
        localStorage.setItem('majSoulGameN', text);
        printCSV(-1);
    }

    return (
        <>
            <label><i>查询场数:</i> </label>
            <input id='majSoulGameN' value={text} onChange={handleChange} />
        </>
    );
}

function CButtonPage() {
    const [IntResetflag, setIntResetflag] = React.useState(0);
    return (
        <div>
            <MyInput /><br/><br/>
            <CButton btName="加载数据" btFunc={loadData} tmp={IntResetflag} />
            <CButton btName="战绩表格" btFunc={printCountList} tmp={IntResetflag} />
            <CButton btName="战绩数据曲线图" btFunc={printCSV} tmp={IntResetflag} />
            {/*<CButton btName="战绩数据可视化图表" btFunc={graphicCSV} tmp={IntResetflag} />*/}
            <CButton btName="reset" btFunc={() => {
                setIntResetflag(IntResetflag + 1);
            }} tmp={IntResetflag} />
        </div>
    )
}
const ddiv = document.getElementById("buttons");
const root1 = createRoot(ddiv);
root1.render(<CButtonPage />);

////操作结果显示提示框///////////////////////////////////////////////////////////////
function showResponse(response) {
    //const container = document.getElementById("py-ret-con-innerText");
    //container.innerText = response.message
}

var G_WCollapseContainerRoot = null
function getWCollapseRoot() {
    const WCollapseContainer = document.getElementById("WCollapse-innerText");
    if (G_WCollapseContainerRoot == null) {
        G_WCollapseContainerRoot = createRoot(WCollapseContainer);
    }

    return G_WCollapseContainerRoot;
}

////responce block折叠///////////////////////////////////////////////////////////////

//未使用这个折叠function
function MCollapse(props) {
    const [isCollapsed, setIsCollapsed] = React.useState(props.collapsed);
    const style = {
        collapsed: {
            display: "none"
        },
        expanded: {
            display: "block"
        },
        buttonStyle: {
            display: "block",
            width: "100%"
        }
    };
    return (
        <div>
            <button style={style.buttonStyle} onClick={() => setIsCollapsed(!isCollapsed)}>
                {isCollapsed ? "显示" : "隐藏"} 内容
            </button>
            <div
                className="collapse-content"
                style={isCollapsed ? style.collapsed : style.expanded}
                // aria-expanded 是给 Screen Reader 用来 判断当前元素状态的辅助属性
                aria-expanded={isCollapsed}
            >
                <div id="MCollapse-innerText"></div>
            </div>
        </div>);
}

function WCollapseInst() {
    const [isOpenA, setIsOpenA] = React.useState(true);
    const [collapseHeight, setCollapseHeight] = React.useState("40px");
    const [duration, setDuration] = React.useState("100ms");
    const transitionStyle = { transitionDuration: "1s" };
    const [collapseStyle, setCollapseStyle] = React.useState(transitionStyle);

    function collapseA() {
        setIsOpenA(!isOpenA);
    }

    return (
        <div style={{ display: "block" }}>
            <div className={'column1'}>
                {/*<span>动画时长500毫秒/折叠后高度40px:</span> style={{display:"none"}} */}
                <button onClick={collapseA} style={{ width: "100%" }}>折叠/展开</button>
                <WCollapse transition={`500ms`} collapseHeight={collapseHeight} isOpen={isOpenA}>
                    <div className={'collapseA'}>
                        <div id="WCollapse-innerText"></div>
                        {/*js style 设置格式*/}
                    </div>
                </WCollapse>
            </div>
        </div>)
}

const ddiv2 = document.getElementById("response-container");
const root2 = createRoot(ddiv2);
root2.render(<WCollapseInst />);
//root2.render(<MCollapse collapsed={false}/>);