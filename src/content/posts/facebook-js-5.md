---
title: Facebook 新发布的 Yarn JS 包管理器的 5 大功能
description: Integrating Facebook JavaScript SDK in web applications
date: 2016-11-15T00:00:00.000Z
tags:
  - web
  - javascript
  - facebook
  - integration
image: 'https://miro.medium.com/v2/resize:fit:1200/1*BCPTI5sT2C9JH76__X2WUg.png'
draft: false
---

```
本文由 伯乐在线 - Jiazhen Xie (@Joe_大熊猫) 翻译，艾凌风 校稿。未经许可，禁止转载！
英文出处：[Prosper Otemuyiwa](https://auth0.com/blog/five-things-you-can-do-with-yarn)
```
简而言之: 在 Javascript 中有很多软件包管理器，比如 npm，bower，component，和 volo 等等。在笔者写这篇文章时，npm 是目前最流行的 Javascript 软件包管理器。通过 npm 客户端可以获取到 npm registry 里成千上万的代码库。就在几天前，Facebook发布了一个新的 Javascript 软件包管理器，名为 Yarn，并声称它比 npm 更快，更可靠，更安全。接下来，本文将介绍Yarn的五大功能。

Yarm 是 Facebook 开发的一个新 Javascript 软件包管理器。它为 Javascript 程序员提供了快速，可靠和安全的依赖包管理。以下是 Yarn 的五大功能。

# 可离线工作

Yarn 拥有离线工作的能力。具体来说既是，之前安装过的软件包可在离线状态下再次安装，不需要网络连接。典型的例子如下：

当有网络连接时，笔者通过 Yarn 安装了两个软件包：

用 `yarn init` 创建了一个 package.json

用 yarn 安装 express 和 jsonwebtoken


安装完毕

在安装写成后，笔者直接把原目录里的 node_moduels 删除并断开网络连接，然后运行 yarn:


_Yarn 在离线状态下安装了软件包_

Voilá! 两秒之内所有的软件包就再次被安装。显然，Yarn 缓存了下载过的软件包所以不用再次下载。同时它并行化的操作最大化地使用了资源，使得安装速度前所未有地快。

# 从多个 registry 安装

Yarn 支持从不同的 registry 中安装 Javascript 软件包，比如从 npm, bower, git repository，甚至是本地文件。

默认情况下，它会从 npm registry 搜索并安装软件包：

```
yarn add <pkg-name>
```

也可以安装通过远程的 gzipped tarball 安装包：

```
yarn add <https://thatproject.code/package.tgz>
```

或者通过本地的文件系统安装：

```
yarn add file:/path/to/local/folder
```

这对于经常发布 Javascript 软件包的程序员特别地有帮助。因为可以在发布前通过 Yarn 安装到本地进行测试。

安装在 git resository 的包：

```
yarn add <git remote-url>
```

Yarn 也会自动探测在 bower registry 是否有 git repository ，如有会把它当成一个来自 git repository 的包一样对待，进行安装。


# 快速获取软件包

假如你使用过 npm，你一定有过这样的经历：运行 npm install，去看个电影再回来查看是否所以所有包已经安装完成。当然，这有点夸张，但是 npm 真的花了很多时间在遍历依赖包树和下载依赖包。用 Yarn 的话，安装时间则已从几分钟缩减到几秒钟。

Yarn 把请求高效地排序好并避免瀑布式的请求，以最大化地使用网络。它首先把请求发送到 registry 并同时递归地查找每一个依赖包。接下来，Yarn 会从一个全局性的缓存目录中查看请求包是否下载过。如果没有，Yarn 获取 tarball 包并把它放到缓存目录中供下次使用，避免重复下载。

在安装时，Yarn 并发化的操作使得安装过程更加快速。笔者分别用 npm 和 yarn 从零安装了 jsonwebtoken，express 和 lodash，结果当 Yarn 完成安装时，npm 仍在继续。

![still installing](https://cdn.auth0.com/blog/blog/yarn-npm-compare.png)

# 自动锁定软件包版本

Npm 有一个特点叫 shrinkwrap，意在锁定依赖包的版本以便在生产环境使用。shrinkwrap 的问题在于每一个开发者必须手动运行 npm shrinkwrap 以生成 npm-shrinkwrap.json 文件，而这一过程很容易被人们忽略！

对 Yarn 来说，这又是另一种情况。yarn.lock 是在安装过程中自动生成的，就像 PHP 程序员熟悉的 composer.lock 一样。yarn.lock 文件锁定了软件包的版本和所有的依赖包。有了这个文件，就可以确保团队的每一个成员都使用同一个版本的软件包，部署也变得容易，不会有意料之外的错误。

# 安装依赖包在所有机器上都一致

Npm 安装依赖包可以为开发者创建文件结构，但可能程序员 A 的 node_modules 目录跟 B 的不一样。这是因为 Npm 用的一种非决定性的方式安装依赖包。这种安装方式有时就是造成 “在我系统里运行正常” 这一常见问题的原因。

Yarn 就没有这个问题。版本锁定文件和安装算法的存在，确保了依赖包安装不管在开发环境还是生产环境，会生成一模一样的文件和文件结构。

还有一点（标题是 5 大功能，但是笔者实在太想分享关于 Yarn 的优点了），企业要求可以列出依赖包许可证的类型。Yarn 很好地满足了这个需求，只需要在文件的根目录下运行 yar licenses 即可得得到依赖包的许可证种类。

同时：Yarn 和 Auth0 的兼容

Auth0 为每一个登录的用户签发一个 JSON Web Token。这意味着系统具有一套可靠的身份识别设施，包括单点登录，用户管理，社交身份认证（Facebook, Github, Tiwtter等等），企业级身份认证（Active Directory，LDAP，SAML等等），以及数据库用户的管理，这些的实现都只需要几行代码。

通过 Lock 组件可以在 Javascript 的程序中很容易地设置认证系统。在终端用 yarn 安装 Auth0 lock 组件仅仅需要一行命令：

```
yarn add auth0-lock
```

在 `yark.lock` 的帮助下，lock 组件在几秒之内安装完毕并锁定了版本号。如果还未有 Auth0 账号，笔者建议现在就注册一个。然后在 Auth0 的用户管理主界面，从导航条的选择应用，再选择想要连接到 Javascript 框架的应用。接下来就可以阅读快速上手的文档，根据选择的 app 种类跟随文档的引导即可。

# 结语

Yarn 还在起步阶段，但是已经给 Javascript 软件包管理带来了十分显著的改善，特别是在从全局性的 registries 获取包到本地的方式上，对其速度和安全性的改善。Yarn 是否会变成最受 Javascript 程序员欢迎的软件包管理器？你和你的团队是否会用 Yarn？ 对 Yarn 有什么见解？请给我留言！
