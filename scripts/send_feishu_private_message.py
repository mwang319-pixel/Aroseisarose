#!/usr/bin/env python3
"""Send a private Feishu message with report metadata.

Environment variables:
  FEISHU_APP_ID
  FEISHU_APP_SECRET
  FEISHU_OPEN_ID

Example:
  FEISHU_APP_ID=... FEISHU_APP_SECRET=... FEISHU_OPEN_ID=... \
  python3 send_feishu_private_message.py \
    --title "2026-03-30 彩妆趋势日报已生成" \
    --summary "唇部创新加速" \
    --summary "水彩腮红升温" \
    --link "https://example.com/report.html"
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request


AUTH_URL = "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal"
MESSAGE_URL = "https://open.feishu.cn/open-apis/im/v1/messages?receive_id_type=open_id"


def require_env(name: str) -> str:
    value = os.getenv(name, "").strip()
    if not value:
        raise SystemExit(f"Missing required environment variable: {name}")
    return value


def post_json(url: str, payload: dict, headers: dict[str, str] | None = None) -> dict:
    encoded = json.dumps(payload).encode("utf-8")
    request = urllib.request.Request(
        url,
        data=encoded,
        headers={"Content-Type": "application/json", **(headers or {})},
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        raise SystemExit(f"HTTP {exc.code} calling Feishu API: {body}") from exc
    except urllib.error.URLError as exc:
        raise SystemExit(f"Network error calling Feishu API: {exc}") from exc


def fetch_tenant_access_token(app_id: str, app_secret: str) -> str:
    response = post_json(
        AUTH_URL,
        {"app_id": app_id, "app_secret": app_secret},
    )
    if response.get("code") != 0:
        raise SystemExit(f"Failed to fetch tenant_access_token: {response}")
    token = response.get("tenant_access_token")
    if not token:
        raise SystemExit(f"Missing tenant_access_token in response: {response}")
    return token


def build_text(title: str, summaries: list[str], link: str | None, footer: str | None) -> str:
    lines = [title]
    if summaries:
        lines.append("")
        for item in summaries:
            lines.append(f"- {item}")
    if link:
        lines.append("")
        lines.append(f"查看链接：{link}")
    if footer:
        lines.append("")
        lines.append(footer)
    return "\n".join(lines)


def send_private_text_message(token: str, open_id: str, text: str) -> dict:
    payload = {
        "receive_id": open_id,
        "msg_type": "text",
        "content": json.dumps({"text": text}, ensure_ascii=False),
    }
    response = post_json(
        MESSAGE_URL,
        payload,
        headers={"Authorization": f"Bearer {token}"},
    )
    if response.get("code") != 0:
        raise SystemExit(f"Failed to send Feishu message: {response}")
    return response


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Send a private Feishu report message.")
    parser.add_argument("--title", required=True, help="Message title shown in the first line.")
    parser.add_argument(
        "--summary",
        action="append",
        default=[],
        help="One summary bullet. Repeat the flag to add multiple bullets.",
    )
    parser.add_argument("--link", help="Optional report URL.")
    parser.add_argument("--footer", help="Optional footer note.")
    parser.add_argument(
        "--print-only",
        action="store_true",
        help="Print the rendered message and exit without calling Feishu APIs.",
    )
    return parser.parse_args(argv)


def main(argv: list[str]) -> int:
    args = parse_args(argv)
    text = build_text(args.title, args.summary, args.link, args.footer)

    if args.print_only:
        print(text)
        return 0

    app_id = require_env("FEISHU_APP_ID")
    app_secret = require_env("FEISHU_APP_SECRET")
    open_id = require_env("FEISHU_OPEN_ID")

    token = fetch_tenant_access_token(app_id, app_secret)
    response = send_private_text_message(token, open_id, text)
    message_id = response.get("data", {}).get("message_id", "")
    print(f"Feishu message sent successfully. message_id={message_id}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
