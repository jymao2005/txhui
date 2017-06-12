cd /tmp/codeintel
tar xf CodeIntel-0.9.3.tar.gz

mv CodeIntel-0.9.3/SilverCity CodeIntel-0.9.3/silvercity
tar czf CodeIntel-0.9.3.tar.gz CodeIntel-0.9.3
pip install -U --no-index --find-links=/tmp/codeintel codeintel
