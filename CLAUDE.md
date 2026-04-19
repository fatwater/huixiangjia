# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

微信小程序项目，使用 Skyline 渲染引擎和 glass-easel 组件框架。

## 开发命令

- 使用微信开发者工具打开项目目录即可运行和调试
- ESLint 检查：`npx eslint .`（需先安装 eslint）

## 技术架构

### 渲染引擎
- 使用 **Skyline** 渲染引擎（新渲染模式），相比 WebView 有更好的性能
- 配置项在 `app.json` 的 `rendererOptions.skyline`
- `tagNameStyleIsolation` 设置为 `legacy`（传统样式隔离模式）

### 组件框架
- 使用 **glass-easel** 作为组件框架
- 自定义组件放在 `components/` 目录

### 项目结构
```
├── app.js / app.json / app.wxss    # 应用入口配置
├── pages/                           # 页面目录
│   └── index/                       # 示例页面
├── components/                     # 自定义组件目录
│   └── navigation-bar/              # 自定义导航栏组件
├── project.config.json              # 项目配置（AppID、编译选项等）
├── project.private.config.json      # 私有配置（本地调试设置）
└── .eslintrc.js                     # ESLint 配置
```

### 导航栏组件 (navigation-bar)
- 自定义导航栏，替代微信原生导航栏
- 支持返回按钮、首页按钮、标题、loading 状态
- 通过 `navigationStyle: custom` 在 `app.json` 中启用自定义导航
- 使用微信 API 获取胶囊按钮位置 (`wx.getMenuButtonBoundingClientRect()`)

### 页面配置
- `app.json` 中 `lazyCodeLoading: "requiredComponents"` 启用按需加载组件
- 使用 `<scroll-view>` 而非原生页面滚动

### 微信 API 全局对象
代码中可使用 `wx` 全局对象，ESLint 配置已声明：
- `wx`、`App`、`Page`、`Component`、`getCurrentPages`、`getApp`
- `requirePlugin`、`requireMiniProgram`
