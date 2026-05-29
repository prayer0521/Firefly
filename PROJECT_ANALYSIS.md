# Firefly Blog 项目深度剖析

> **项目名称**: Firefly  
> **版本**: 6.10.7  
> **技术栈**: Astro 6.x + Svelte 5 + Tailwind CSS 4 + TypeScript  
> **包管理器**: pnpm 9.14.4  
> **说明**: 基于 Astro 框架和 Fuwari 模板开发的清新美观且现代化的个人博客主题模板

---

## 目录

1. [项目概览与架构](#1-项目概览与架构)
2. [配置文件系统](#2-配置文件系统)
3. [类型系统](#3-类型系统)
4. [国际化 (i18n) 系统](#4-国际化-i18n-系统)
5. [常量与预设](#5-常量与预设)
6. [内容管理](#6-内容管理)
7. [工具函数](#7-工具函数)
8. [布局系统](#8-布局系统)
9. [页面路由](#9-页面路由)
10. [组件系统](#10-组件系统)
11. [Markdown 插件系统](#11-markdown-插件系统)
12. [样式系统](#12-样式系统)
13. [构建脚本](#13-构建脚本)
14. [CI/CD 与部署](#14-cicd-与部署)
15. [数据流总结](#15-数据流总结)

---

## 1. 项目概览与架构

### 1.1 技术栈全景

```
核心框架:  Astro 6.4.2 (SSG - 静态站点生成)
UI 框架:   Svelte 5 (交互式组件)
CSS:       Tailwind CSS 4 + Stylus + 自定义 CSS
语言:      TypeScript 5.9
内容:      Markdown/MDX (通过 Astro Content Collections)
图标:      Iconify (astro-icon)
代码高亮:  Expressive Code (astro-expressive-code)
路由过渡:  Swup.js (@swup/astro)
搜索:      Pagefind
图片优化:  Sharp + Astro Image
数学公式:  KaTeX + remark-math
图表:      Mermaid + PlantUML
评论系统:  支持 Twikoo/Waline/Giscus/Disqus/Artalk
看板娘:    Live2D + Spine
RSS:       @astrojs/rss
站点地图:  @astrojs/sitemap
```

### 1.2 目录结构总览

```
blog/
├── astro.config.mjs          # Astro 核心配置（插件、markdown、vite）
├── package.json              # 依赖和脚本
├── tsconfig.json             # TypeScript 配置
├── svelte.config.js          # Svelte 配置
├── tailwind.config.mjs       # Tailwind CSS 配置
├── biome.json                # Biome 代码格式化/lint 配置
├── vercel.json               # Vercel 部署配置
├── pagefind.yml              # Pagefind 搜索配置
├── postcss.config.mjs        # PostCSS 配置
│
├── public/                   # 静态资源（直接复制到构建输出）
│   ├── assets/               # CSS/JS/图片静态文件
│   ├── favicon/              # 多尺寸/多主题 favicon
│   ├── gallery/              # 相册图片（按相册分子目录）
│   └── pio/                  # 看板娘模型（Live2D + Spine）
│
├── scripts/                  # 构建时脚本
│   ├── generate-icons.js     # 生成内联 SVG 图标数据
│   ├── generate-lqips.ts     # 生成 LQIP 占位符数据
│   └── new-post.js           # 创建新文章的 CLI 工具
│
├── src/
│   ├── assets/               # 需要 Astro 处理的图片资源
│   │   └── images/           # 壁纸、头像等
│   │
│   ├── components/           # 所有 UI 组件
│   │   ├── analytics/        # 统计分析组件
│   │   ├── comment/          # 评论系统组件
│   │   ├── common/           # 通用基础组件
│   │   ├── controls/         # 交互控件组件
│   │   ├── features/         # 功能特性组件
│   │   ├── layout/           # 布局组件
│   │   ├── misc/             # 杂项组件（许可证、推荐等）
│   │   ├── pages/            # 页面级组件（番组计划、相册、搜索）
│   │   └── widget/           # 侧边栏小部件组件
│   │
│   ├── config/               # 所有配置文件
│   │   ├── index.ts          # 统一导出入口
│   │   ├── siteConfig.ts     # 站点主配置
│   │   ├── navBarConfig.ts   # 导航栏配置
│   │   ├── sidebarConfig.ts  # 侧边栏布局配置
│   │   ├── profileConfig.ts  # 个人资料配置
│   │   ├── commentConfig.ts  # 评论系统配置
│   │   ├── friendsConfig.ts  # 友链配置
│   │   ├── musicConfig.ts    # 音乐播放器配置
│   │   ├── sponsorConfig.ts  # 赞助配置
│   │   ├── galleryConfig.ts  # 相册配置
│   │   ├── fontConfig.ts     # 字体配置
│   │   ├── adConfig.ts       # 广告配置
│   │   ├── announcementConfig.ts # 公告配置
│   │   ├── backgroundWallpaper.ts # 背景壁纸配置
│   │   ├── coverImageConfig.ts # 封面图配置
│   │   ├── effectsConfig.ts  # 特效配置（樱花等）
│   │   ├── expressiveCodeConfig.ts # 代码高亮配置
│   │   ├── footerConfig.ts   # 页脚配置
│   │   ├── licenseConfig.ts  # 许可证配置
│   │   ├── pioConfig.ts      # 看板娘配置
│   │   └── plantumlConfig.ts # PlantUML 配置
│   │
│   ├── constants/            # 常量定义
│   ├── content/              # 内容文件
│   │   ├── config.ts         # 内容集合定义
│   │   ├── posts/            # 博客文章 (.md/.mdx)
│   │   └── spec/             # 特殊页面内容（关于、友链）
│   │
│   ├── i18n/                 # 国际化
│   ├── layouts/              # 页面布局
│   ├── pages/                # 路由页面
│   ├── plugins/              # Markdown 插件
│   ├── styles/               # 样式文件
│   ├── types/                # TypeScript 类型定义
│   └── utils/                # 工具函数
```

### 1.3 核心架构图

```
用户请求 URL
    │
    ▼
Astro 路由匹配 (src/pages/)
    │
    ▼
Layout.astro ─── 基础 HTML 骨架, SEO meta, 主题/壁纸初始化脚本
    │
    ▼
MainGridLayout.astro ─── 导航栏 + 壁纸/Banner + 网格布局 + 侧边栏 + 页脚
    │
    ▼
页面组件 (Home/Post/Archive/...)
    │
    ▼
内容渲染 (src/content/ → Markdown/MDX → remark/rehype 插件处理)
```

---

## 2. 配置文件系统

### 2.1 `src/config/index.ts` — 统一导出入口

**功能**: 将所有子配置文件统一导出，让组件可以通过 `import { xxx } from "@/config"` 一次导入多个配置。

**实现**: 通过 `export` 语句从各个子配置文件中重新导出。这样避免了组件中大量的分散导入语句。

### 2.2 `src/config/siteConfig.ts` — 站点主配置

**功能**: 定义整个博客站点的全局配置。

**核心字段**:
| 字段 | 说明 |
|------|------|
| `title` | 站点标题 "Firefly" |
| `subtitle` | 副标题 |
| `site_url` | 站点完整 URL |
| `themeColor.hue` | 主题色相 (0-360)，所有主题颜色由此派生 |
| `themeColor.fixed` | 是否禁止用户切换主题色 |
| `themeColor.defaultMode` | 默认明暗模式: "light"/"dark"/"system" |
| `pageWidth` | 页面最大宽度 (rem) |
| `card.border` | 卡片是否显示边框和阴影 |
| `card.followTheme` | 卡片是否追随主题色 |
| `navbar` | 导航栏配置 (Logo, 标题, 对齐, 吸顶等) |
| `postListLayout` | 文章列表布局 (list/grid, 瀑布流开关等) |
| `pagination.postsPerPage` | 每页文章数 |
| `pages` | 页面开关 (friends/sponsor/guestbook/bangumi/gallery) |
| `analytics` | 统计分析 (Google/Umami/51la/Clarity) |
| `imageOptimization` | 图片优化 (avif/webp, 质量, 防盗链域名) |
| `font` | 字体配置入口 |
| `lang` | 站点语言代码 |

### 2.3 `src/config/navBarConfig.ts` — 导航栏配置

**功能**: 定义导航栏菜单项。每个菜单项可以是自定义链接 (`NavBarLink`) 或预设 (`LinkPreset` 枚举: Home/Archive/About/Friends/Sponsor/Guestbook/Bangumi/Gallery)。

**实现**: 预设通过 `src/constants/link-presets.ts` 映射为带图标的导航链接。

### 2.4 `src/config/sidebarConfig.ts` — 侧边栏配置

**功能**: 控制侧边栏的显示位置、组件组成和响应式行为。

**核心字段**:
- `enable`: 是否启用侧边栏
- `position`: "left"/"right"/"both"
- `tabletSidebar`: 平板端显示哪侧
- `leftComponents` / `rightComponents`: 小部件列表
- `mobileBottomComponents`: 移动端底部显示的组件

### 2.5 其他配置文件

- **profileConfig.ts**: 博主头像、姓名、简介、社交链接
- **commentConfig.ts**: 评论系统选择及配置 (Twikoo/Waline/Giscus/Disqus/Artalk)
- **friendsConfig.ts**: 友链列表，支持权重排序、标签、随机排序
- **musicConfig.ts**: 音乐播放器配置 (Meting API 或本地音乐)
- **sponsorConfig.ts**: 赞助方式 (支付宝/微信/PayPal) 和赞助者列表
- **galleryConfig.ts**: 相册列表配置
- **fontConfig.ts**: 自定义字体配置
- **backgroundWallpaper.ts**: 壁纸模式配置 (banner/fullscreen/overlay/none)
- **effectsConfig.ts**: 樱花特效参数
- **expressiveCodeConfig.ts**: 代码高亮主题和折叠插件
- **plantumlConfig.ts**: PlantUML 服务器和主题

---

## 3. 类型系统

### 3.1 `src/types/config.ts`

**功能**: 定义所有配置相关的 TypeScript 类型，确保配置文件的类型安全。

**核心类型**:

| 类型 | 说明 |
|------|------|
| `SiteConfig` | 站点主配置类型 |
| `NavBarLink` | 导航链接 |
| `NavBarConfig` | 导航栏配置 |
| `ProfileConfig` | 个人资料 |
| `CommentConfig` | 评论系统 |
| `SidebarLayoutConfig` | 侧边栏布局 |
| `WidgetComponentConfig` | 小部件 (profile/categories/tags/TOC/广告/统计/日历/音乐) |
| `BackgroundWallpaperConfig` | 壁纸配置 (4种模式) |
| `SakuraConfig` | 樱花特效参数 |
| `SpineModelConfig` | Spine 看板娘 |
| `Live2DWidgetConfig` | Live2D 看板娘 |
| `MusicPlayerConfig` | 音乐播放器 |
| `SponsorConfig` | 赞助 |
| `GalleryConfig` | 相册 |
| `FontConfig` | 字体 |
| `PlantUMLConfig` | PlantUML 图表 |
| `ExpressiveCodeConfig` | 代码块配置 |
| `LinkPreset` | 预设链接枚举 (0=Home, 1=Archive, 2=About, 3=Friends, 4=Sponsor, 5=Guestbook, 6=Bangumi, 7=Gallery) |

### 3.2 `src/types/bangumi.ts`

**功能**: Bangumi 番组计划的 API 响应类型定义。

**核心类型**:
- `UserSubjectCollection`: 用户收藏条目 (评分、进度、标签)
- `SlimSubject`: 条目简略信息 (名称、图片、评分、排名)
- `SubjectType`: 1=书籍, 2=动画, 3=音乐, 4=游戏, 6=三次元
- `CollectionType`: 1=想看, 2=看过, 3=在看, 4=搁置, 5=抛弃

---

## 4. 国际化 (i18n) 系统

### 4.1 `src/i18n/i18nKey.ts` — 文本键枚举

**功能**: 定义所有可翻译文本的唯一键值。是一个 `enum`，大约 200+ 个键覆盖了 UI 中所有文本。

### 4.2 `src/i18n/translation.ts` — 翻译核心

**功能**: 提供翻译查找和回退机制。

**核心函数**:
- `getTranslation(lang)`: 根据语言代码查找翻译映射
- `i18n(key)`: 获取当前站点语言的翻译文本。如果当前语言没有对应翻译，回退到中文 (zh_CN)，再不行回退到英文 (en)

**实现**: 将所有语言的翻译对象存储在 Map 中，通过 `siteConfig.lang` 确定当前语言。支持映射别名（如 `en_us` → `en`, `ja_jp` → `ja`）。

### 4.3 `src/i18n/languages/*.ts` — 各语言翻译

**文件**:
- `zh_CN.ts`: 简体中文
- `zh_TW.ts`: 繁体中文
- `en.ts`: 英文
- `ja.ts`: 日文
- `ru.ts`: 俄文

每个文件导出一个 `Translation` 对象，将 `I18nKey` 枚举值映射到对应语言的字符串。

---

## 5. 常量与预设

### 5.1 `src/constants/constants.ts`

**功能**: 定义整个应用中使用的常量。

```typescript
PAGE_SIZE = 8                                    // 默认分页大小
LIGHT_MODE / DARK_MODE / SYSTEM_MODE              // 主题模式常量
WALLPAPER_BANNER / FULLSCREEN / OVERLAY / NONE    // 壁纸模式常量
BANNER_HEIGHT = 35                                // Banner 高度 (vh)
BANNER_HEIGHT_EXTEND = 30                         // Banner 扩展高度 (vh)
BANNER_HEIGHT_HOME = 65                           // 首页 Banner 高度 (vh)
MAIN_PANEL_OVERLAPS_BANNER_HEIGHT = 3.5           // 主面板叠加高度 (rem)
UNCATEGORIZED = "uncategorized"                   // 未分类标识
```

### 5.2 `src/constants/link-presets.ts`

**功能**: 将 `LinkPreset` 枚举值映射为实际的导航链接对象（包含名称、URL 和图标）。

**实现**: 使用 `i18n()` 函数获取本地化的链接名称，通过 `material-symbols` 图标前缀指定图标。

### 5.3 `src/constants/icon.ts`

**功能**: 定义默认的 favicon 配置（亮色/暗色模式下不同尺寸的图标）。

### 5.4 `src/constants/icons.ts`

**功能**: 内联 SVG 图标数据。由 `scripts/generate-icons.js` 自动生成。将常用的 Iconify 图标预编译为内联 SVG 字符串，避免运行时网络请求。

**核心函数**:
- `getIconSvg(name)`: 根据图标名获取 SVG HTML
- `hasIcon(name)`: 检查图标是否存在

---

## 6. 内容管理

### 6.1 `src/content.config.ts` — 内容集合定义

**功能**: 使用 Astro 的 Content Layer API 定义两个集合。

**posts 集合**:
- 加载 `src/content/posts/` 下的所有 `.md` 和 `.mdx` 文件
- Schema 包含: title, published, updated, draft, description, image, tags, category, lang, pinned, author, sourceLink, licenseName, licenseUrl, comment, password, passwordHint
- 自动生成内部字段: prevTitle, prevSlug, nextTitle, nextSlug (用于文章导航)

**spec 集合**:
- 加载 `src/content/spec/` 下的文件 (about, friends, guestbook)

### 6.2 文章 Frontmatter 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `title` | string | 文章标题 |
| `published` | Date | 发布日期 |
| `updated` | Date? | 更新日期 |
| `draft` | boolean | 是否为草稿（生产环境过滤） |
| `description` | string | 文章摘要 |
| `image` | string | 封面图路径 或 "api" 使用随机图 API |
| `tags` | string[] | 标签列表 |
| `category` | string? | 分类 |
| `lang` | string | 文章语言 |
| `pinned` | boolean | 是否置顶 |
| `password` | string | 加密密码（非空启用内容加密） |
| `passwordHint` | string | 密码提示 |
| `comment` | boolean | 是否显示评论区 |

---

## 7. 工具函数

### 7.1 `content-utils.ts` — 内容处理

**核心函数**:

**`getRawSortedPosts()`** (私有)
- 通过 `getCollection("posts")` 获取所有文章
- 生产环境自动过滤 `draft: true` 的文章
- 排序规则: 置顶优先 → 按发布日期从新到旧

**`getSortedPosts()`**
- 调用 `getRawSortedPosts()`
- 为每篇文章计算 `prevSlug/prevTitle` 和 `nextSlug/nextTitle`（前一篇/后一篇导航）

**`getSortedPostsList()`**
- 返回去掉 `body` 字段的文章列表（减少数据量，用于列表页）

**`getTagList()`**
- 遍历所有文章收集标签
- 统计每个标签的文章数量
- 按字母排序

**`getCategoryList()`**
- 统计每个分类的文章数量
- 将无分类的文章归为 `i18n(uncategorized)`
- 按文章数量降序排列

**`getRelatedPosts(currentPost, maxCount=5)`**
- 智能推荐算法，评分公式:
  - `tagMatchScore (0-100)`: 标签 Jaccard 相似度 × 100
  - `titleSimilarityScore (0-100)`: 标题分词 Jaccard 相似度 × 100
  - `timeFreshnessScore (0-30)`: 6 个月半衰期指数衰减
  - `categoryBonus (0 or 10)`: 同分类 +10 分
- 优先返回有标签匹配的文章
- 使用 `Intl.Segmenter` 进行中英文分词

### 7.2 `date-utils.ts` — 日期处理

- `formatDateToYYYYMMDD(date)`: ISO 日期 → "YYYY-MM-DD" 格式
- `formatDateI18n(date, includeTime?)`: 根据站点语言配置格式化日期
- `formatDateI18nWithTime(date)`: 带时分秒的国际化日期格式
- `formatDateTimeToYYYYMMDDHHmm(date)`: 统一格式 "YYYY-MM-DD HH:mm"，支持站点时区配置

**实现**: 使用 `Intl.DateTimeFormat` API 和 `toLocaleDateString`。支持通过 `siteConfig.timezone` 设置时区。

### 7.3 `url-utils.ts` — URL 处理

- `removeFileExtension(id)`: 移除 `.md`/`.mdx` 扩展名
- `pathsEqual(path1, path2)`: 比较两个路径是否相等（忽略大小写和首尾斜杠）
- `joinUrl(...parts)`: 智能拼接 URL（区分网络 URL 和本地路径）
- `getPostUrlBySlug(slug)`: slug → 完整文章 URL
- `getTagUrl(tag)`: 标签 → `/archive/?tag=xxx`
- `getCategoryUrl(category)`: 分类 → `/archive/?category=xxx`
- `url(path)`: 本地路径 → 带 BASE_URL 的完整路径；网络 URL 直接返回
- `getSearchUrl(query)`: 生成搜索 URL

### 7.4 `setting-utils.ts` — 设置管理（核心）

这是整个博客主题/壁纸/特效设置的核心管理文件。

#### 主题管理

- `getDefaultHue()`: 从 `#config-carrier` DOM 元素的 `data-hue` 属性获取默认色相
- `getDefaultTheme()`: 从 `siteConfig.themeColor.defaultMode` 获取默认主题
- `getSystemTheme()`: 通过 `matchMedia("prefers-color-scheme: dark")` 检测系统主题
- `resolveTheme(theme)`: 如果是 "system" 则获取系统主题，否则返回原值
- `setTheme(theme)`: 设置主题 → 保存到 localStorage → 应用到 DOM → 设置系统主题监听
- `applyThemeToDocument(theme)`: 将主题应用到 `html.dark` 类和 `data-theme` 属性
- `initThemeListener()`: 页面加载后初始化，如果是 system 模式则开始监听系统主题变化

#### 壁纸模式管理

- `applyWallpaperModeToDocument(mode, animate)`: 切换壁纸模式的核心函数
  - 更新 `html[data-wallpaper-mode]` 属性
  - 切换 body 的 CSS 类 (`enable-banner`, `wallpaper-transparent`, `no-banner-layout`)
  - 调用对应的显示函数 (`showBannerMode`/`showFullscreenMode`/`showOverlayMode`/`hideAllWallpapers`)

**Banner 模式**: 
- 显示 wallpaper-wrapper，设置 `top: -30vh` 实现向上偏移
- 根据是否为首页/移动端决定是否显示 banner

**Fullscreen 模式**:
- 壁纸占满 100vh，主内容紧跟其后
- 带动画过渡（从当前位置滑到 100vh 下方）

**Overlay 模式**:
- 壁纸全屏显示，内容区域半透明叠加在上面
- 主内容从导航栏下方开始

**None 模式**:
- 完全隐藏壁纸，纯色背景

#### Overlay 设置管理
- `setOverlayOpacity/blur/cardOpacity()`: 设置并保存 overlay 模式下的透明度/模糊度/卡片透明度参数
- 通过 CSS 变量 `--overlay-opacity`, `--overlay-blur`, `--card-transparent-opacity` 控制

#### 特效管理
- `setWavesEnabled()`: 水波纹动画开关
- `setGradientEnabled()`: 壁纸底部渐变过渡开关
- `setSakuraEnabled()`: 樱花特效开关，触发 `sakuraToggle` 自定义事件
- `setBannerTitleEnabled()`: 首页横幅标题显示开关
- `setBannerCarouselEnabled()`: 横幅轮播开关，触发 `bannerCarouselChange` 事件

### 7.5 `layout-utils.ts` — 布局工具

- `toArray(src)`: 将单个值或数组统一为数组
- `getBackgroundImages()`: 解析壁纸配置，返回桌面端/移动端的图片数组
- `isBannerSrcObject(src)`: 类型守卫，检查是否为分设备配置
- `getDefaultBackground()`: 返回第一张背景图
- `isHomePage(pathname)`: 检查路径是否为首页（考虑 BASE_URL）
- `getBannerOffset(position)`: 根据图片位置设置返回 CSS offset 值

### 7.6 `responsive-utils.ts` — 响应式布局工具

**功能**: 根据侧边栏配置生成 CSS 网格类。

**`getResponsiveSidebarConfig()`**: 解析 `sidebarLayoutConfig`，返回:
- `isBothSidebars`: 是否为双侧栏
- `hasLeftComponents/hasRightComponents`: 左右侧是否有启用的组件
- `mobileShowSidebar`: 移动端是否显示（硬编码为 false）
- `tabletSidebar`: 平板端显示哪侧

**`generateGridClasses(config)`**: 生成 Tailwind CSS 网格列类
- 单侧栏: `grid-cols-1 md:grid-cols-[17.5rem_1fr]` 或 `[1fr_17.5rem]`
- 双侧栏: `grid-cols-1 md:grid-cols-[17.5rem_1fr] xl:grid-cols-[17.5rem_1fr_17.5rem]`

**`generateSidebarClasses/config`**: 为每个组件区域生成正确的 CSS 定位类。

### 7.7 `crypto-utils.ts` — 内容加密

**功能**: 使用 AES-256-GCM 加密文章内容。

**核心函数**:

**`encryptContent(html, password, slug)`**:
1. 使用 HMAC-SHA256 从 password + slug 派生盐值 (16 bytes) 和 IV (12 bytes)
2. 使用 PBKDF2 (100,000 轮) 从 password + salt 生成 32 字节密钥
3. 使用 AES-256-GCM 加密 HTML 内容
4. 输出格式: `base64(salt[16] + iv[12] + authTag[16] + ciphertext)`

**安全特性**: 
- 确定性加密（相同输入产生相同输出）→ 支持 sessionStorage 密码缓存
- PBKDF2 防暴力破解
- GCM 模式提供认证加密

### 7.8 `image-utils.ts` — 图片处理

- `processCoverImageSync(image, seed?)`: 处理封面图，"api" 则返回随机图 API URL
- `getApiUrlList(image, seed?)`: 获取所有随机图 API URL 列表（客户端按顺序尝试）
- `getImageFormats()`: 获取图片优化格式配置
- `getImageQuality()`: 获取图片压缩质量
- `shouldAddNoReferrer(url)`: 检查是否需要为防盗链图片添加 `referrerpolicy="no-referrer"`

### 7.9 `lqip-utils.ts` — 低质量图片占位符

**功能**: 将构建时生成的颜色数据解码为 CSS 渐变。

**`getLqipGradient(src, basePath?, isPublic?)`**:
- 从 `lqips.json` 读取 18 字符的 hex 数据
- 解码为 3 个颜色: `linear-gradient(135deg, #color1 0%, #color2 50%, #color3 100%)`
- 支持 `src:` 和 `public:` 两种 key 前缀

### 7.10 `gallery-utils.ts` — 相册工具

- `scanAlbumPhotos(albumId)`: 扫描相册目录中的图片 (jpg/png/webp/avif/gif)，同时读取 `urls.txt` 中的远程 URL
- `getAlbumCover(album, photos)`: 获取相册封面（手动指定 > cover.* 文件 > 第一张图片）

### 7.11 `sakura-manager.ts` — 樱花特效引擎

**功能**: 在 Canvas 上绘制飘落的樱花动画。

**实现**:
1. **`Sakura` 类**: 单个樱花粒子，包含位置(x,y)、大小(s)、旋转(r)、透明度(a) 和运动函数
2. **`SakuraList` 类**: 管理所有樱花粒子，负责更新和绘制
3. **`SakuraManager` 类**: 创建 Canvas、初始化樱花列表、启动 requestAnimationFrame 动画循环
4. 运动函数: 水平/垂直速度随机、旋转、透明度衰减
5. 越界处理: 根据 `limitTimes` 配置，-1 无限循环，>0 有限次数

### 7.12 `toc-utils.ts` — 目录管理器

**功能**: 管理文章目录 (Table of Contents) 的生成、高亮和交互。

**`TOCManager` 类**:
- `generateTOCHTML()`: 扫描文章中的 h1-h6 标题，生成目录 HTML（包含层级缩进和徽章）
- `updateActiveState()`: 使用 IntersectionObserver 监听标题可见性，高亮当前阅读位置对应的目录项
- `handleClick()`: 点击目录项平滑滚动到对应标题
- 支持三层标题深度控制

### 7.13 `navigation-utils.ts` — 导航工具

- `navigateToPage(url, options?)`: 统一导航函数，优先使用 Swup 无刷新跳转，降级到普通跳转
- `isSwupReady()`: 检查 Swup 是否可用
- `waitForSwup(timeout)`: 等待 Swup 就绪的 Promise
- `preloadPage(url)`: 使用 Swup 预加载页面

### 7.14 `icon-loader.ts` — 图标加载管理器

**功能**: 管理 Iconify 图标的加载状态。

**`initIconLoader()`**:
1. 查找所有 `[data-icon-container]` 元素
2. 显示加载指示器（旋转的 spinner SVG）
3. 通过 MutationObserver 监听图标的 shadow DOM 加载
4. 加载完成后隐藏指示器，显示图标
5. 5 秒超时保护

### 7.15 `language-utils.ts` — 语言工具

**功能**: 将语言代码映射为显示名称（如 `zh_CN` → "简体中文"）。

---

## 8. 布局系统

### 8.1 `Layout.astro` — 基础 HTML 骨架

**功能**: 提供所有页面的 HTML 骨架，包含 `<head>` 标签和全局脚本。

**关键实现**:

**`<head>` 部分**:
- 设置 charset, viewport, title, meta 标签 (description, keywords, author, og:*, twitter:*)
- 按配置加载统计分析脚本 (Google Analytics, Microsoft Clarity, Umami, 51la)
- 渲染 favicon 链接
- 防盗链图片处理脚本（为指定域名的图片添加 `referrerpolicy="no-referrer"`）
- **主题/壁纸初始化脚本** (内联，`is:inline`): 在页面渲染前执行，避免闪烁

**初始化脚本流程**:
1. 从 localStorage 读取存储的主题/壁纸模式，没有则用配置默认值
2. 解析 system 模式 → 检查系统主题
3. 应用 `html.dark` 类和 `data-theme` 属性
4. 应用 `html[data-wallpaper-mode]` 属性
5. 计算 `--banner-height-extend` CSS 变量（窗口高度的 30%，取 4 的倍数避免模糊）
6. 根据壁纸模式控制 DOM 元素显示/隐藏
7. 应用水波纹/渐变/横幅标题状态

**Swup 页面过渡系统**:
- 使用 `@swup/astro` 实现 SPA 式的无刷新页面切换
- **进度条**: 在 `visit:start` 启动，`visit:end` 完成
- **滚动管理**: 
  - 全屏壁纸非首页 → 滚动到 `#main-grid`
  - 桌面端 → `scrollTo(0, 0)`
- **内容替换**: `content:replace` 钩子中重新初始化 overflow 容器、图标加载、TOC 组件
- **移动端适配**: 首页显示 banner、非首页隐藏 banner 并上移内容

**滚动处理** (`scrollFunction`):
- 控制 "回到顶部" 按钮的显示/隐藏
- 控制 TOC 的显示/隐藏
- 控制导航栏的隐藏（非 sticky 模式下）
- 控制导航栏阴影

**点击外部关闭**: 通过 `setClickOutsideToClose()` 绑定点击事件，关闭浮动面板。

### 8.2 `MainGridLayout.astro` — 主网格布局

**功能**: 提供完整的页面布局：导航栏 + 壁纸/Banner + 网格布局 + 侧边栏 + 页脚。

**核心渲染流程**:

1. **导航栏**: 渲染在 `#top-row` 中，支持 sticky/非 sticky 模式
2. **壁纸/Banner**: 
   - 如果壁纸模式不是 "none" 或 `switchable` 为 true，渲染 `#wallpaper-wrapper`
   - 随机选择背景图片（桌面端/移动端分设备）
   - Banner 轮播（Ken Burns 缩放动画 + 交叉淡入淡出）
3. **首页文字叠加**: 在 banner 上方显示标题和副标题（支持打字机效果）
4. **水波纹动画**: SVG parallax 波浪效果，填充分页面背景色
5. **渐变过渡**: 壁纸底部到背景色的线性渐变
6. **主网格** (`#main-grid`): 
   - 使用 CSS Grid 实现 1-3 列布局
   - 响应式: 移动端单列，平板端 2 列，桌面端 2-3 列
   - 左侧栏/右侧栏/主内容/页脚 通过 Tailwind 网格类定位
7. **看板娘**: Spine 模型或 Live2D 模型
8. **浮动控件**: 回到顶部、显示设置等

**Banner 轮播实现** (`initBannerCarousel` 脚本):
1. 从 template 元素收集所有帧的 HTML
2. 使用 `setInterval` 周期切换
3. 交叉淡入淡出: 创建新层 → opacity 0→1 过渡 → 移除旧层
4. Ken Burns 效果: 图片从 scale(1) 缓慢放大到 scale(1.1)
5. 响应 `bannerCarouselChange` 自定义事件

**网格列动态更新** (`updateMainGridCols`):
- 在文章页且 `showBothSidebarsOnPostPage` 为 true 时，临时扩展为双侧栏
- 动态更新 Tailwind 网格类

---

## 9. 页面路由

### 9.1 `[...page].astro` — 首页 + 分页

**路由**: `/`, `/2/`, `/3/` ...

**实现**:
- 使用 Astro 的 `paginate()` API 对 `getSortedPosts()` 的结果分页
- 分页大小由 `siteConfig.pagination.postsPerPage` 控制
- 渲染 `PostPage` 组件显示文章卡片，`Pagination` 组件显示分页导航
- 客户端脚本添加设备类型类 (`device-mobile/tablet/desktop`) 用于响应式分页

### 9.2 `posts/[...slug].astro` — 文章详情页

**路由**: `/posts/<slug>/`

**实现**:
- 通过 `getStaticPaths()` 为每篇文章生成路由
- `render(entry)` 渲染 Markdown/MDX 内容
- 处理封面图（本地图片转优化 URL，随机图 API URL）
- 显示: 字数统计、阅读时长、标题、元数据、封面图、Markdown 内容
- 加密文章: 用 `EncryptedPost` 包裹，密码正确后才显示内容
- 赞助/分享按钮区域
- 许可证信息 (License)
- "上次编辑时间" 卡片（超过阈值天数显示）
- 上一篇/下一篇导航
- 推荐文章（智能推荐算法）
- 评论区（如果未加密）

**加密文章流程**:
1. 如果 `entry.data.password` 存在，`<EncryptedPost>` 组件渲染密码输入界面
2. 用户在客户端输入密码，通过 AES-256-GCM 解密
3. 解密成功后显示文章内容
4. 密码缓存在 sessionStorage 中（验证 HMAC hash）

### 9.3 `archive.astro` — 归档页

**路由**: `/archive/`

**实现**: 获取所有文章列表，传递给 `ArchivePanel` Svelte 组件。归档面板支持按标签/分类筛选、时间线展示。

### 9.4 `rss.xml.ts` — RSS Feed

**路由**: `/rss.xml`

**实现**:
1. 获取所有已发布文章
2. 加密文章只显示提示文字
3. 非加密文章：通过 Astro Container 渲染为 HTML → `sanitize-html` 清理
4. 使用 `@astrojs/rss` 生成 RSS feed
5. 包含自定义数据: 主题名称、版本、URL、构建时间

### 9.5 其他页面

- **`about.astro`**: 渲染 `spec/about.md` 内容
- **`friends.astro`**: 友链页面，渲染 `spec/friends.mdx`
- **`guestbook.astro`**: 留言板页面 + 评论区
- **`sponsor.astro`**: 赞助页面
- **`bangumi.astro`**: 番组计划页面（需要在构建时从 Bangumi API 获取数据）
- **`search.astro`**: 搜索页面，使用 Pagefind
- **`rss.astro`**: RSS 介绍页面
- **`gallery/index.astro`**: 相册列表首页
- **`gallery/[album].astro`**: 单个相册详情页
- **`404.astro`**: 404 页面
- **`robots.txt.ts`**: 生成 robots.txt
- **`og/[...slug].png.ts`**: 使用 Satori 生成 OpenGraph 社交分享图片
- **`api/allPostMeta.json.ts`**: API 端点，返回所有文章元数据 JSON

---

## 10. 组件系统

### 10.1 组件分类

```
components/
├── analytics/     # 统计分析注入脚本
│   ├── GoogleAnalytics.astro
│   ├── La51Analytics.astro
│   ├── MicrosoftClarity.astro
│   └── UmamiAnalytics.astro
│
├── comment/       # 评论系统
│   ├── index.astro (选择器)
│   ├── Twikoo.astro / Waline.astro / Giscus.astro / Disqus.astro / Artalk.astro
│
├── common/        # 通用基础组件
│   ├── ButtonLink.astro / ButtonTag.astro
│   ├── ClientPagination.astro (客户端分页)
│   ├── CoverImage.astro (封面图，LQIP占位)
│   ├── DropdownItem/Panel (.astro + .svelte)
│   ├── FloatingButton.astro
│   ├── Icon.svelte (SVG 图标)
│   ├── ImageWrapper.astro (响应式图片)
│   ├── Markdown.astro (Markdown 渲染容器)
│   ├── Pagination.astro (分页导航)
│   ├── PioMessageBox.astro (看板娘消息气泡)
│   └── WidgetLayout.astro
│
├── controls/      # 交互控件
│   ├── ArchivePanel.svelte (归档搜索面板)
│   ├── BackToComment/Top/Home.astro
│   ├── DisplaySettings.svelte (显示设置面板)
│   ├── FloatingControls.astro (浮动控件集合)
│   ├── FloatingTOC.astro (浮动目录)
│   ├── LayoutSwitchButton.svelte (列表/网格切换)
│   ├── LightDarkSwitch.svelte (明暗切换)
│   ├── ScrollDownIndicator.astro (向下滚动指示器)
│   ├── Search.svelte (搜索面板)
│   └── WallpaperSwitch.svelte (壁纸模式切换)
│
├── features/      # 功能特性
│   ├── EncryptedContent/Post.astro (加密内容)
│   ├── FancyboxManager.astro (图片灯箱)
│   ├── FontManager.astro (字体加载)
│   ├── KatexManager.astro (数学公式)
│   ├── Live2DWidget.astro (Live2D看板娘)
│   ├── MusicManager/Player.astro (音乐播放器)
│   ├── SakuraEffect.astro (樱花特效)
│   ├── SpineModel.astro (Spine看板娘)
│   └── TypewriterText.astro (打字机效果)
│
├── layout/        # 布局组件
│   ├── CategoryBar.astro (分类导航栏)
│   ├── ConfigCarrier.astro (配置传递)
│   ├── DropdownMenu.astro (下拉菜单)
│   ├── Footer.astro (页脚)
│   ├── Navbar.astro (导航栏)
│   ├── NavMenuPanel.astro (移动端导航面板)
│   ├── PostCard.astro (文章卡片)
│   ├── PostMeta.astro (文章元数据)
│   ├── PostPage.astro (文章列表页)
│   └── SideBar.astro (侧边栏容器)
│
├── misc/          # 杂项
│   ├── License.astro (许可证卡片)
│   ├── RecommendedPost.astro (推荐文章)
│   └── SharePoster.svelte (分享海报生成)
│
├── pages/         # 页面级组件
│   ├── AdvancedSearch.svelte (高级搜索)
│   ├── bangumi/ (番组计划子组件)
│   └── gallery/ (相册子组件)
│
└── widget/        # 侧边栏小部件
    ├── Advertisement.astro (广告)
    ├── Announcement.astro (公告)
    ├── Calendar.astro (日历)
    ├── Categories.astro (分类列表)
    ├── Music.astro (音乐播放器小部件)
    ├── Profile.astro (个人资料)
    ├── SidebarTOC.astro (侧边栏目录)
    ├── SiteStats.astro (站点统计)
    ├── SpineModel.astro (Spine看板娘小部件)
    └── Tags.astro (标签云)
```

### 10.2 关键组件详解

#### `ImageWrapper.astro` — 响应式图片

**功能**: 对 Astro 的 `<Image />` 组件进行封装，提供增强功能。

**实现**:
- 自动生成多种格式 (avif/webp) 和多种尺寸的 `srcset`
- 支持 LQIP 占位符（构建时预生成的颜色渐变，在图片加载前显示）
- 支持自定义 `loading` 策略 (lazy/eager)
- 支持 `referrerpolicy="no-referrer"`（通过 `shouldAddNoReferrer()` 判断）

#### `CoverImage.astro` — 封面图组件

**功能**: 渲染文章封面图，支持随机图 API 和加载失败回退。

**实现**:
- 如果 `image="api"`，客户端 JavaScript 按顺序尝试配置的随机图 API
- 全部 API 失败后显示配置的 fallback 图片
- 加载过程中可以显示加载动画
- 使用 `ImageWrapper` 进行响应式优化
- 点击可以触发 Fancybox 灯箱查看原图

#### `PostCard.astro` — 文章卡片

**功能**: 在文章列表中渲染单篇文章的卡片。

**实现**:
- 显示封面图、标题、描述、日期、标签、分类
- 支持列表 (list) 和网格 (grid) 两种视图模式
- 网格模式支持瀑布流布局 (`masonry`)
- 置顶文章显示特殊标识
- 点击跳转到文章详情页

#### `Navbar.astro` — 导航栏

**功能**: 渲染顶部导航栏。

**实现**:
- 支持三种透明模式 (`semi`/`full`/`semifull`)，与壁纸叠加时有不同透明度效果
- 毛玻璃模糊背景 (通过 CSS `backdrop-filter`)
- 主题色跟随
- 搜索按钮、显示设置按钮、壁纸模式切换按钮
- 移动端汉堡菜单
- sticky 模式下固定在顶部

#### `SharePoster.svelte` — 分享海报

**功能**: 使用 Satori 将文章信息渲染为 SVG，再转为 Canvas → 图片，让用户保存分享。

**实现**:
1. 使用 `satori` 库将 JSX 转为 SVG
2. 使用 Canvas API 将 SVG 绘制到 Canvas
3. 生成二维码（使用 `qrcode` 库）
4. 提供"复制海报"和"保存海报"两个操作
5. 通过 `client:load` 指令仅在客户端加载（Satori 仅支持浏览器环境）

#### `DisplaySettings.svelte` — 显示设置面板

**功能**: 用户自定义界面显示的控制面板。

**实现**:
- 主题色相滑块
- 明暗模式切换
- 壁纸模式切换 (banner/fullscreen/overlay/none)
- 壁纸轮播开关
- 水波纹动画开关
- 樱花特效开关
- 文章列表布局切换 (list/grid)
- Overlay 模式下调整 壁纸透明度/背景模糊/卡片透明度

所有设置通过 `setting-utils.ts` 中的函数保存到 localStorage 并立即应用到 DOM。

#### `EncryptedPost.astro` — 加密文章

**功能**: 提供密码输入界面来解密和显示加密的文章内容。

**实现**:
1. 检查 sessionStorage 中是否有缓存的密码
2. 如果有缓存密码，验证 HMAC hash
3. 验证通过 → 尝试用 AES-256-GCM 解密
4. 解密成功 → 渲染文章内容，触发 `password:decrypted` 事件
5. 解密失败 → 显示密码输入表单
6. 用户输入密码 → 尝试解密 → 缓存密码 hash 到 sessionStorage

---

## 11. Markdown 插件系统

所有 Markdown 插件在 `astro.config.mjs` 中配置，分为 remark 插件（处理 Markdown AST）和 rehype 插件（处理 HTML AST）。

### 11.1 Remark 插件（Markdown → Markdown AST 阶段）

| 插件 | 文件 | 功能 |
|------|------|------|
| `remark-math` | (npm) | 解析数学公式语法 `$...$` / `$$...$$` |
| `remark-reading-time` | `src/plugins/remark-reading-time.mjs` | 计算字数和阅读时间，注入 frontmatter |
| `remark-image-grid` | `src/plugins/remark-image-grid.js` | 为连续的图片段落添加网格布局 class |
| `remark-excerpt` | `src/plugins/remark-excerpt.js` | 提取文章摘要（首段或 `<!-- more -->` 标记前的文本） |
| `remark-directive` | (npm) | 解析 `::name[content]` 指令语法 |
| `remark-sectionize` | (npm) | 按标题将文档分为 `<section>` 区块 |
| `parse-directive-node` | `src/plugins/remark-directive-rehype.js` | 将 directive 节点转为带属性的 HTML 节点 |
| `remark-mermaid` | `src/plugins/remark-mermaid.js` | 预处理 Mermaid 代码块 |
| `remark-plantuml` | `src/plugins/remark-plantuml.js` | 预处理 PlantUML 代码块 |

### 11.2 Rehype 插件（HTML AST 阶段）

| 插件 | 文件 | 功能 |
|------|------|------|
| `rehype-katex` | (npm) | 将数学公式 AST 转为 KaTeX HTML |
| `rehype-callouts` | (npm) | 渲染提示框（admonitions/callouts） |
| `rehype-slug` | (npm) | 为标题元素添加 `id` 属性 |
| `rehype-autolink-headings` | (npm) | 为标题添加锚点链接 `#` |
| `rehype-mermaid` | `src/plugins/rehype-mermaid.mjs` | 渲染 Mermaid 图表为 SVG |
| `rehype-plantuml` | `src/plugins/rehype-plantuml.mjs` | 渲染 PlantUML 图表（通过服务器 API） |
| `rehype-figure` | `src/plugins/rehype-figure.mjs` | 将 `<img>` 包裹在 `<figure>` 中，支持标题 |
| `rehype-external-links` | `src/plugins/rehype-external-links.mjs` | 为外部链接添加 `target="_blank"` 和 `rel` 属性 |
| `rehype-email-protection` | `src/plugins/rehype-email-protection.mjs` | 对邮箱地址进行 base64/rot13 编码防爬虫 |
| `rehype-components` | (npm) | 将 `::github{repo="user/repo"}` 指令渲染为 GitHub 卡片 |
| `GithubCardComponent` | `src/plugins/rehype-component-github-card.mjs` | GitHub 仓库卡片组件（rehype-components 的渲染器） |

---

## 12. 样式系统

### 12.1 CSS 文件

| 文件 | 说明 |
|------|------|
| `main.css` | 全局主样式（Tailwind 基础 + 组件样式） |
| `variables.styl` | Stylus 全局 CSS 变量定义 |
| `markdown.css` | 文章内容排版样式 |
| `markdown-extend.styl` | 扩展的 Markdown 样式（提示框等） |
| `expressive-code.css` | 代码块样式覆盖 |
| `navbar.css` | 导航栏样式 |
| `layout-styles.css` | 布局相关样式 |
| `transition.css` | Swup 页面过渡动画 |
| `toc.css` | 目录组件样式 |
| `scrollbar.css` / `custom-scrollbar.css` | 滚动条样式 |
| `photoswipe.css` | 图片灯箱样式 |
| `fancybox-custom.css` | Fancybox 自定义样式 |
| `waves.css` | 水波纹动画样式 |
| `banner-title.css` | Banner 标题动画样式 |
| `widget-responsive.css` | 小部件响应式样式 |

### 12.2 核心样式架构

项目使用 Tailwind CSS 4（CSS-first 配置），通过 `@tailwindcss/vite` 插件集成。主要依赖:
- Tailwind 底层样式重置
- 自定义 CSS 变量（`--primary`, `--hue`, `--page-bg`, `--card-bg` 等）
- 深色模式通过 `.dark` 类控制
- 主题色通过 HSL 颜色空间和 `--hue` 变量动态变更所有颜色

---

## 13. 构建脚本

### 13.1 `scripts/generate-icons.js`

**功能**: 在构建前扫描源代码，将使用的 Iconify 图标预编译为内联 SVG 字符串，写入 `src/constants/icons.ts`。

**实现**:
1. 扫描 `src/` 下所有 `.astro`, `.svelte`, `.ts` 文件
2. 正则匹配 `icon="xxx:yyy"` 模式
3. 调用 `@iconify/utils` 的 `getIconData` 和 `iconToSVG` 获取 SVG
4. 将 SVG 字符串写入 TypeScript 文件

### 13.2 `scripts/generate-lqips.ts`

**功能**: 生成所有图片的 LQIP (Low Quality Image Placeholder) 颜色数据。

**实现**:
1. 扫描 `src/assets/` 和 `public/` 下的所有图片
2. 使用 Sharp 将图片缩小到极小尺寸
3. 提取 3 个代表色（顶部、中部、底部各取平均色）
4. 编码为 18 字符 hex 字符串
5. 写入 `src/constants/lqips.json`

### 13.3 `scripts/new-post.js`

**功能**: CLI 工具，通过交互式问答创建新文章文件。

**实现**: 使用 Node.js `readline` 模块，收集 title、description、tags、category 等信息，生成带 frontmatter 的 `.md` 文件。

### 13.4 构建流程

```
npm run build:
1. node scripts/generate-icons.js       # 生成内联图标
2. npx tsx scripts/generate-lqips.ts   # 生成 LQIP 数据
3. astro build                          # Astro 静态构建
4. pagefind --site dist                 # 生成 Pagefind 搜索索引
```

---

## 14. CI/CD 与部署

### 14.1 GitHub Actions

**`.github/workflows/deploy.yml`**: 构建并部署到 Vercel（或其他平台）

**`.github/workflows/build.yml`**: PR 构建检查

**`.github/workflows/biome.yml`**: 代码格式和 lint 检查（使用 Biome）

### 14.2 Vercel 配置

`vercel.json` 配置了:
- 输出目录: `dist/`
- SPA 路由回退规则
- 缓存策略

### 14.3 Pagefind 配置

`pagefind.yml` 配置搜索索引的参数，指定索引哪些页面元素。

---

## 15. 数据流总结

### 15.1 构建时数据流

```
配置文件 (src/config/*.ts)
    │
    ▼
Astro 构建 (astro build)
    │
    ├── 文章加载: getCollection("posts") → 过滤草稿 → 排序
    │
    ├── Markdown 渲染: .md/.mdx → remark 插件 → rehype 插件 → HTML
    │
    ├── 布局应用: Layout.astro → MainGridLayout.astro → 页面组件
    │
    ├── 页面生成: [...page].astro / posts/[slug].astro / *.astro
    │
    └── 静态输出: dist/ 目录下的 HTML/CSS/JS/图片
```

### 15.2 客户端数据流

```
浏览器加载 HTML
    │
    ▼
head 内联脚本执行 (theme/wallpaper 初始化)
    │
    ▼
Swup 初始化 (SPA 路由)
    │
    ▼
页面交互:
  ├── 主题切换 → setting-utils.ts → localStorage + CSS 变量 + DOM class
  ├── 壁纸模式切换 → setting-utils.ts → DOM 操作
  ├── 搜索 → Pagefind WASM 模块
  ├── 评论 → 第三方评论系统脚本 (Twikoo/Waline/...)
  ├── 樱花特效 → Canvas 动画循环
  ├── 看板娘 → Live2D/Spine 引擎
  ├── 音乐播放 → APlayer 或 Meting API
  └── 文章加密 → AES-256-GCM 客户端解密
```

### 15.3 配置修改流程

```
用户编辑 src/config/siteConfig.ts
    │
    ▼
重新构建 (npm run build)
    │
    ▼
配置值被硬编码到生成的 HTML/JS 中
(这是静态站点，配置不是运行时可变的)
```

---

## 附录: 关键技术点速查

| 需求 | 关键文件 | 说明 |
|------|---------|------|
| 修改站点标题/URL | `src/config/siteConfig.ts` | `title`, `site_url` 字段 |
| 修改导航菜单 | `src/config/navBarConfig.ts` | `navBarConfig.links` 数组 |
| 修改侧边栏小部件 | `src/config/sidebarConfig.ts` | `leftComponents`/`rightComponents` |
| 添加评论系统 | `src/config/commentConfig.ts` | `type` + 对应服务的配置 |
| 修改壁纸图片 | `src/config/backgroundWallpaper.ts` | `src` 字段 |
| 修改主题色 | `src/config/siteConfig.ts` | `themeColor.hue` (0-360) |
| 文章加密 | 文章 frontmatter | 设置 `password` 字段 |
| 添加新语言 | `src/i18n/languages/` | 新建语言文件 + 注册到 `translation.ts` |
| 修改 Markdown 渲染 | `astro.config.mjs` | remarkPlugins / rehypePlugins 数组 |
| 修改页面过渡动画 | `src/styles/transition.css` | Swup 动画样式 |
| 标签/分类 URL | `src/utils/url-utils.ts` | `getTagUrl()`, `getCategoryUrl()` |
| 推荐文章算法 | `src/utils/content-utils.ts` | `getRelatedPosts()` |
| 主题/壁纸设置存储 | `src/utils/setting-utils.ts` | localStorage 读写 + DOM 应用 |
| LQIP 占位符 | `src/utils/lqip-utils.ts` + `scripts/generate-lqips.ts` | 构建时颜色提取 + 客户端渐变渲染 |
