import React from "react";
import { createRoot } from "react-dom/client";
import WCollapse from "@kunukn/react-collapse";
import Papa from "papaparse";
import CollapsibleTable from "./loaddataForm";
import EnhancedTable from "./recordForm";
import Cchart from "./recordCharts";
import { myEchart } from "./recordECharts";
import "./assets/styles.css";
import DemoCarousel from "./carousel";
import HubClient from "./lib/hubClient";
//import './bg'

const carouselContainer = document.getElementById("demo-carousel");
const roottom = createRoot(carouselContainer);
roottom.render(<DemoCarousel />);

var G_CrossStorage = null;
G_CrossStorage = new HubClient("http://127.0.0.1:33333/hub.html");

window.addEventListener("pywebviewready", async function () {
    var container = document.getElementById("pywebview-status");
    container.innerHTML = "<i>pywebview</i> is ready";

    if (
        !localStorage.getItem("majSoulID") ||
        !localStorage.getItem("majSoulName")
    ) {
        //时序问题 顺序逻辑 但是此处的回调函数执行是异步的
        //要么就在setcookie里直接设置innerhtml出来重复show也没什么问题
        pywebview.api.getIdName().then((response) => {
            if (!response || response == -1) console.log("setting.json not found");
            else if (response.err == -1) console.log("setting.json formate error");
            else if (response.err == 0) {
                setCookies(response.id, response.name);
            }
        });
    }
    //const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
    //await sleep(1000);
    showCookies();

    pywebview.api.getHubUrl().then((response) => {
        console.log("getHubUrl", response);
    });
});

/////雀魂profile操作接口/////////////////////////////////////////////////////////

function setCookies(id, name) {
    localStorage.setItem("majSoulID", id);
    localStorage.setItem("majSoulName", name);
    showCookies();
}

function showCookies() {
    document.getElementById(
        "majSoulID"
    ).innerHTML = `<i>雀魂ID:</i>${localStorage.getItem("majSoulID")}`;
    document.getElementById(
        "majSoulName"
    ).innerHTML = `<i>雀魂Name:</i>${localStorage.getItem("majSoulName")}`;
}
/////////////////////////////////////////////////////////////////////////////

function get_cookies() {
    pywebview.api.get_cookies().then(showResponse);
}

/////雀魂战绩操作按钮///////////////////////////////////////////////////////////////
function loadData(nclick) {
    pywebview.api.loadData(nclick).then((response) => {
        showResponse(response);
        getWCollapseRoot().render(<CollapsibleTable rows={response.data} />);
    });
}

function printCountList(nclick) {
    pywebview.api.printCountList(nclick).then((response) => {
        //console.log(response)
        showResponse(response);
        getWCollapseRoot().render(<CollapsibleTable rows={response.data} />);
    });
}

var G_csvData = { field: null, strdata: null };
import { styled } from "@mui/material/styles";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

function printCSV(nclick) {
    pywebview.api.printCSV(nclick).then((response) => {
        //console.log(response.data)
        //console.log(response.strdata)
        G_csvData.field = response.data;
        G_csvData.strdata = response.strdata;
        showResponse(response);

        csvDataTrans();
    });
}

function csvDataTrans() {
    if (!G_csvData.field || !G_csvData.strdata) {
        return;
    }
    var csv = Papa.unparse({
        fields: G_csvData.field,
        data: G_csvData.strdata,
    });
    //console.log(csv)
    //console.log(G_csvData)
    var jsondata = Papa.parse(csv, {
        header: true,
        //complete: data => {console.log(data.data);}
        transform: function (value, column) {
            //console.log(value, column);
            if (
                column === "Curpt" ||
                column === "pt" ||
                column === "finalpoint" ||
                column === "deltapt" ||
                column === "rank" ||
                column === "pos"
            )
                return parseInt(value);
            return value;
        },
    });
    //console.log(jsondata)

    getWCollapseRoot().render(<EnhancedTable rows={jsondata.data} />);

    var matchColumnIndex = [];
    var matchColumnText = [];
    for (let index = 0; index < G_csvData.field.length; index++) {
        const element = G_csvData.field[index];
        if (
            element === "Curpt" ||
            element === "pt" ||
            element === "finalpoint" ||
            element === "deltapt" ||
            element === "rank" ||
            element === "pos"
        )
            matchColumnIndex.push(index);
        matchColumnText.push(element);
    }
    var transformtick = 0;
    var arraydata = Papa.parse(csv, {
        header: false,
        //complete: data => {console.log(data.data);}
        transform: function (value, column) {
            //console.log(value, column);
            transformtick++;
            if (
                transformtick > G_csvData.field.length &&
                matchColumnIndex.includes(column)
            ) {
                //console.log(transformtick, G_csvData.field.length, value, column);
                return parseInt(value);
            }
            return value;
        },
    });

    if (document.getElementById("myEEChart").style.display === "none") {
        document.getElementById("myChart").style.display = "none";
        document.getElementById("myEEChart").style.display = "block";
    } else {
        document.getElementById("myEEChart").style.display = "none";
        document.getElementById("myChart").style.display = "block";
    }
    myEchart(
        arraydata.data,
        document.getElementById("majSoulGameN").value,
        document.getElementById("myEEChart")
    );
    getmyChartRoot().render(
        <Cchart
            data={jsondata.data}
            n={document.getElementById("majSoulGameN").value}
        />
    );
}

function showCharts(off) {
    if (!off) {
        if (document.getElementById("myEEChart").style.display === "none") {
            document.getElementById("myChart").style.display = "block";
        } else {
            document.getElementById("myChart").style.display = "none";
        }
    } else {
        document.getElementById("myEEChart").style.display = "none";
        document.getElementById("myChart").style.display = "none";
    }
}

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    "& .MuiSwitch-switchBase": {
        margin: 1,
        padding: 0,
        transform: "translateX(6px)",
        "&.Mui-checked": {
            color: "#fff",
            transform: "translateX(22px)",
            "& .MuiSwitch-thumb:before": {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                    "#fff"
                )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
            },
            "& + .MuiSwitch-track": {
                opacity: 1,
                backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
            },
        },
    },
    "& .MuiSwitch-thumb": {
        backgroundColor: theme.palette.mode === "dark" ? "#003892" : "#001e3c",
        width: 32,
        height: 32,
        "&:before": {
            content: "''",
            position: "absolute",
            width: "100%",
            height: "100%",
            left: 0,
            top: 0,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                "#fff"
            )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
        },
    },
    "& .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
        borderRadius: 20 / 2,
    },
}));

const IOSSwitch = styled((props) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    "& .MuiSwitch-switchBase": {
        padding: 0,
        margin: 2,
        transitionDuration: "300ms",
        "&.Mui-checked": {
            transform: "translateX(16px)",
            color: "#fff",
            "& + .MuiSwitch-track": {
                backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
                opacity: 1,
                border: 0,
            },
            "&.Mui-disabled + .MuiSwitch-track": {
                opacity: 0.5,
            },
        },
        "&.Mui-focusVisible .MuiSwitch-thumb": {
            color: "#33cf4d",
            border: "6px solid #fff",
        },
        "&.Mui-disabled .MuiSwitch-thumb": {
            color:
                theme.palette.mode === "light"
                    ? theme.palette.grey[100]
                    : theme.palette.grey[600],
        },
        "&.Mui-disabled + .MuiSwitch-track": {
            opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
        },
    },
    "& .MuiSwitch-thumb": {
        boxSizing: "border-box",
        width: 22,
        height: 22,
    },
    "& .MuiSwitch-track": {
        borderRadius: 26 / 2,
        backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
        opacity: 1,
        transition: theme.transitions.create(["background-color"], {
            duration: 500,
        }),
    },
}));

export default function CustomizedSwitches() {
    const [checked, setchecked] = React.useState(true);
    const [ioschecked, setioschecked] = React.useState(true);

    const handleChange = (event) => {
        setchecked(event.target.checked);
        csvDataTrans();
    };
    const handleIOSChange = (event) => {
        setioschecked(event.target.checked);
        showCharts(ioschecked);
    };
    return (
        <FormGroup>
            <div>
                <FormControlLabel
                    control={
                        <MaterialUISwitch
                            sx={{ m: 1 }}
                            checked={checked}
                            onChange={handleChange}
                            inputProps={{ "aria-label": "controlled" }}
                        />
                    }
                    label="MUI switch"
                />
                <FormControlLabel
                    control={
                        <IOSSwitch
                            sx={{ m: 1 }}
                            checked={ioschecked}
                            onChange={handleIOSChange}
                            inputProps={{ "aria-label": "controlled" }}
                        />
                    }
                    label="Charts on/off"
                />
            </div>
        </FormGroup>
    );
}

function csvChart(jsondata) {
    //getmyChartRoot().render(<Cchart data={jsondata} n={document.getElementById('majSoulGameN').value} />);
    //getmyChartRoot.unmount();
}

var G_myChartRoot = null;
function getmyChartRoot() {
    const myChartContainer = document.getElementById("myChart");
    if (G_myChartRoot == null) {
        G_myChartRoot = createRoot(myChartContainer);
    }

    return G_myChartRoot;
}

function graphicCSV(nclick) {
    var majSoulGameN = document.getElementById("majSoulGameN").value;

    /*
        showResponse({ message: "请稍候..." });
        const loader = document.getElementById('loader')
        loader.classList.add('loader');
        loader.style.display = 'flex';
        */
    pywebview.api.graphicCSV(nclick, majSoulGameN).then((response) => {
        showResponse(response);
        document.getElementById("loader").style.display = "none";
    });
}

function resetFlag(nclick) {
    pywebview.api.resetFlag(nclick).then(showResponse);
}

function CButton({ btName, btFunc, tmp = null }) {
    const [n, setn] = React.useState(0);
    function handleClick() {
        setn(n + 1);
        if (btName === "reset") {
            //setIntResetflag(tmp+1);
            btFunc();
            resetFlag(n);
        } else btFunc(n + 1);
    }

    React.useEffect(() => {
        setn(0);
        console.log(btName, tmp, n);
    }, [tmp]);

    return (
        <button type="checkbox" onClick={handleClick}>
            {btName}:({n})
        </button>
    );
}

var defaultvalue = -1;

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
async function ff() {
    var ddd = 0;
    while (true) {
        G_CrossStorage.getItem("majSoulGameN", (result) => {
            defaultvalue = result;
            console.log(
                "majSoulGameN getItem result: ",
                defaultvalue,
                "|",
                result,
                "|",
                ddd
            );
        });
        ddd += 1;
        //console.log("majSoulGameN ddd ", defaultvalue, '|', ddd);
        await sleep(10);
        if (defaultvalue >= 0) break;
    }

    const ddiv = document.getElementById("buttons");
    const root1 = createRoot(ddiv);
    root1.render(<CButtonPage />);
}

ff();

function MyInput() {
    const [text, setText] = React.useState(defaultvalue);

    function handleChange(e) {
        setText(e.target.value);
        printCSV(-1);
    }

    React.useEffect(() => {
        G_CrossStorage.setItem("majSoulGameN", text, (result) => {
            console.log("majSoulGameN 完成本地存储", text, result);
        });
    }, [text]);

    return (
        <>
            <label>
                <i>查询场数:</i>{" "}
            </label>
            <input id="majSoulGameN" value={text} onChange={handleChange} />
        </>
    );
}

function CButtonPage() {
    const [IntResetflag, setIntResetflag] = React.useState(0);
    return (
        <div>
            <MyInput />
            <br />
            {/*<CButton btName="加载数据" btFunc={loadData} tmp={IntResetflag} />*/}
            <CButton btName="战绩表格" btFunc={printCountList} tmp={IntResetflag} />
            <CButton btName="战绩数据曲线图" btFunc={printCSV} tmp={IntResetflag} />
            {/*<CButton btName="战绩数据可视化图表" btFunc={graphicCSV} tmp={IntResetflag} />*/}
            <CButton
                btName="reset"
                btFunc={() => {
                    setIntResetflag(IntResetflag + 1);
                }}
                tmp={IntResetflag}
            />
            <CustomizedSwitches />
        </div>
    );
}

////操作结果显示提示框///////////////////////////////////////////////////////////////
function showResponse(response) {
    //const container = document.getElementById("py-ret-con-innerText");
    //container.innerText = response.message
}

var G_WCollapseContainerRoot = null;
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
            display: "none",
        },
        expanded: {
            display: "block",
        },
        buttonStyle: {
            display: "block",
            width: "100%",
        },
    };
    return (
        <div>
            <button
                style={style.buttonStyle}
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
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
        </div>
    );
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
            <div>
                {/*<span>动画时长500毫秒/折叠后高度40px:</span> style={{display:"none"}} */}
                <button onClick={collapseA} style={{ width: "100%" }}>
                    折叠/展开
                </button>
                <WCollapse
                    transition={`500ms`}
                    collapseHeight={collapseHeight}
                    isOpen={isOpenA}
                >
                    <div className={"collapseA"}>
                        <div id="WCollapse-innerText"></div>
                        {/*js style 设置格式*/}
                    </div>
                </WCollapse>
            </div>
        </div>
    );
}

const ddiv2 = document.getElementById("response-container");
const root2 = createRoot(ddiv2);
root2.render(<WCollapseInst />);
//root2.render(<MCollapse collapsed={false}/>);
