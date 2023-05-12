var canvas = document.getElementById("myCanvas");
			//var canvas = $("#myCanvas");
			var ctx = canvas.getContext("2d");
			//线条的颜色
			ctx.strokeStyle = "#000";
			//线条的宽度像素
			ctx.lineWidth = 1;

			var space = 50; //棋盘边界与画布边界的间距
			var cell_num = 18; //一共几个格子
			var width = $("#container2").width() - space * 2; // 棋盘的宽度
			var height = $("#container2").height() - space * 2; // 棋盘的高度
			var cell_width = width / cell_num; // 每个格子的宽度
			var cell_height = height / cell_num; // 每个格子的宽度
			var chess_size = cell_width / 2 - 2; //棋子的直径


			var game_status = 1;
			var qi = "black";
			var chess = new Array();
			var step = 0; //存储下棋步骤
			var has_chess = false;
			var is_win = false;

			init();

			function init() {
				draw();
			}


			//重新开始
			function rePlay() {
				game_status = 1;
				qi = "black";
				chess = new Array(); //重置棋数组
				step = 0; //存储下棋步骤
				has_chess = false;
				is_win = false;
				/*canvas.getContext("2d");
				ctx.clearRect(0, 0, canvas.width, canvas.height);*/
				canvas.setAttribute("height", $("#container2").height());
				draw();
			}

			/**
			 * 重新加载画面（刷新画面）
			 * @param {Object} chess
			 */
			function reload(chess) {

				//重新绘制棋盘跟棋子.
				canvas.setAttribute("height", $("#container2").height());
				draw();
				qi = qi == "black" ? "white" : "black";
				chess.forEach(item => {
					draw_chess(item.x, item.y, item.color, item.step);
				});
			}

			/**
			 * 绘制棋盘
			 */
			function draw() {

				//画横线
				for (let i = 0; i < cell_num + 1; i++) {
					let y = i * cell_width + space;
					let endx = width + space;
					//console.log(endx);
					ctx.beginPath();
					ctx.lineTo(space, y);
					ctx.lineTo(endx, y);
					ctx.stroke();
				}

				//画竖线
				for (let j = 0; j < cell_num + 1; j++) {
					let x = j * cell_width + space;
					let endy = height + space;
					ctx.beginPath();
					ctx.lineTo(x, space);
					ctx.lineTo(x, endy);
					ctx.stroke();
				}

				for (let sx = 1; sx <= 3; sx++) {

					for (let sy = 1; sy <= 3; sy++) {
						//画星位
						ctx.beginPath(); //重置路径
						ctx.fillStyle = "#000"; //设置背景黑色
						//ctx.arc(cell_width*3, cell_height*3,15, 0, Math.PI*2,true);
						ctx.arc(cell_width * 3 * (sx * 2 - 1) + space, cell_height * 3 * (sy * 2 - 1) + space, 5, 0, Math.PI * 2,
							true);
						//ctx.arc(3, 3,18,0,Math.PI*2,true);
						ctx.closePath();
						ctx.fill();
						//console.log(sx, sy);
					}

				}

			}

			/**
			 * 落子
			 */
			$("#myCanvas").click(function() {
				var cx = event.pageX - $(this).offset().left; //获取鼠标点击的x坐标点
				var cy = event.pageY - $(this).offset().top; //获取鼠标点击的y坐标点
				//console.log("event.pageY, canvas.getBoundingClientRect().top", event.pageY, canvas.getBoundingClientRect().top);
				//console.log(cx, cy);
				var xi = Math.round((cx - space) / cell_width); //获取所在行
				var yi = Math.round((cy - space) / cell_height); //获取所在列
				// 显示步数
				console.log("xi,yi", xi, yi);
				if (xi < 0 || xi > cell_num || yi < 0 || yi > cell_num) {
					return;
				}
				play(xi, yi);
				//console.log("-----------------------------------");
			});

			/**
			 * 退一步
			 */
			$("#backBtn").click(function() {
				console.log(is_win);
				if (is_win) {
					alert("游戏已经结束， 不能悔棋， 请重新开局");
					return;
				}
				step--; //步数-1
				chess.pop(); //移除最后一颗棋子
				reload(chess);
			});

			/**
			 * 重新开始
			 */
			$("#reStartBtn").click(function() {
				rePlay();
			});

			// 开始落子 计算
			function play(xi, yi) {

				if (game_status != 1) {
					/*ctx.beginPath();
					ctx.fillStyle="red";
					ctx.font="48px '微软雅黑'";
					ctx.textAlign="center";
					ctx.fillText("游戏已经结束，不能再落子，请重新开始！", cell_num/2*cell_width + space,cell_num/2*cell_height + space);
					ctx.restore();
					ctx.closePath();*/
					alert("游戏已经结束，不能再落子，请重新开始！");
					return;
				}

				step++; //步数+1

				var pos = {
					'x': xi,
					'y': yi,
					'step': step,
					'color': qi
				}; // 存储当前棋子的信息 所在行列数、步数、颜色

				chess.forEach(item => {
					if (item.x == xi && item.y == yi) {
						has_chess = true;
					}
				})

				if (has_chess) {
					step--; // 如果存在棋子， 步数减回去
					has_chess = false; // 重新设置是否找到棋子
					return;
				}

				chess.push(pos);

				draw_chess(xi, yi, qi, step);

				if (check_win(chess, qi)) {
					let msg = game_status == 2 ? "黑棋赢了" : "白棋赢了";
					//$("#win_msg").html(msg);
					//$("#win_msg").show();
					ctx.beginPath();
					ctx.fillStyle = "red";
					ctx.font = "48px '微软雅黑'";
					ctx.textAlign = "center";
					ctx.fillText(msg, cell_num / 2 * cell_width + space, cell_num / 2 * cell_height + space);
					ctx.restore();
					ctx.closePath();


					return;
				}
				qi = qi == "black" ? "white" : "black";

			}

			/**
			 * 绘制棋子
			 * @param x坐标 xi
			 * @param y坐标 yi
			 * @param 棋子颜色 qi
			 * @param 当前步数 curr_step
			 */
			function draw_chess(x, y, qi, curr_step) {
				ctx.fillStyle = '#EB852A';
				ctx.shadowOffsetX = 0; // 阴影Y轴偏移
				ctx.shadowOffsetY = 0; // 阴影X轴偏移
				ctx.shadowBlur = 10; // 模糊尺寸
				ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'; // 颜色

				//var color
				//画棋子
				ctx.beginPath(); //重置路径
				ctx.fillStyle = qi; //设置棋子颜色
				ctx.arc(x * cell_width + space, y * cell_height + space, chess_size, 0, Math.PI * 2, true); //画圆
				ctx.closePath(); //关闭路径
				ctx.fill(); // 填充路径（即填充棋子颜色）
				//flag = chess.indexOf(pos)==-1?false:true;
				//console.log(chess);
				step_color = qi == "black" ? "white" : "black";
				//显示步骤
				ctx.fillStyle = step_color;
				ctx.font = "14px '微软雅黑'";
				ctx.textAlign = "center";
				ctx.fillText(curr_step, x * cell_width + space, y * cell_height + cell_height / 8 + space);
				ctx.restore();
				ctx.closePath();
			}


			/**
			 * 检查是否赢了
			 * @param 当前棋子数组 ck_chess
			 * @param {Object} color
			 */
			function check_win(ck_chess, color) {

				//横竖十九个交叉点，定义一个19x19的数组去存储当前行棋方所有的棋子的位置
				var m = new Array();
				for (var i = 0; i < cell_num + 1; i++) {
					m.push([]);
					for (let j = 0; j < cell_num + 1; j++) {
						m[i].push(0);
					}
					//console.log(m[i]);
				}

				//console.log(ck_chess);
				for (let c in ck_chess) {
					//console.log("c", ck_chess[c]);
					if (ck_chess[c].color == color) {
						//x表示列，y表示行
						m[ck_chess[c].y][ck_chess[c].x] = 1;
					}
				}

				//console.log(cell_num+1);
				//console.log("test");
				//console.log("m", m);

				var direct_arr = [
					[
						[-1, 0],
						[1, 0]
					],
					[
						[0, -1],
						[0, 1]
					],
					[
						[-1, -1],
						[1, 1]
					],
					[
						[-1, 1],
						[1, -1]
					]
				];

				var dx = 0;
				var dy = 0;
				var num1 = 0;
				var num2 = 0;

				var lx = ck_chess[ck_chess.length - 1].x;
				var ly = ck_chess[ck_chess.length - 1].y;
				//console.log("lx,ly", lx ,ly);
				for (var i = 0; i < direct_arr.length; i++) {

					dx = direct_arr[i][0][0];
					dy = direct_arr[i][0][1];

					num1 = calc_one_line(lx, ly, dx, dy, m);

					dx = direct_arr[i][1][0];
					dy = direct_arr[i][1][1];

					num2 = calc_one_line(lx, ly, dx, dy, m);
					console.log("num1 + num2", num1 + num2);
					if (num1 + num2 + 1 >= 5) {
						game_status = color == "black" ? 2 : 3; //判断哪方赢棋
						is_win = true;
						return true;
					}
				}

				return false;
			}


			/**
			 * 计算每一个方向上棋子数量
			 * @param 最后一颗棋子的x坐标 lx
			 * @param 最后一颗棋子的x坐标 ly
			 * @param 最后一颗棋子的某一方向上x坐标的距离 dx
			 * @param 最后一颗棋子的某一方向上y坐标的距离 dy
			 * @param 当前颜色棋子矩阵 m
			 * @return 返回当前连线的棋子数量
			 */
			function calc_one_line(lx, ly, dx, dy, m) {
				var num = 0;
				var tx = lx;
				var ty = ly;
				//do something here
				while (true) {

					tx += dx;
					ty += dy;

					if (tx < 0 || tx >= cell_num + 1 || ty < 0 || ty >= cell_num + 1 || m[ty][tx] == 0) {
						return num;
					}
					num++;

				}
				return num;
			}