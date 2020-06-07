/*初始化页面*/
window.onload = function(){
	//获取固定窗口展示的图片下标
	var index = 1;
	//通过ClassName获取的是数组形式，只有一个元素时取数组[0]位置
	//获取左右按钮组件
	var leftBtn = document.getElementsByClassName('leftBtn');
	var rightBtn = document.getElementsByClassName('rightBtn');
	//获取滑动窗口组件
	var imageList = document.getElementsByClassName('image-list');
	//获取分页下标组件
	var imagePage = document.getElementsByClassName('image_page');
	//获取固定窗口组件
	var rotation = document.getElementsByClassName('rotation');
	//用于记录滑动窗口组件的left值
	var num = 0;
	/*对图片进行绝对定位跳转
	 1. 0px 与第五张相同
	 2.-750px  = -1*750px 第一张
	 3.-1500px = -2*750px 第二张
	 4.-2250px = -3*750px 第三张
	 5.-3000px = -4*750px 第四张
	 6.-3750px = -5*750px 第五张
	 7.-4500px = -6*750px 与第一张相同
	 */
	/*滑动函数*/
	//图片向左滑动，即滑动窗口向右滑动
	var turnLeft = function(){
		//目前滑动窗口组件的left值
		//注意：CSS文件里的left用JS中的imageList[0].style.left得到的是空值，因此这里用offsetLeft
		num = parseInt(imageList[0].offsetLeft);
		num = num+5;
		//完整滑动到第一张图片后直接跳到最后一张，视觉效果是第一张图与第五张图相连，逻辑上不是
		if(num == 0){
			//第一张图片的实际left值
			num = 5*(-750);
		}
		//更改滑动窗口组件的left值
		imageList[0].style.left = num + 'px';
		//同步更改分页下标
		if(num % 750 == 0){
			pageChange();
		}
	}
	//图片向右切换，即滑动窗口向左滑动
	var turnRight = function(){
		//目前滑动窗口组件的left值
		//注意：CSS文件里的left用JS中的imageList[0].style.left得到的是空值，因此这里用offsetLeft
		num = parseInt(imageList[0].offsetLeft);
		num = num-5;
		//完整滑动到最后一张图片后直接跳到第一张，视觉效果是第五张图与第一张图相连，逻辑上不是
		if(num == 6*(-750)){
			//第一张图片的实际left值
			num = -750;
		}
		//更改滑动窗口组件的left值
		imageList[0].style.left = num + 'px';
		//同步更改分页下标
		if(num % 750 == 0){
			pageChange();
		}
	}
	//设置定时器，30可看作图片滑动速度，数值越大，滑动越慢，通过定期调用图片滑动函数进行滑动
	var time;
	/*根据固定窗口的图片改变分页下标的选择*/
	var pageChange = function(){
		//将分页下标都设为白色
		clearPage();
		//目前滑动窗口组件的left值
		var left = parseInt(imageList[0].offsetLeft);
		//判断left值所在的图片范围
		switch(left/750){
			//设置相应下标颜色，并获取下标
			case -1:imagePage[0].children[0].style.backgroundColor = 'orange';index=1;break;
			case -2:imagePage[0].children[1].style.backgroundColor = "orange";index=2;break;
			case -3:imagePage[0].children[2].style.backgroundColor = "orange";index=3;break;
			case -4:imagePage[0].children[3].style.backgroundColor = "orange";index=4;break;
			case -5:imagePage[0].children[4].style.backgroundColor = "orange";index=5;break;
		}
	}
	
	//左按钮点击事件
	leftBtn[0].onclick = function(){
		//1、出现点击事件时先暂停滑动窗口的滑动
		clearInterval(time);
		//2、读取当前滑动窗口的left值
	    num = parseInt(imageList[0].offsetLeft);
		//3、获取前一张图片下标
		var pre = index-1;
		//4、设置定时器，自动滑动到上一张图片
		time = setInterval(function(){
			//第一张滑到最后一张时要进行特殊处理
			if(pre == 0){
				pre = 5;
			}
			//调用向左滑动函数
			turnLeft();
			//到达上一张图片后停止滑动
			if(num == -pre*750){
				clearInterval(time);
			}
		},0);
	};
	
	//右按钮点击事件
	rightBtn[0].onclick = function(){
		//与左按钮点击类似
		//1、出现点击事件时先暂停滑动窗口的滑动
		clearInterval(time);
		//2、读取当前滑动窗口的left值
	    num = parseInt(imageList[0].offsetLeft);
		//3、获取后一张图片下标
		var next = index+1;
		//4、设置定时器，自动滑动到下一张图片
		time = setInterval(function(){
			//最后一张滑到第一张时要进行特殊处理
			if(next == 6){
				next = 1;
			}
			//调用向右滑动函数
			turnRight();
			//到达下一张图片后停止滑动
			if(num == -next*750){
				clearInterval(time);
			}
		},0);
	};
	
	//分页下标点击事件
	for (var i=0;i<5;i++) {
		//ES5语法
		(function (i){
			imagePage[0].children[i].onclick = function(){
				//将原先的滑动停止
				clearInterval(time);
				//将分页下标都设为白色
				clearPage();
				//设置新分页下标
				imagePage[0].children[i].style.backgroundColor = 'orange';
				//获取对应图片下标
				var go = i+1;
				//设置定时器，自动滑动到对应图片
				time = setInterval(function(){
					if(index < go){ //向右滑动
						//调用向右滑动函数
						turnRight();
					}else if(index > go){ //向左滑动
						//调用向左滑动函数
						turnLeft();
					}else if(num % 750!=0){ //排除卡在中间的情况
						//目标left大往左，目标left小往右
						if(num < -go*750){ 
							turnLeft();
						}else{
							turnRight();
						}
					}
					//到达对应图片后停止滑动
					if(num == -go*750){
						clearInterval(time);
					}
				},0);
			}
		})(i);
	}
	
	//还原分页下标，将分页下标都设为白色
	function clearPage(){
		for (var i=0;i<5;i++) {
			imagePage[0].children[i].style.backgroundColor = 'white';
		}
	}
	
}


