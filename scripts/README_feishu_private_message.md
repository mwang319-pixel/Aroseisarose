# 飞书私发脚本

文件：
`/Users/melissawang/Documents/Playground/Arose/scripts/send_feishu_private_message.py`

用途：
生成日报后，把标题、摘要和链接私发到你自己的飞书。

## 依赖

- 不需要 `feishu cli`
- 不需要第三方 Python 包
- 只用 Python 标准库

## 环境变量

```bash
export FEISHU_APP_ID="你的 App ID"
export FEISHU_APP_SECRET="你的 App Secret"
export FEISHU_OPEN_ID="你的 open_id"
```

## 最小用法

```bash
python3 /Users/melissawang/Documents/Playground/Arose/scripts/send_feishu_private_message.py \
  --title "2026-03-30 彩妆趋势日报已生成" \
  --summary "唇部创新加速" \
  --summary "水彩腮红升温" \
  --summary "包装即产品" \
  --link "https://你的在线链接"
```

## 只预览消息内容

```bash
python3 /Users/melissawang/Documents/Playground/Arose/scripts/send_feishu_private_message.py \
  --title "测试标题" \
  --summary "测试摘要 1" \
  --summary "测试摘要 2" \
  --link "https://example.com" \
  --print-only
```

## 推荐接入方式

日报生成完成后，调用一次这个脚本。

例如：

```bash
python3 /Users/melissawang/Documents/Playground/Arose/scripts/send_feishu_private_message.py \
  --title "2026-03-30 彩妆趋势日报已生成" \
  --summary "唇部仍是最明确的增长中枢" \
  --summary "春季主线是局部表达，不是全脸重修饰" \
  --summary "建议立即建立唇部创新 watchlist" \
  --link "https://你的固定 slides 链接"
```

## 安全提醒

- 不要把 `App Secret` 写进脚本文件里
- 建议放到 shell 环境变量里
- 如果密钥曾暴露，记得去飞书后台轮换
