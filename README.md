1.安装npm包
``` bash
npm install css-loader less less-loader node-less postcss-loader  --save
```
``` bash
npm i -D @angular-builders/custom-webpack
```

2.批量将.css文件改成.less

3.src下新建styles.less文件,ant.less文件
styles.less
``` less
.themeMixin(@rules) {
    :host-context(.blue) {
        @import "./theme/blue.less";
        @rules();
    }

    :host-context(.black) {
        @import "./theme/black.less";
        @rules();
    }

    :host-context(.green) {
        @import "./theme/green.less";
        @rules();
    }
}
```
ant.less,用于引入Zorro样式
``` less
@import "../node_modules/ng-zorro-antd/ng-zorro-antd.less";
```
4.src下新建theme文件夹,文件夹内新建主题less文件blue.less等等
``` less
@html-selector: html;
@primary-color: #1890FF;
```

5.引入color.less文件到assets下

6.修改index.html文件,为body加入初始类名
``` html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Color</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
</head>
<body class="blue">
  <app-root></app-root>
</body>
</html>
```
7.修改angular.json文件
(1).修改schematics
``` json
"schematics": {
    "@schematics/angular:component": {
        "styleext": "less"
    }
},
```
(2)修改builder
``` json
"builder": "@angular-builders/custom-webpack:browser",
```
(3)修改styles
``` json
 "styles": [
    "src/styles.less",
    "src/ant.less"
],
```
8.app.component.ts增加切换代码
``` js
import { Component, OnInit } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  constructor(
    private platform: Platform,
    private message: NzMessageService
  ) {

  }
  title = 'color';

  private lessLoaded = false;

  ngOnInit() {
    this.initColor();
  }

  /**
   * 设置初始颜色
   */
  private initColor() {
    if (!this.platform.isBrowser) {
      return;
    }
    const node = document.createElement('link');
    node.rel = 'stylesheet/less';
    node.type = 'text/css';
    node.href = '/assets/color.less';
    document.getElementsByTagName('head')[0].appendChild(node);
  }

  /**
   * 切换颜色
   * @param res
   */
  public changeColor(res: any) {
    if (!this.platform.isBrowser) {
      return;
    }
    const lessUrl = 'https://cdnjs.cloudflare.com/ajax/libs/less.js/2.7.2/less.min.js';
    if (this.lessLoaded) {
      this.changeTheme(res);
    } else {
      (window as any).less = {
        async: true
      };
      this.loadScript(lessUrl).then(() => {
        this.lessLoaded = true;
        this.changeTheme(res);
      });
    }
  }

  /**
   * 切换主题处理
   * @param res
   */
  private changeTheme(res) {
    (window as any).less
    .modifyVars({
      '@primary-color': res,
    })
    .then(() => {
      const body = document.body;
      const cl = body.classList[0];
      body.classList.remove(cl);
      body.classList.add(res);
      console.log(`应用成功`);
      this.message.create('success', `应用成功`);
      window.scrollTo(0, 0);
    });
  }

  /**
   * 加载less
   * @param src
   */
  private loadScript(src: string) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head!.appendChild(script);
    });
  }
}

```
9.component使用,需要引入src下的styles.less
``` less
@import "../../styles.less";
.themeMixin({
  p {
    color: @primary-color;
  }
  .todo{
      border: 1px solid @primary-color;
      font-size: 16px;
      height: 200px;
      width: 100vw;
  }
});
```
