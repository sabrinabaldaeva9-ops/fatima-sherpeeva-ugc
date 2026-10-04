"""Builds transparent RGBA frames from render passes.
alpha = mask; foreground colour is un-mixed from the studio backdrop; glow/shadow layer goes underneath.
usage: composite.py <passDir> <outDir>"""
import sys, glob, os
import numpy as np
from PIL import Image

src, dst = sys.argv[1:3]
os.makedirs(dst, exist_ok=True)
ld = lambda p: np.asarray(Image.open(p).convert('RGBA'), dtype=np.float32) / 255.0

for mp in sorted(glob.glob(os.path.join(src, 'mask_*.png'))):
    tag = os.path.basename(mp)[5:-4]
    a = ld(mp)[..., :1].clip(0, 1)
    body = ld(os.path.join(src, f'body_{tag}.png'))[..., :3]
    bg = ld(os.path.join(src, f'plate_{tag}.png'))[..., :3]
    fx = ld(os.path.join(src, f'fx_{tag}.png'))
    safe = np.maximum(a, 1e-3)
    fg = ((body - (1 - a) * bg) / safe).clip(0, 1)
    fg = np.where(a > 0.004, fg, 0)
    # composite body over fx (straight alpha "over")
    fa = fx[..., 3:4]
    fc = fx[..., :3]
    oa = a + fa * (1 - a)
    oc = (fg * a + fc * fa * (1 - a)) / np.maximum(oa, 1e-4)
    out = np.concatenate([oc, oa], -1).clip(0, 1)
    Image.fromarray((out * 255 + 0.5).astype(np.uint8), 'RGBA').save(os.path.join(dst, f'{tag}.png'))
    Image.fromarray((np.concatenate([fg, a], -1).clip(0, 1) * 255 + .5).astype(np.uint8), 'RGBA').save(os.path.join(dst, f'{tag}_body.png'))
print('done')
