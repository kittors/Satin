# 设计稿本地预览：和 python3 -m http.server 一样，另外：
# · 每个响应都带 Cache-Control: no-cache + ETag（按修改时间和大小）：浏览器每次都来问一下，文件没改就回 304，
#   直接用缓存里的（脚本还能用编译缓存）；改完刷新照样是最新的。以前用 no-store，每个演示 iframe 都要把几十个文件重新下载、重新编译一遍
# · HTTP/1.1 长连接，避免浏览器并发取模块时偶发的连接被重置
# 用法：python3 serve.py 端口 目录
import functools
import http.server
import os
import sys


class Dev(http.server.SimpleHTTPRequestHandler):
    protocol_version = "HTTP/1.1"
    _tag = None

    def _etag(self):
        p = self.translate_path(self.path)
        if os.path.isdir(p):
            if not self.path.split("?", 1)[0].split("#", 1)[0].endswith("/"):
                return None  # 目录不带斜杠：交给父类重定向
            p = os.path.join(p, "index.html")
        try:
            st = os.stat(p)
        except OSError:
            return None
        return f'"{st.st_mtime_ns:x}-{st.st_size:x}"'

    def send_head(self):
        self._tag = self._etag()
        if self._tag and self.headers.get("If-None-Match") == self._tag:
            self.send_response(304)  # 304 没有正文，也不带 Content-Length
            self.end_headers()
            return None
        return super().send_head()

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache")
        if self._tag:
            self.send_header("ETag", self._tag)
        self._tag = None
        super().end_headers()

    def log_message(self, *args):
        pass


port, root = int(sys.argv[1]), sys.argv[2]
server = http.server.ThreadingHTTPServer(("127.0.0.1", port), functools.partial(Dev, directory=root))
server.daemon_threads = True
server.serve_forever()
