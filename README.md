# toy-axios

TypeScript + Vite + Vitest + Vitepress 实现的玩具版高仿 axios

## 简介

该项目是一个使用 TypeScript 开发的高仿 axios 库，旨在提供一个简单、易用且功能丰富的 HTTP 客户端工具。它基于现有的流行库 axios 进行模仿，并添加了一些额外的功能和改进。

使用 Vite 作为构建工具，使得该库具备快速的开发和构建能力。Vite 的高效开发服务器和即时热重载功能，可帮助开发者快速迭代、调试和测试代码。

为了确保库的质量和可靠性，我们采用了 Vitepress 作为文档工具，并使用 Vitest 作为测试框架。Vitepress 提供了一个简单易用的文档编写和托管环境，使得用户可以方便地查阅和理解库的使用方法、API 文档和示例代码。Vitest 则为我们提供了强大的测试框架，用于编写和运行单元测试、集成测试和端对端测试，以确保库在各种场景下的稳定性和正确性。

该高仿 axios 项目不仅保留了 axios 的核心功能，如拦截器、并发请求、请求取消等，还扩展了一些新的功能和改进。例如，我们可能添加了对其他协议的支持、更灵活的请求配置选项、自定义中间件等功能，以满足更广泛的需求和应用场景。

无论是构建现代 Web 应用，还是开发跨平台的移动应用或服务端应用，该高仿 axios 项目都可以为开发者提供便捷的 HTTP 请求处理能力，帮助他们轻松地与后端服务进行通信，并处理请求和响应的各种需求。

我们欢迎开发者使用、贡献和反馈该项目，希望它能成为你构建优秀应用的可靠伙伴。详细的安装和使用说明，请参阅文档。

请注意，本项目是基于开源库 axios 的高仿实现，旨在提供类似的 API 和功能，并非与 axios 官方项目直接相关。

## 功能特点

1.基本功能

- 提供了与原始 axios 相似的基本功能，例如执行各种类型的 HTTP 请求（GET、POST 等）、设置请求头、处理响应等。
- 与原始 axios 类似的 API 设计和用法具有极高相似性，以帮助用户快速上手。
- 目录结构以及核心机制高度还原 axios ，是学习 axios 源码和熟悉 typescript 开发不错的项目。

2.请求和拦截器

- 支持请求和响应拦截器的功能，这使得用户可以在发送请求和处理响应之前进行自定义操作，如修改请求配置、处理错误、添加认证等。
- 实现机制借鉴 axios 源码，利用 Promise 链，想要学习 axios 拦截器实现的童鞋可以先看看我这里的精简版本。

3.请求并发

- 支持同时发送多个请求的能力，以提高性能和效率。
- 一比一还原 `axios.all` 和 `axios.spread` API。

4.请求取消

- 支持请求取消的功能，这对于用户在请求发送后需要中止请求非常有用。
- 机制高度还原 axios，同样是学习 axios 取消请求机制的不错参考。

5.自定义配置选项

- 提供自定义配置选项，用户可以根据需要设置不同的请求配置，如超时时间、请求重试、请求头设置等。
- 可利用 `axios.create` 来创建符合特定需求的 axios 实例。

6.其他功能

- 自定义适配器的配置，并默认支持 'fetch' 版本实现

## 安装

```shell
$ npm install toy-axios
```
or
```shell
$ yarn add toy-axios
```

## 快速开始

本库还原了 axios 的大部分核心 api，因此在 npm 安装之后便可以直接按照 axios 的使用方式开始体验

```typescript
import axios from 'toy-axios';

// 发起一个 GET 请求
axios.get('/api/data').then((response) => {
  console.log(response.data);
}).catch((error) => {
  console.error(error);
});
```

## 联系方式

我的邮箱是 `ericwxy@foxmail.com` 可以多多交流哦。