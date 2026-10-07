"""Render passes → transparent RGBA.
alpha = silhouette mask · colour un-mixed from the backdrop plate · glow/shadow/caustic under · sparkles over.
usage: python3 composite.py <passDir> <out.png> [tag=still]"""
import sys, os
import numpy as np
from PIL import Image

src, out = sys.argv[1:3]
tag = sys.argv[3] if len(sys.argv) > 3 else 'still'
ld = lambda n: np.asarray(Image.open(os.path.join(src, f'{n}_{tag}.png')).convert('RGBA'), dtype=np.float32) / 255.0

a = ld('mask')[..., :1]
body = ld('body')[..., :3]
plate = ld('plate')[..., :3]
fg = np.where(a > 0.004, ((body - (1 - a) * plate) / np.maximum(a, 1e-3)).clip(0, 1), 0)
fx = ld('fx')
fa, fc = fx[..., 3:4], fx[..., :3]
oa = a + fa * (1 - a)
oc = (fg * a + fc * fa * (1 - a)) / np.maximum(oa, 1e-4)
if os.path.exists(os.path.join(src, f'spark_{tag}.png')):
    sp = ld('spark')
    sa = sp[..., 3:4]
    prem = oc * oa + sp[..., :3] * sa
    oa = np.clip(oa + sa * (1 - oa), 0, 1)
    oc = prem / np.maximum(oa, 1e-4)
Image.fromarray((np.concatenate([oc, oa], -1).clip(0, 1) * 255 + 0.5).astype(np.uint8), 'RGBA').save(out)
