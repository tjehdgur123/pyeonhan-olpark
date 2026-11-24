# 사전 원본(dict_src.py) → i18n-dict.js
import json, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from dict_src import D
out = {'en': {}, 'ja': {}, 'zh': {}}
for row in D:
    ko, en, ja, zh = row
    out['en'][ko] = en; out['ja'][ko] = ja; out['zh'][ko] = zh
js = '// 자동 생성: tools/build_dict.py (원본 tools/dict_src.py)\nwindow.I18N_DICT = ' + json.dumps(out, ensure_ascii=False, separators=(',', ':')) + ';\n'
open(os.path.join(os.path.dirname(__file__), '..', 'i18n-dict.js'), 'w').write(js)
print(len(D), 'entries')
