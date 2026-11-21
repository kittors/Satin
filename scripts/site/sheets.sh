#!/bin/sh
# 把 header.mjs 拍的顶栏截图拼成几张总览（每张：一个页面 × 一种主题，各宽度的页面顶部 / 滚动后各一行，只取顶上一截），方便逐处看。
# 1920 宽的缩到 1440；手机（2 倍图）缩回 1 倍。用法：sh scripts/site/sheets.sh [/tmp/satin-header-restore]
D=${1:-/tmp/satin-header-restore}
mkdir -p "$D/sheets"
for k in home docs; do for t in light dark; do
  args=""
  for w in 1920 1440 1280 1024 861 860 768 390; do for s in top scrolled; do
    f="$D/$k-$t-$w-$s.png"; [ -f "$f" ] || continue
    out="$D/sheets/.$k-$t-$w-$s.png"
    if [ "$w" -lt 768 ]; then magick "$f" -crop "x144+0+0" +repage -resize 50% -background white -gravity northwest -extent 1440x72 "$out"
    else magick "$f" -crop "x96+0+0" +repage -resize "1440x>" -background white -gravity northwest -extent 1440x96 "$out"; fi
    args="$args -label $w-$s $out"
  done; done
  # shellcheck disable=SC2086
  magick montage $args -tile 1x -geometry +0+4 -pointsize 13 -background '#d8d8d8' "$D/sheets/$k-$t.png"
  rm -f "$D/sheets/.$k-$t-"*.png
done; done
ls "$D/sheets"
