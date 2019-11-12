import { Component, OnInit, Renderer2, ViewChild, ElementRef, ViewContainerRef } from '@angular/core';
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
    private render: Renderer2,
    private el: ElementRef,
    private message: NzMessageService
  ) {

  }
  title = 'color';

  private lessLoaded = false;

  ngOnInit() {
    this.initColor();
    setTimeout(() => {
      console.warn(this.el.nativeElement);
    }, 8000);
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
      // this.render.addClass(this.bodyDom, res);
      // this.render.removeClass(this.bodyDom, 'blue');
      console.log(`应用成功`);
      // this.message.create('success', `应用成功`);
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
