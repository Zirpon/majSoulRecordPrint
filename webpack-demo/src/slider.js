/**  需求：
         *  1、自动切换图片
            2、鼠标移入，图片暂停，移出，图片恢复轮播
            3、左右两个按钮，点击可以切换上一张或下一张
            4、下面的四个小圆点会随图片变颜色
            5、小圆点可以点击并切换到对应的图片上
        */
 
        //获取把圆点节点放置的盒子节点，即p节点
        let pEle = document.getElementsByTagName("sliderp")[0];
        //获取事件代理的父元素section
        let secEle = document.getElementsByTagName("section")[0];
 
        let imgArr = [
            "./src/assets/images/bg1.jpg",
            "./src/assets/images/bg2.jpg",
            "./src/assets/images/bg4.png",
            "./src/assets/images/loading.jpg",
            "./src/assets/images/bg5.jpg",
        ]
        //获取时间函数的起始下标
        let i = 0;
        //图片有多少张，就传几个参进去，并且接收这个返回的数组
        let cirArr = creatCircle(imgArr.length);
        //遍历cirArr数组，将圆点添加进它的父节点p节点中
        cirArr.forEach(node => pEle.appendChild(node));
 
        //获取所有的圆点节点
        let iEle = document.getElementsByTagName("circlenode");
        //给每一个圆点添加上自定义属性，并赋上下标
        for (let k = 0; k < iEle.length; k++) {
            iEle[k].dataset.index = k;
        }
 
        let timer;
        //轮播：时间函数，1秒自动换一张
        function playTime() {
            timer = setInterval(() => {
                //循环展示图片
                i++;
                //如果已经跳到最后一张，就再次回到第一张
                if (i > imgArr.length - 1) {
                    i = 0;
                }
                //给圆点添加样式，开始运行该函数
                addStyleI(i);
                //图片标签地址（src属性）
                img.src = imgArr[i];
            }, 1000);
        }
        playTime();
 
        // 鼠标移入，图片暂停
        secEle.addEventListener("mouseenter", function () {
            clearInterval(timer);
            timer = null;
        });
        // 鼠标移出，图片恢复滚动
        secEle.addEventListener("mouseleave", playTime);
 
        //给父节点绑定一个事件代理，点击左右按钮切换图片
        secEle.addEventListener("click", function (e) {
            let event = e || window.event;
            //点击左右按钮切换图片
            if (event.target.className == "left iconfont icon-anniu_jiantouxiangzuo") {
                i--;
            }
            if (event.target.className == "right iconfont icon-anniu-jiantouxiangyou") {
                i++;
            }
            if (i < 0) {
                i = imgArr.length - 1;
            }
            if (i == imgArr.length) {//3
                i = 0;
            }
            img.src = imgArr[i];
            addStyleI(i);
            //点击小圆点可以切换到对应的图片上
            if (event.target.nodeName == "CIRCLENODE") {
                console.log("11111");
                //获得点击的圆点的自定义索引值
                cirI = event.target.dataset.index;
                //替换图片
                img.src = imgArr[cirI];
                //更改圆点样式
                addStyleI(cirI);
                //每当点击小圆点，i的值就会被赋成圆点下标的值
                i = cirI;
            }
        });
 
        //暂停图片滚动
        function picScroll() {
            clearInterval(timer);
        }
 
        //生成圆点
        function creatCircle(num) {
            //创建一个空数组来接收这个圆点
            let iArr = [];
            for (let j = 0; j < num; j++) {
                //新增圆点节点
                let circleNode = document.createElement("circlenode");
                //再把新增的圆点节点放进圆点数组中
                iArr.push(circleNode);
            }
            //完成后，返回该数组
            return iArr;
        }
 
        //给圆点添加样式
        function addStyleI(index) {
            //圆点的默认颜色是灰色
            [...iEle].forEach(node => node.style.backgroundColor = "gray");
            //当跳到该图片时，圆点变成白色
            iEle[index].style.backgroundColor = "white";
        }